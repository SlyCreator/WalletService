import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/services/user.service';
import { PayStackService } from '../../service/paystack/paystack.service';
import { InitDto } from '../../service/paystack/dto/init-dto';
import { UserWalletService } from '../user/services/user-wallet.service';


@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private readonly usersWalletService: UserWalletService,
    private readonly userService: UserService,
    private paystack: PayStackService
  ) {}

  async create(authUser,createTransactionDto: CreateTransactionDto) {
   const user = await this.transactionPrecondition(authUser)
    const paystackData ={
      amount : createTransactionDto.amount,
      email: user.email
    }
    const paystack = await this.paystack.initialize(paystackData)
    console.log(paystack)
    const transaction = new Transaction()
    transaction.amount = createTransactionDto.amount
    transaction.type =  'deposit'
    transaction.status = 'pending';
    transaction.payment_url = ''
    transaction.user = user;
    return transaction;
  }

  async createWithdrawal(authUser,createTransactionDto: CreateTransactionDto) {
    const user = await this.transactionPrecondition(authUser)
    if (user.wallet_amount < createTransactionDto.amount){
        throw new ForbiddenException({"error":"You dont have enough balance please update amount"});
    }
    const transaction = new Transaction()
    transaction.amount = createTransactionDto.amount
    transaction.type =  'withdrawal'
    transaction.status = 'pending';
    transaction.user = user;
    return transaction;
  }


  findAll() {
    return this.transactionRepository.findAndCount();
  }


  async update(reference: string) {
    const verify = await this.paystack.verifyPayment(reference)
    if (!verify){
      return {"error":"payment not successful"}
    }
      const transaction = await this.findByOne({reference:reference})
            transaction.status = 'paid'

    return this.transactionRepository.update(transaction.id,transaction);
  }

  async findByOne({ ...data }){
    return await Transaction.findOne({
      where:{
        ...data
      }
    })
  }

  async transactionPrecondition(authUser)
  {
    const user = await this.userService.fetchAuth(authUser.userId)
    const status = await this.usersWalletService.userHasWalletPin(user);
    if (!status) {
      throw new BadRequestException({
        "status": "error",
        "message": "You cannot perform this action twice,try creating your pin!"
      });
    }
    return user;
  }

}
