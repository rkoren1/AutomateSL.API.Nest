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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PaymentModule } from './modules/payment/payment.module';
import { PackageModule } from './modules/package/package.module';
import { PaymentlogModule } from './modules/paymentlog/paymentlog.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', './automatesl.client'),
    }),
    DatabaseModule,
    DatabaseModule,
    BotModule,
    UserModule,
    TerminalModule,
    SharedBotModule,
    SubscriptionModule,
    SharedBotUserSubscriptionModule,
    PaymentModule,
    PackageModule,
    PaymentlogModule,
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
