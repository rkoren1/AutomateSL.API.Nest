import { Test, TestingModule } from '@nestjs/testing';
import { PaymentlogController } from './paymentlog.controller';
import { PaymentlogService } from './paymentlog.service';

describe('PaymentlogController', () => {
  let controller: PaymentlogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentlogController],
      providers: [PaymentlogService],
    }).compile();

    controller = module.get<PaymentlogController>(PaymentlogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
