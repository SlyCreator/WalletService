import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthUser } from '../../decorators/auth-user-decorator';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/deposit')
  deposit(@AuthUser() authUser, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(authUser,createTransactionDto);
  }

  @Post('/verify-payment')
  verifyPayment(@Body() createTransactionDto: CreateTransactionDto) {
  //  return this.transactionService.create(createTransactionDto);
  }

  @Post()
  withdrawPayment(@AuthUser() authUser,@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(authUser,createTransactionDto);
  }


}
