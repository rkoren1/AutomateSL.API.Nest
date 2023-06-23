import { Test, TestingModule } from '@nestjs/testing';
import { SharedBotUserSubscriptionService } from './shared-bot-user-subscription.service';

describe('SharedBotUserSubscriptionService', () => {
  let service: SharedBotUserSubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedBotUserSubscriptionService],
    }).compile();

    service = module.get<SharedBotUserSubscriptionService>(SharedBotUserSubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
