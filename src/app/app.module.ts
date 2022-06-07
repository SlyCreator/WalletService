import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../module/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../module/user/entities/user.entity';
import { UserModule } from '../module/user/user.module';
import { Transaction } from '../module/transaction/entities/transaction.entity';
import { TransactionModule } from '../module/transaction/transaction.module';
import { PayStackModule } from '../service/paystack/paystack.module';

const entities = [User,Transaction];
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
    UserModule,
    TransactionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
