import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ExtensionPeriodUnit, Result } from 'src/core/constants/constants';
import { addDaysToDate } from 'src/core/services/helper.service';
import { BotDb } from '../bot/entities/bot.entity';
import { PaymentLog } from '../payment/entities/payment-log.entity';
import { Subscription } from '../subscription/entities/subscription.entity';
import { User } from '../user/entities/user.entity';
import { AddBalanceBodyDto } from './dto/add-balance-body.dto';
import { PaySubscriptionDto } from './dto/pay-subscription.dto';
import { UpdateTerminalOwnerBodyDto } from './dto/update-terminal-owner-body.dto';
import { TerminalOwner } from './entities/terminal-owner.entity';

@Injectable()
export class TerminalService {
  getAllBotsFromUserUuid(uuid: string) {
    return new Promise((resolve, reject) => {
      return BotDb.findAll({
        attributes: ['id', 'loginFirstName', 'running', 'imageId', 'packageId'],
        where: {
          uuid: uuid,
        },
      })
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  }
  paySubscription(data: PaySubscriptionDto) {
    return new Promise((resolve, reject) => {
      const today = new Date();
      let endDate;
      if (data.extensionTimeUnit === ExtensionPeriodUnit.WEEK) {
        endDate = addDaysToDate(today, data.extensionTime * 7);
      } else if (data.extensionTimeUnit === ExtensionPeriodUnit.MONTH) {
        endDate = addDaysToDate(today, data.extensionTime * 30);
      } else {
        return reject('Invalid time unit');
      }
      Subscription.create({
        subscriptionStart: today,
        subscriptionEnd: endDate,
        botId: data.botId,
        packageId: data.packageId,
      })
        .then((result) => resolve(endDate))
        .catch((err) => reject(err));
    });
  }
  generatePassword(length) {
    let password = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return password;
  }
  terminalRegister(data) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(data.password, 10).then((hashedPass) => {
        return User.create({
          email: data.email,
          uuid: data.uuid,
          avatarName: data.avatarName,
          password: hashedPass,
          l$Balance: 0,
        })
          .then((result) => resolve(data.password))
          .catch((err) => {
            console.error(err);
            return reject(err);
          });
      });
    });
  }
  addTerminal(data) {
    return new Promise((resolve, reject) => {
      return TerminalOwner.create({
        avatarName: data.avatarName,
        avatarUuid: data.avatarUUID,
        parcelName: data.parcelName,
        slUrl: data.slUrl,
        lastActive: data.lastActive,
      })
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  }
  isRegistered(uuid: string) {
    return new Promise((resolve, reject) => {
      return User.findOne({ attributes: ['id'], where: { uuid: uuid } })
        .then((user) => {
          if (user) return resolve(user);
          return resolve(null);
        })
        .catch((err) => reject(err));
    });
  }
  updateTerminalActivity = (data) => {
    return new Promise((resolve, reject) => {
      return TerminalOwner.update(
        { lastActive: data.lastActive },
        { where: { id: data.terminalId } },
      )
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  };
  updateTerminalOwner(data: UpdateTerminalOwnerBodyDto) {
    return new Promise((resolve, reject) => {
      const today = new Date();
      return TerminalOwner.update(
        {
          avatarName: data.avatarName,
          avatarUuid: data.avatarUUID,
          parcelName: data.parcelName,
          slUrl: data.slUrl,
          lastActive: today,
        },
        { where: { id: data.terminalId } },
      )
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  }
  setUserPassword(userUUID: string, password: string) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10).then((hashedPass) => {
        User.update({ password: hashedPass }, { where: { uuid: userUUID } })
          .then((res) => {
            User.findOne({ where: { uuid: userUUID } })
              .then((user) => {
                return resolve(user);
              })
              .catch((err) => reject(err));
          })
          .catch((err) => reject(err));
      });
    });
  }
  addBalance = (data: AddBalanceBodyDto) => {
    return new Promise((resolve, reject) => {
      PaymentLog.create({ userUuid: data.UUID, amount: data.lDollarAmount });
      User.findOne({ where: { uuid: data.UUID } }).then((user) => {
        const newBalance = user.l$Balance + data.lDollarAmount;
        User.update({ l$Balance: newBalance }, { where: { uuid: data.UUID } })
          .then((res) => resolve(newBalance))
          .catch((err) => reject(err));
      });
    });
  };
  getBalance(uuid: string) {
    return User.findOne({
      attributes: ['l$Balance'],
      where: { uuid: uuid },
    }).then((user) => {
      if (user)
        return {
          result: Result.OK,
          resulttext: 'get_balance_success',
          custom: { balance: user.l$Balance },
        };
      else
        return {
          result: Result.FAIL,
          resulttext: 'get_balance_fail',
          custom: { balance: -1 },
        };
    });
  }
}
