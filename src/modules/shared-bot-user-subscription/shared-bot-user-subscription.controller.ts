import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SharedBotUserSubscriptionService } from './shared-bot-user-subscription.service';

@ApiTags('Shared-bot-user-subscription')
@Controller('shared-bot-user-subscription')
export class SharedBotUserSubscriptionController {
  constructor(
    private readonly sharedBotUserSubscriptionService: SharedBotUserSubscriptionService,
  ) {}
}
