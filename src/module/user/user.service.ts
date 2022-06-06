import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntity, Repository } from 'typeorm';
import { UpdateResult } from 'typeorm';
import { SignupDto } from '../auth/dto/signup.dto';
import { UpdatePinDto } from './dto/update-pin-dto';
import { AuthUser } from '../../decorators/auth-user-decorator';
import { CreatePinDto } from './dto/create-pin-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(signupDto: SignupDto) {
    const user = new User()
    user.fullname = signupDto.fullname
    user.password = signupDto.password
    user.email = signupDto.email
    await user.save();
    return user;
  }
  async showById(id: number): Promise<User> {
    const user = await this.findById(id);
    delete user.password;
    return user;
  }

  async create_pin(authUser, walletDto: CreatePinDto): Promise<UpdateResult> {
    const user = await this.confirmPin(authUser,walletDto);
    user.wallet_pin = walletDto.new_pin
    return await this.userRepository.update(user.id, user);
  }

  async update_pin(authUser, walletDto: UpdatePinDto): Promise<UpdateResult> {
    const user =await this.validatePin(authUser,walletDto)
    user.wallet_pin = walletDto.new_pin
    return await this.userRepository.update(user.id, user);
  }

  async findById(id: number) {
    return await User.findOne({
      where: {
        id: id,
      },
    });
  }

  async findByEmail(email: string) {
    return await User.findOne({
      select:['id','email','password','fullname'],
      where: {
        email: email,
      },
    });
  }

  async validatePin(authUser,walletDto: UpdatePinDto): Promise<User> {

    const { new_pin,current_pin,confirmation_pin } = walletDto;
    if (new_pin != confirmation_pin){
      throw new UnauthorizedException();
    }
    const user = await this.findById(authUser.userId);
    if (!(await user?.validatePin(current_pin))) {
      throw new UnauthorizedException();
    }

    return user;
  }
  async confirmPin(authUser,walletDto: CreatePinDto): Promise<User> {
    const { new_pin,confirmation_pin } = walletDto;
    if (new_pin != confirmation_pin){
      throw new UnauthorizedException();
    }
    const user = await this.findById(authUser.userId);

    // if (user.wallet_pin != null) {
    //   throw new ForbiddenException({},"please updated your pin as your pin has been created");
    // }
    return user;
  }
}
