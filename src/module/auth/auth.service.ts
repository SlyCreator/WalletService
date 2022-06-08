import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async create(signupDto: SignupDto) {
    const user = this.userService.create(signupDto);
    return user;
  }

  async login(LoginDto: LoginDto) {
    const user = await this.validateUser(LoginDto);
    delete user.password
    const payload = {
      userId: user.id,
    };

    return {
        "status":"success",
        "message":"login successfully",
        "data":{
          user: user,
          access_token: this.jwtService.sign(payload),
        },
    };
  }

  async validateUser(LoginDto: LoginDto): Promise<User> {
    const { email, password } = LoginDto;

    const user = await this.userService.findByEmail(email);
    if (!(await user?.validatePassword(password))) {
      throw new UnauthorizedException();
    }

    return user;
  }

}
