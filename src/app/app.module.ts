import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../module/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../module/user/entities/user.entity';
import { UserModule } from '../module/user/user.module';

const entities = [User];
@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal:true
    }),
    TypeOrmModule.forRoot({
      type:'sqlite',
      database:'db',
      //entities: [__dirname + '/**/*.entity{.ts,.js}'],
      entities: entities,
      synchronize: true,
    }),
    AuthModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
