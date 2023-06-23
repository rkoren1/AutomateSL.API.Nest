import { Test, TestingModule } from '@nestjs/testing';
import { SharedBotService } from './shared-bot.service';

describe('SharedBotService', () => {
  let service: SharedBotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SharedBotService],
    }).compile();

    service = module.get<SharedBotService>(SharedBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
