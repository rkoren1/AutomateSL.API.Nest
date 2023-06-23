import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BotService } from './bot.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { GetBotDto } from './dto/get-bot.dto';

@ApiTags('Bot')
@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post()
  create(@Body() createBotDto: CreateBotDto) {
    return this.botService.create(createBotDto);
  }

  @Get('getbots')
  @ApiOkResponse({
    type: GetBotDto,
  })
  getAllBots(@Req() req) {
    const userId = req.id;
    return this.botService.getAllBots(userId).then((res) => res);
  }
}
