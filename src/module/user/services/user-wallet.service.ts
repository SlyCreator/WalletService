import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../entities/user.entity';


@Injectable()
export class UserWalletService {

  async validatePin(user:User,current_pin: string): Promise<User> {

    if (!(await user?.validateWalletPin(current_pin))) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async confirmPinMatches(pin,confirmation_pin): Promise<Boolean> {
    if (pin != confirmation_pin){
      throw new BadRequestException("Ensure your new pin matches each-other");
    }
    return true;
  }

  async userHasWalletPin(user:User):Promise<Boolean>{
    if (user.wallet_pin == null) {
      return false
    }
    return true
  }

}
