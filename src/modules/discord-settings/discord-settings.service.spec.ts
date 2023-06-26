import { Test, TestingModule } from '@nestjs/testing';
import { DiscordSettingsService } from './discord-settings.service';

describe('DiscordSettingsService', () => {
  let service: DiscordSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscordSettingsService],
    }).compile();

    service = module.get<DiscordSettingsService>(DiscordSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
