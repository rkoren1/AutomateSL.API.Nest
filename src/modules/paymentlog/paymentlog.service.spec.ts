import { Test, TestingModule } from '@nestjs/testing';
import { PaymentlogService } from './paymentlog.service';

describe('PaymentlogService', () => {
  let service: PaymentlogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentlogService],
    }).compile();

    service = module.get<PaymentlogService>(PaymentlogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
