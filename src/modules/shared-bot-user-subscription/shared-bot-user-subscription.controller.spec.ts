import { Test, TestingModule } from '@nestjs/testing';
import { SharedBotUserSubscriptionController } from './shared-bot-user-subscription.controller';
import { SharedBotUserSubscriptionService } from './shared-bot-user-subscription.service';

describe('SharedBotUserSubscriptionController', () => {
  let controller: SharedBotUserSubscriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharedBotUserSubscriptionController],
      providers: [SharedBotUserSubscriptionService],
    }).compile();

    controller = module.get<SharedBotUserSubscriptionController>(SharedBotUserSubscriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
