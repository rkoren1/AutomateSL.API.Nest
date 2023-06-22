import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';

import { BotModule } from './modules/bot/bot.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [DatabaseModule, DatabaseModule, BotModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
