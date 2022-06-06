import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdatePinDto {

  @IsNotEmpty()
  current_pin: string;

  @IsNotEmpty()
  new_pin: string;

  @IsNotEmpty()
  confirmation_pin: string;
}
