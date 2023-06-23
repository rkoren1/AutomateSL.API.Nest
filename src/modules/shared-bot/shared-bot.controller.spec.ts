import { Test, TestingModule } from '@nestjs/testing';
import { SharedBotController } from './shared-bot.controller';
import { SharedBotService } from './shared-bot.service';

describe('SharedBotController', () => {
  let controller: SharedBotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SharedBotController],
      providers: [SharedBotService],
    }).compile();

    controller = module.get<SharedBotController>(SharedBotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
