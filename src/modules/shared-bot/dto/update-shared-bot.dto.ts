import { PartialType } from '@nestjs/swagger';
import { CreateSharedBotDto } from './create-shared-bot.dto';

export class UpdateSharedBotDto extends PartialType(CreateSharedBotDto) {}
