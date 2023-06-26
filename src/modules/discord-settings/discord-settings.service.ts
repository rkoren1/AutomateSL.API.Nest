import { Injectable } from '@nestjs/common';
import { CreateDiscordSettingDto } from './dto/create-discord-setting.dto';
import { UpdateDiscordSettingDto } from './dto/update-discord-setting.dto';

@Injectable()
export class DiscordSettingsService {
  create(createDiscordSettingDto: CreateDiscordSettingDto) {
    return 'This action adds a new discordSetting';
  }

  findAll() {
    return `This action returns all discordSettings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} discordSetting`;
  }

  update(id: number, updateDiscordSettingDto: UpdateDiscordSettingDto) {
    return `This action updates a #${id} discordSetting`;
  }

  remove(id: number) {
    return `This action removes a #${id} discordSetting`;
  }
}
