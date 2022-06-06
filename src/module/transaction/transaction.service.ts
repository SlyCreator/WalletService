import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private readonly usersService: UserService
  ) {}

  async create(authUser,createTransactionDto: CreateTransactionDto) {

    const user = await this.usersService.fetchAuth(authUser.userId)

    await this.usersService.checkForWalletPin(user)

    const transaction = new Transaction()
    transaction.amount = createTransactionDto.amount
    transaction.type =  'deposit'
    transaction.status = 'pending';
    transaction.user = user;
    return transaction;
  }

  async createWithdrawal(authUser,createTransactionDto: CreateTransactionDto) {

    const user = await this.usersService.fetchAuth(authUser.userId)
    await this.usersService.checkForWalletPin(user)

    if (user.wallet_amount < createTransactionDto.amount){
      if (user.wallet_pin != null) {
        throw new ForbiddenException({},"You dont have enough balance please update amount");
      }
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


  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }


}
