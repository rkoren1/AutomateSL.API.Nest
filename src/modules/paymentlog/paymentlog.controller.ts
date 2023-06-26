import { Controller } from '@nestjs/common';
import { PaymentlogService } from './paymentlog.service';

@Controller('paymentlog')
export class PaymentlogController {
  constructor(private readonly paymentlogService: PaymentlogService) {}
}
