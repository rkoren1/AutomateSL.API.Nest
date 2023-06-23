import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SharedBotUserSubscriptionService } from './shared-bot-user-subscription.service';
import { CreateSharedBotUserSubscriptionDto } from './dto/create-shared-bot-user-subscription.dto';
import { UpdateSharedBotUserSubscriptionDto } from './dto/update-shared-bot-user-subscription.dto';

@Controller('shared-bot-user-subscription')
export class SharedBotUserSubscriptionController {
  constructor(private readonly sharedBotUserSubscriptionService: SharedBotUserSubscriptionService) {}

  @Post()
  create(@Body() createSharedBotUserSubscriptionDto: CreateSharedBotUserSubscriptionDto) {
    return this.sharedBotUserSubscriptionService.create(createSharedBotUserSubscriptionDto);
  }

  @Get()
  findAll() {
    return this.sharedBotUserSubscriptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sharedBotUserSubscriptionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSharedBotUserSubscriptionDto: UpdateSharedBotUserSubscriptionDto) {
    return this.sharedBotUserSubscriptionService.update(+id, updateSharedBotUserSubscriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sharedBotUserSubscriptionService.remove(+id);
  }
}
