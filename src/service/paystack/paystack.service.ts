import {  Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InitDto } from './dto/init-dto';


@Injectable()
export class PayStackService {
  constructor(
    private readonly httpService: HttpService,
    private readonly HOST: string = 'api.paystack.co' ) {}

  async initialize(data:InitDto){
    return this.httpService.post(
      `${this.HOST}/transaction/initialize`, data,
      {headers: {
          Authorization: `Bearer ${process.env['PAYSTACK_SECRET']}`,
          'Content-Type': 'application/json'
        }
      })
  }
  async verifyPayment(reference:string){
    return this.httpService.get(
      `${this.HOST}/https://api.paystack.co/transaction/verify/${reference}`,
      {headers: {
          Authorization: `Bearer ${process.env['PAYSTACK_SECRET']}`,
          'Content-Type': 'application/json'
        }
      })

  }

}
