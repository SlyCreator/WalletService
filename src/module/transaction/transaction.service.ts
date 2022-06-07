import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { PayStackService } from '../../service/paystack/paystack.service';
import { InitDto } from '../../service/paystack/dto/init-dto';


@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private readonly usersService: UserService,
    private paystack: PayStackService
  ) {}

  async create(authUser,createTransactionDto: CreateTransactionDto) {
    const user = await this.usersService.fetchAuth(authUser.userId)
    await this.usersService.checkForWalletPin(user)
    const paystackData ={
      amount : createTransactionDto.amount,
      email: user.email
    }
    const paystack = await this.paystack.initialize(paystackData)
    const transaction = new Transaction()
    transaction.amount = createTransactionDto.amount
    transaction.type =  'deposit'
    transaction.status = 'pending';
    transaction.payment_url = ''
    transaction.user = user;
    return transaction;
  }

  async createWithdrawal(authUser,createTransactionDto: CreateTransactionDto) {

    const user = await this.usersService.fetchAuth(authUser.userId)
    await this.usersService.checkForWalletPin(user)

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

}
