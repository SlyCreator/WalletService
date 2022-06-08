import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEntity, Repository } from 'typeorm';
import { UpdateResult } from 'typeorm';
import { SignupDto } from '../../auth/dto/signup.dto';
import { UpdatePinDto } from '../dto/update-pin-dto';
import { AuthUser } from '../../../decorators/auth-user-decorator';
import { CreatePinDto } from '../dto/create-pin-dto';
import { UserWalletService } from './user-wallet.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userWalletService: UserWalletService
  ) {
  }

  async create(signupDto: SignupDto) {
    const user = new User()
    user.fullname = signupDto.fullname
    user.password = signupDto.password
    user.email = signupDto.email
    await user.save();

    return user;
  }

  async fetchAuth(@AuthUser() authUser): Promise<User> {
    const user = await this.findById(authUser.userId);
    delete user.password;
    return user;
  }

  async findById(id: number) {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    delete user.password
    return user;
  }

  async findByEmail(email: string) {
    return await User.findOne({
      where: {
        email: email,
      },
    });
  }

  async create_pin(authUser, walletDto: CreatePinDto) {
    const { user, status } = await this.prepareWalletUpdate(authUser, walletDto)
    if (status) {
      throw new BadRequestException({
        "status": "error",
        "message": "You cannot perform this action twice,try updating your pin!"
      });
    }
    user.wallet_pin = walletDto.new_pin
    return this.updateUser(user)

  }

  async update_pin(authUser, walletDto: UpdatePinDto) {
    const { user, status } = await this.prepareWalletUpdate(authUser, walletDto)
    if (!status) {
      throw new BadRequestException({
        "status": "error",
        "message": "You cannot perform this action,Try creating your pin!"
      });
    }
    await this.userWalletService.validatePin(user, walletDto.current_pin)
    user.wallet_pin = walletDto.new_pin
    user.wallet_pin = walletDto.new_pin

    return this.updateUser(user)
  }

  async prepareWalletUpdate(authUser, walletDto) {
    await this.userWalletService.confirmPinMatches(walletDto.new_pin, walletDto.confirmation_pin)
    const user = await this.fetchAuth(authUser);
    const status = await this.userWalletService.userHasWalletPin(user);
    return { user, status }
  }

  async updateUser(user: User) {
    const state = await this.userRepository.update(user.id, user);
    if (state.affected == 1) {
      return {
        "status": "success",
      }
    }
  }

}
