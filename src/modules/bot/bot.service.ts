import {
  Bot,
  BotOptionFlags,
  LoginParameters,
} from '@caspertech/node-metaverse';
import { Injectable } from '@nestjs/common';
import { forkJoin } from 'rxjs';
import { Op } from 'sequelize';
import urlMetadata from 'url-metadata';
import { Package } from '../package/entities/package.entity';
import { SharedBotUserSubscription } from '../shared-bot-user-subscription/entities/shared-bot-user-subscription.entity';
import { SharedBot } from '../shared-bot/entities/shared-bot.entity';
import { Subscription } from '../subscription/entities/subscription.entity';
import { CreateBotDto } from './dto/create-bot.dto';
import { GetBotDto } from './dto/get-bot.dto';
import { BotDb } from './entities/bot.entity';
@Injectable()
export class BotService {
  slAccountExists(firstName: string, lastName: string, password: string) {
    const loginParams: LoginParameters = new LoginParameters();
    loginParams.firstName = firstName;
    loginParams.lastName = lastName;
    loginParams.password = password;
    loginParams.start = 'last';
    const bot: Bot = new Bot(loginParams, BotOptionFlags.None);
    return bot
      .login()
      .then((res) => {
        return res.agent.agentID['mUUID'];
      })
      .catch((err) => {
        return false;
      });
  }
  create(createBotDto: CreateBotDto) {
    return new Promise((resolve, reject) => {
      this.slAccountExists(
        createBotDto.loginFirstName,
        createBotDto.loginLastName,
        createBotDto.loginPassword,
      ).then((uuid) => {
        if (!uuid) return reject({ exists: false });

        urlMetadata('https://world.secondlife.com/resident/' + uuid).then(
          (metadata: any) => {
            const currentDate = new Date();
            const after3Days = new Date();
            after3Days.setDate(after3Days.getDate() + 3);

            BotDb.create({
              userId: createBotDto.userId,
              loginFirstName: createBotDto.loginFirstName,
              loginLastName: createBotDto.loginLastName,
              loginPassword: createBotDto.loginPassword,
              running: false,
              shouldRun: false,
              loginSpawnLocation: createBotDto.loginSpawnLocation,
              uuid: uuid,
              imageId: metadata.imageid,
            })
              .then((bot) => {
                BotDb.findAll({
                  where: { userId: createBotDto.userId },
                }).then((userBots) => {
                  //if this is the only bot give 3 days of free subscription
                  if (userBots.length < 2) {
                    Subscription.create({
                      subscriptionStart: currentDate,
                      subscriptionEnd: after3Days,
                      packageId: 1,
                      botId: bot.id,
                    }).catch((err) => console.error(err));
                  }
                  return resolve(metadata.imageid);
                });
              })
              .catch((err) => {
                console.error(err);
                return reject(err);
              });
          },
        );
      });
    });
  }

  getAllBots(userId: number) {
    return new Promise((resolve, reject) => {
      const currentDate = new Date();
      forkJoin([
        BotDb.findAll({
          attributes: [
            'id',
            'loginFirstName',
            'loginLastName',
            'running',
            'uuid',
            'imageId',
          ],
          include: {
            model: Subscription,
            where: { subscriptionEnd: { [Op.gt]: currentDate } },
            required: false,
          },
          where: { userId: userId },
        }),
        SharedBot.findAll({
          attributes: [
            'id',
            'loginFirstName',
            'loginLastName',
            'running',
            'uuid',
            'imageId',
          ],
          include: [
            { model: SharedBotUserSubscription, where: { userId: userId } },
          ],
        }),
      ]).subscribe({
        next: (result) => {
          const response: GetBotDto = { my: [], shared: [] };
          result[0].forEach((ele) => {
            response.my.push({
              id: ele.id,
              loginName: ele.loginFirstName,
              loginLastName: ele.loginLastName,
              running: ele.running,
              uuid: ele.uuid,
              imageId: ele.imageId,
              validSubscription: ele.subscriptions.length > 0 ? true : false,
            });
          });
          result[1].forEach((ele) => {
            response.shared.push({
              id: ele.id,
              loginName: ele.loginFirstName,
              loginLastName: ele.loginLastName,
              running: ele.running,
              uuid: ele.uuid,
              imageId: ele.imageId,
              validSubscription: false,
            });
          });
          resolve(response);
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }
  getBotConfiguration(data) {
    return new Promise((resolve, reject) => {
      return BotDb.findOne({
        attributes: [
          'id',
          'loginFirstName',
          'imageId',
          'loginLastName',
          'loginSpawnLocation',
          'loginRegion',
        ],
        where: {
          loginFirstName: data.botFirstName,
          loginLastName: data.botLastName,
          userId: data.userId,
        },
        include: {
          model: Subscription,
          attributes: ['subscriptionStart', 'subscriptionEnd'],
          include: [{ model: Package, attributes: ['id', 'packageName'] }],
        },
      })
        .then((result) => {
          return resolve(result.dataValues);
        })
        .catch((err) => {
          console.error(err);
          return reject(err);
        });
    });
  }
}
