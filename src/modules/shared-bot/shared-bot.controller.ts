import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SharedBotService } from './shared-bot.service';

@ApiTags('Shared-bot')
@Controller('shared-bot')
export class SharedBotController {
  constructor(private readonly sharedBotService: SharedBotService) {}
}
