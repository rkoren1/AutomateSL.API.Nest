import { PartialType } from '@nestjs/swagger';
import { CreateSharedBotUserSubscriptionDto } from './create-shared-bot-user-subscription.dto';

export class UpdateSharedBotUserSubscriptionDto extends PartialType(CreateSharedBotUserSubscriptionDto) {}
