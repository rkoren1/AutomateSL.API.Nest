import { BotOptionFlags, LoginParameters } from '@caspertech/node-metaverse';
import { Op } from 'sequelize';
import { BotService } from 'src/modules/bot/bot.service';
import { BotDb } from 'src/modules/bot/entities/bot.entity';
import { DiscordSettings } from 'src/modules/discord-settings/entities/discord-setting.entity';
import { SharedBotUserSubscription } from 'src/modules/shared-bot-user-subscription/entities/shared-bot-user-subscription.entity';
import { SharedBot } from 'src/modules/shared-bot/entities/shared-bot.entity';
import { Subscription } from 'src/modules/subscription/entities/subscription.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { BasicDiscBot } from '../classes/basic-disc-bot';
import { SmartBot } from '../classes/smart-bot';

export const reviveBots = (botService: BotService) => {
  const currentDate = new Date();
  BotDb.findAll({
    where: { running: true },
    include: [
      { model: User },
      {
        model: Subscription,
        where: { subscriptionEnd: { [Op.gt]: currentDate } },
      },
    ],
  }).then((runningBots) => {
    runningBots.forEach((bot) => {
      const loginParameters = new LoginParameters();
      loginParameters.firstName = bot.loginFirstName;
      loginParameters.lastName = bot.loginLastName;
      loginParameters.password = bot.loginPassword;
      loginParameters.start = bot.loginSpawnLocation; //region/x/y/z or home or last

      const options =
        BotOptionFlags.LiteObjectStore | BotOptionFlags.StoreMyAttachmentsOnly;
      //start bot
      let workerBot;
      DiscordSettings.findAll({ where: { botId: bot.id } }).then(
        (discordSettings) => {
          if (discordSettings.length > 0) {
            workerBot = new BasicDiscBot(
              loginParameters,
              options,
              bot['user'].dataValues,
              bot,
              discordSettings[0],
            );
          } else {
            workerBot = new SmartBot(
              loginParameters,
              options,
              bot['user'].dataValues,
              bot,
            );
          }
          workerBot
            .login()
            .then(() => workerBot.connectToSim())
            .then(() => {
              botService.botInstances[bot.id] = workerBot;
            })
            .catch((err) => console.error(err));
        },
      );
    });
  });
};
export const reviveSharedBots = () => {
  SharedBot.findAll({ include: { model: SharedBotUserSubscription } }).then(
    (sharedBotUsers) => {},
  );
};
