import { Module } from '@nestjs/common';
import { BotLogService } from './bot-log.service';
import { BotLogController } from './bot-log.controller';

@Module({
  controllers: [BotLogController],
  providers: [BotLogService]
})
export class BotLogModule {}
