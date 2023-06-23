import { Injectable } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { Op } from 'sequelize';
import { forkJoin } from 'rxjs';
import { Bot } from './entities/bot.entity';
import { GetBotDto } from './dto/get-bot.dto';
import { SharedBot } from '../shared-bot/entities/shared-bot.entity';
import { Subscription } from '../subscription/entities/subscription.entity';
import { SharedBotUserSubscription } from '../shared-bot-user-subscription/entities/shared-bot-user-subscription.entity';

@Injectable()
export class BotService {
  create(createBotDto: CreateBotDto) {
    return 'This action adds a new bot';
  }

  getAllBots(userId: number) {
    return new Promise((resolve, reject) => {
      const currentDate = new Date();
      forkJoin([
        Bot.findAll({
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
              validSubscription: ele['subscriptions'].length > 0 ? true : false,
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
}
