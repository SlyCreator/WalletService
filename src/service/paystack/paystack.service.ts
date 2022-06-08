import { Injectable, Optional } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InitDto } from './dto/init-dto';


@Injectable()
export class PayStackService {
  constructor(
    private readonly httpService: HttpService,
    @Optional()
    private readonly HOST: string = 'api.paystack.co' ) {}

  async initialize(data:InitDto){
    const res =  this.httpService.post(
      `${this.HOST}/transaction/initialize`, data,
      {headers: {
          Authorization: `Bearer ${process.env['PAYSTACK_SECRET']}`,
          'Content-Type': 'application/json'
        }
      })
    return res
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
