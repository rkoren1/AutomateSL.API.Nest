import { Controller } from '@nestjs/common';
import { BotLogService } from './bot-log.service';

@Controller('bot-log')
export class BotLogController {
  constructor(private readonly botLogService: BotLogService) {}
}
