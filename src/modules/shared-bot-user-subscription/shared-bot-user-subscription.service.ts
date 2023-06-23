import { Injectable } from '@nestjs/common';
import { CreateSharedBotUserSubscriptionDto } from './dto/create-shared-bot-user-subscription.dto';
import { UpdateSharedBotUserSubscriptionDto } from './dto/update-shared-bot-user-subscription.dto';

@Injectable()
export class SharedBotUserSubscriptionService {
  create(createSharedBotUserSubscriptionDto: CreateSharedBotUserSubscriptionDto) {
    return 'This action adds a new sharedBotUserSubscription';
  }

  findAll() {
    return `This action returns all sharedBotUserSubscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sharedBotUserSubscription`;
  }

  update(id: number, updateSharedBotUserSubscriptionDto: UpdateSharedBotUserSubscriptionDto) {
    return `This action updates a #${id} sharedBotUserSubscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} sharedBotUserSubscription`;
  }
}
