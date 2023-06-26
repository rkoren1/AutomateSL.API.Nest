import { Sequelize } from 'sequelize-typescript';
import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from 'src/constants';
import { BotLog } from 'src/modules/bot-log/entities/bot-log.entity';
import { BotDb } from 'src/modules/bot/entities/bot.entity';
import { DiscordSettings } from 'src/modules/discord-settings/entities/discord-setting.entity';
import { Package } from 'src/modules/package/entities/package.entity';
import { PaymentLog } from 'src/modules/payment/entities/payment-log.entity';
import { SharedBotUserSubscription } from 'src/modules/shared-bot-user-subscription/entities/shared-bot-user-subscription.entity';
import { SharedBot } from 'src/modules/shared-bot/entities/shared-bot.entity';
import { Subscription } from 'src/modules/subscription/entities/subscription.entity';
import { Terminal } from 'src/modules/terminal/entities/terminal.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { databaseConfig } from './database.config';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      console.log(sequelize.models);
      sequelize.addModels([
        User,
        Terminal,
        BotDb,
        SharedBot,
        Subscription,
        SharedBotUserSubscription,
        PaymentLog,
        Package,
        DiscordSettings,
        BotLog,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
