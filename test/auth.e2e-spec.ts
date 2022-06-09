import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/module/auth/auth.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/module/user/entities/user.entity';
import fn = jest.fn;
import exp from 'constants';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const mockAuthRepository = {
    create: jest.fn().mockResolvedValue({
    save: jest.fn().mockImplementation((user)=>
      Promise.resolve({token:''}))
    })
  }
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule]
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockAuthRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Register',()=>{
    it('/auths/register (POST) -> should create user', () => {
      return request(app.getHttpServer())
        .post('/auths/register')
        .send({email:'chi@gmail.com',password:'eeeeeeee',fullname:'eeee'})
        .expect(201)
        .then(res =>{
          expect(res.body).toEqual({
            id:expect.any(Number)
          })
        })
    });
    it('/auths/register (POST) --> 400 on validation error', function() {
      return request(app.getHttpServer())
        .post('/auths/register')
        .expect(400)
    });
    it('should return 400,email is required', function() {
      return request(app.getHttpServer())
        .post('/auths/register')
        .send({password:'password'})
        .expect(400)
    });
    it('should return 400,email already in use', function() {
      return request(app.getHttpServer())
        .post('/auths/register')
        .expect(400)
    });
  })
  describe('login',()=>{

    it('should login user', function() {
      it('/auths/login (POST) -> should create user', () => {
        return request(app.getHttpServer())
          .post('/auths/login')
          .send({email:'chi@gmail.com',password:'eeeeeeee',fullname:'eeee'})
          .expect(201)
          .then(res =>{
            expect(res.body).toEqual({
              id:expect.any(Number)
            })
          })
      });
      it('/auths/register (POST) --> 400 on validation error', function() {
        return request(app.getHttpServer())
          .post('/auths/register')
          .expect(400)
      });
      it('should return 400,email is required', function() {
        return request(app.getHttpServer())
          .post('/auths/register')
          .send({password:'password'})
          .expect(400)
      });
      it('should return 400,email already in use', function() {
        return request(app.getHttpServer())
          .post('/auths/register')
          .expect(400)
      });
    });
  })
});
