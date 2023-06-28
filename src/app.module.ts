import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { JwtMiddleware } from './core/guards/jwt/jwt.middleware';
import { InitService } from './init.service';
import { BotLogModule } from './modules/bot-log/bot-log.module';
import { BotModule } from './modules/bot/bot.module';
import { DiscordSettingsModule } from './modules/discord-settings/discord-settings.module';
import { PackageModule } from './modules/package/package.module';
import { PaymentModule } from './modules/payment/payment.module';
import { SharedBotUserSubscriptionModule } from './modules/shared-bot-user-subscription/shared-bot-user-subscription.module';
import { SharedBotModule } from './modules/shared-bot/shared-bot.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { TerminalModule } from './modules/terminal/terminal.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, './automatesl.client'),
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
    DiscordSettingsModule,
    BotLogModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, InitService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude('user/(.*)', 'terminal/(.*)', 'uptime', 'refreshtoken')
      .forRoutes('*');
  }
}
