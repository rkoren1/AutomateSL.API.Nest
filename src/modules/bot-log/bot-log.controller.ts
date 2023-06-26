import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BotLogService } from './bot-log.service';
import { CreateBotLogDto } from './dto/create-bot-log.dto';
import { UpdateBotLogDto } from './dto/update-bot-log.dto';

@Controller('bot-log')
export class BotLogController {
  constructor(private readonly botLogService: BotLogService) {}

  @Post()
  create(@Body() createBotLogDto: CreateBotLogDto) {
    return this.botLogService.create(createBotLogDto);
  }

  @Get()
  findAll() {
    return this.botLogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botLogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBotLogDto: UpdateBotLogDto) {
    return this.botLogService.update(+id, updateBotLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.botLogService.remove(+id);
  }
}
