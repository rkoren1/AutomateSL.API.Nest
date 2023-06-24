import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { JwtMiddleware } from './core/guards/jwt/jwt.middleware';
import { BotModule } from './modules/bot/bot.module';
import { UserModule } from './modules/user/user.module';
import { TerminalModule } from './modules/terminal/terminal.module';
import { SharedBotModule } from './modules/shared-bot/shared-bot.module';
import { SharedBotUserSubscriptionModule } from './modules/shared-bot-user-subscription/shared-bot-user-subscription.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule,
    BotModule,
    UserModule,
    TerminalModule,
    SharedBotModule,
    SubscriptionModule,
    SharedBotUserSubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude('user/(.*)', 'terminal/(.*)')
      .forRoutes('*');
  }
}
