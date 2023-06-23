import { Injectable } from '@nestjs/common';
import { CreateSharedBotDto } from './dto/create-shared-bot.dto';
import { UpdateSharedBotDto } from './dto/update-shared-bot.dto';

@Injectable()
export class SharedBotService {
  create(createSharedBotDto: CreateSharedBotDto) {
    return 'This action adds a new sharedBot';
  }

  findAll() {
    return `This action returns all sharedBot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sharedBot`;
  }

  update(id: number, updateSharedBotDto: UpdateSharedBotDto) {
    return `This action updates a #${id} sharedBot`;
  }

  remove(id: number) {
    return `This action removes a #${id} sharedBot`;
  }
}
