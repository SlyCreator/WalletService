import { Injectable } from '@nestjs/common';
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
    const transaction = new Transaction()
    transaction.amount = createTransactionDto.amount
    transaction.type =  createTransactionDto.type
    transaction.status = 'pending';
    transaction.user = user;
    return transaction;
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
