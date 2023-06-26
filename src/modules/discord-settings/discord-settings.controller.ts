import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscordSettingsService } from './discord-settings.service';

@ApiTags('Discord-settings')
@Controller('discord-settings')
export class DiscordSettingsController {
  constructor(
    private readonly discordSettingsService: DiscordSettingsService,
  ) {}
}
