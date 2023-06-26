import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscordSettingsService } from './discord-settings.service';
import { CreateDiscordSettingDto } from './dto/create-discord-setting.dto';
import { UpdateDiscordSettingDto } from './dto/update-discord-setting.dto';

@ApiTags('Discord-settings')
@Controller('discord-settings')
export class DiscordSettingsController {
  constructor(
    private readonly discordSettingsService: DiscordSettingsService,
  ) {}

  @Post()
  create(@Body() createDiscordSettingDto: CreateDiscordSettingDto) {
    return this.discordSettingsService.create(createDiscordSettingDto);
  }

  @Get()
  findAll() {
    return this.discordSettingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discordSettingsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiscordSettingDto: UpdateDiscordSettingDto,
  ) {
    return this.discordSettingsService.update(+id, updateDiscordSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discordSettingsService.remove(+id);
  }
}
