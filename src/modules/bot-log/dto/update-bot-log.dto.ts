import { PartialType } from '@nestjs/swagger';
import { CreateBotLogDto } from './create-bot-log.dto';

export class UpdateBotLogDto extends PartialType(CreateBotLogDto) {}
