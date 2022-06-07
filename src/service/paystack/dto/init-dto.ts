import { IsNotEmpty } from 'class-validator';

export class InitDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  email: string;
}
