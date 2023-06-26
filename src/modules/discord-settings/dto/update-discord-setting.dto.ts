import { PartialType } from '@nestjs/swagger';
import { CreateDiscordSettingDto } from './create-discord-setting.dto';

export class UpdateDiscordSettingDto extends PartialType(CreateDiscordSettingDto) {}
