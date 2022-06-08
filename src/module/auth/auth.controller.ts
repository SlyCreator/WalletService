import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpStatus, HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { STATUS_CODES } from 'http';

@Controller('auths')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() signupDto: SignupDto) {
    return this.authService.create(signupDto);
  }
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  login(@Body() loginDto:LoginDto) {
    return this.authService.login(loginDto);
  }

}
