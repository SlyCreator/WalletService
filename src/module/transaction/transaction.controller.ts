import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthUser } from '../../decorators/auth-user-decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/deposit')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  deposit(@AuthUser() authUser, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(authUser,createTransactionDto);
  }


  @Post('/withdraw')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  withdrawPayment(@AuthUser() authUser,@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.createWithdrawal(authUser,createTransactionDto);
  }

  @Patch(':reference/verify')
  update(@Param('reference') reference: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(reference);
  }

}
