import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/services/user.service';
import { JwtStrategy } from './jwt.strategy';
import { SignupDto } from './dto/signup.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService ={
    create:jest.fn((dto)=>{
      return{
        ...dto,
        id: 1
      }
    })
  }

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
      controllers: [AuthController],

    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('should create a user object', ()=>{
    const dto = new SignupDto()
    // expect(controller.create(dto)).toEqual()
    expect(mockAuthService).toBeCalledWith(dto)
  });

});
