import { Module } from '@nestjs/common';
import { DiscordSettingsService } from './discord-settings.service';
import { DiscordSettingsController } from './discord-settings.controller';

@Module({
  controllers: [DiscordSettingsController],
  providers: [DiscordSettingsService]
})
export class DiscordSettingsModule {}
