import { Test, TestingModule } from '@nestjs/testing';
import { BotLogService } from './bot-log.service';

describe('BotLogService', () => {
  let service: BotLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotLogService],
    }).compile();

    service = module.get<BotLogService>(BotLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
