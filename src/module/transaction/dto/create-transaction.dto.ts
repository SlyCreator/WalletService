import { IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  status: string;
}
