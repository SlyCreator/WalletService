import {  IsNotEmpty } from 'class-validator';

export class CreatePinDto {

  @IsNotEmpty()
  new_pin: string;

  @IsNotEmpty()
  confirmation_pin: string;
}
