import { Module } from '@nestjs/common';
import { SharedBotUserSubscriptionService } from './shared-bot-user-subscription.service';
import { SharedBotUserSubscriptionController } from './shared-bot-user-subscription.controller';

@Module({
  controllers: [SharedBotUserSubscriptionController],
  providers: [SharedBotUserSubscriptionService]
})
export class SharedBotUserSubscriptionModule {}
