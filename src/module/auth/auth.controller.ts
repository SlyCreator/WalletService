import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auths')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('/register')
  create(@Body() signupDto: SignupDto) {
    return this.authService.create(signupDto);
  }
  @UsePipes(ValidationPipe)
  @Post('/login')
  login(@Body() loginDto:LoginDto) {
    return this.authService.login(loginDto);
  }

}
