import { Injectable } from '@nestjs/common';
import { CreateBotLogDto } from './dto/create-bot-log.dto';
import { UpdateBotLogDto } from './dto/update-bot-log.dto';

@Injectable()
export class BotLogService {
  create(createBotLogDto: CreateBotLogDto) {
    return 'This action adds a new botLog';
  }

  findAll() {
    return `This action returns all botLog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} botLog`;
  }

  update(id: number, updateBotLogDto: UpdateBotLogDto) {
    return `This action updates a #${id} botLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} botLog`;
  }
}
