import {
  Body,
  Controller, HttpCode, HttpStatus, Post, UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { SignupDto } from '../auth/dto/signup.dto';
import { UpdatePinDto } from './dto/update-pin-dto';
import { AuthUser } from '../../decorators/auth-user-decorator';
import { CreatePinDto } from './dto/create-pin-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}


  @Post('/create-pin')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  create_pin(@AuthUser() authUser ,@Body() createPinDto:CreatePinDto) {
    return  this.usersService.create_pin(authUser,createPinDto);

  }
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/update-pin')
  update_pin(@AuthUser() authUser ,@Body() walletDto:UpdatePinDto) {
    return this.usersService.update_pin(authUser,walletDto);
  }

}
