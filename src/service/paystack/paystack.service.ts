import { Injectable, Optional } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InitDto } from './dto/init-dto';
import { lastValueFrom, map } from 'rxjs';


@Injectable()
export class PayStackService {
  constructor(
    private readonly httpService: HttpService,
    @Optional()
    private readonly HOST: string = 'api.paystack.co' ) {}

  async initialize(data:InitDto){

    const k = await lastValueFrom(
      this.httpService.post(
        `${this.HOST}/transaction/initialize`, data,
        {headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_PUBLIC_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      ).pipe(
        map((response) => {
          return response.data;
        })
      )

    )
    return k;
  }
  async verifyPayment(reference:string){
    return this.httpService.get(
      `${this.HOST}/https://api.paystack.co/transaction/verify/${reference}`,
      {headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_PUBLIC_KEY}`,
          'Content-Type': 'application/json'
        }
      })

  }

}
