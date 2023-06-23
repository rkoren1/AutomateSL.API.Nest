import { Module } from '@nestjs/common';
import { SharedBotService } from './shared-bot.service';
import { SharedBotController } from './shared-bot.controller';

@Module({
  controllers: [SharedBotController],
  providers: [SharedBotService]
})
export class SharedBotModule {}
