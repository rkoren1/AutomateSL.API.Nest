import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedBotService {
  findAll() {
    return `This action returns all sharedBot`;
  }
}
