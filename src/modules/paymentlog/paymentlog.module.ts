import { Module } from '@nestjs/common';
import { PaymentlogService } from './paymentlog.service';
import { PaymentlogController } from './paymentlog.controller';

@Module({
  controllers: [PaymentlogController],
  providers: [PaymentlogService]
})
export class PaymentlogModule {}
