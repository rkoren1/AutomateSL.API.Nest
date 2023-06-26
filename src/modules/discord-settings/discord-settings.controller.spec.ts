import { Test, TestingModule } from '@nestjs/testing';
import { DiscordSettingsController } from './discord-settings.controller';
import { DiscordSettingsService } from './discord-settings.service';

describe('DiscordSettingsController', () => {
  let controller: DiscordSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscordSettingsController],
      providers: [DiscordSettingsService],
    }).compile();

    controller = module.get<DiscordSettingsController>(DiscordSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
