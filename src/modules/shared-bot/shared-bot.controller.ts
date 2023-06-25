import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SharedBotService } from './shared-bot.service';
import { CreateSharedBotDto } from './dto/create-shared-bot.dto';
import { UpdateSharedBotDto } from './dto/update-shared-bot.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Shared-bot')
@Controller('shared-bot')
export class SharedBotController {
  constructor(private readonly sharedBotService: SharedBotService) {}

  @Post()
  create(@Body() createSharedBotDto: CreateSharedBotDto) {
    return this.sharedBotService.create(createSharedBotDto);
  }

  @Get()
  findAll() {
    return this.sharedBotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sharedBotService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSharedBotDto: UpdateSharedBotDto,
  ) {
    return this.sharedBotService.update(+id, updateSharedBotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sharedBotService.remove(+id);
  }
}
