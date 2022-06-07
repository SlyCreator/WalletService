import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PayStackService } from './paystack.service';

@Module({
  imports:[HttpModule.registerAsync({
    useFactory: () => ({
      timeout: 5000,
      maxRedirects: 5,
    }),
  })],
 providers:[PayStackService],
  exports:[PayStackService]
})
export class PayStackModule {}
