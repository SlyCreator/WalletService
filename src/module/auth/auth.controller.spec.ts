import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/services/user.service';
import { JwtStrategy } from './jwt.strategy';

describe('AuthController', () => {
  let controller: AuthController;
  let service:AuthService
  const  data = {
    fullname:'Sylvester',
    email:'syl@gmail.com',
    password:'password'
  }
  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: AuthService,
      useFactory: () => ({
        saveUser: jest.fn(() => []),
        login: jest.fn(() => []),
      })
    }
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [AuthService,ApiServiceProvider],
      controllers: [AuthController],

    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  describe('registerUser',()=>{

    it('should create a user object', function() {
      controller.create(data)
      expect(data).toBeCalledWith(201);
    });
  })

  describe('userCanLogin',()=>{
    const loginData = {
      email: 'sly@gmail.com',
      password: 'password'
    }
    it('',function() {
      controller.login(loginData)
      expect(data).toBeCalledWith(200)
    })
  })

});
