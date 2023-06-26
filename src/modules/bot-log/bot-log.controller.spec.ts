import { Test, TestingModule } from '@nestjs/testing';
import { BotLogController } from './bot-log.controller';
import { BotLogService } from './bot-log.service';

describe('BotLogController', () => {
  let controller: BotLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotLogController],
      providers: [BotLogService],
    }).compile();

    controller = module.get<BotLogController>(BotLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
