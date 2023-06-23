import { Sequelize } from 'sequelize-typescript';
import { DEVELOPMENT, PRODUCTION, SEQUELIZE, TEST } from 'src/constants';
import { databaseConfig } from './database.config';
import { User } from 'src/modules/user/entities/user.entity';
import { Terminal } from 'src/modules/terminal/entities/terminal.entity';
import { Bot } from 'src/modules/bot/entities/bot.entity';
import { SharedBot } from 'src/modules/shared-bot/entities/shared-bot.entity';
import { Subscription } from 'src/modules/subscription/entities/subscription.entity';
import { SharedBotUserSubscription } from 'src/modules/shared-bot-user-subscription/entities/shared-bot-user-subscription.entity';

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
        Bot,
        SharedBot,
        Subscription,
        SharedBotUserSubscription,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
