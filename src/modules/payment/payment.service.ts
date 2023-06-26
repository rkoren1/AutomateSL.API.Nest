import { Injectable } from '@nestjs/common';
import {
  addDaysToDate,
  addMonthsToDate,
} from 'src/core/services/helper.service';
import { Package } from '../package/entities/package.entity';
import { Subscription } from '../subscription/entities/subscription.entity';
import { User } from '../user/entities/user.entity';
import { PaymentLog } from './entities/payment-log.entity';

@Injectable()
export class PaymentService {
  getLDollarBalance(userId: number) {
    return User.findOne({ where: { id: userId } })
      .then((user) => {
        return { lDollarBalance: user.l$Balance };
      })
      .catch((err) => {
        console.error(err);
        return { lDollarBalance: '??' };
      });
  }
  payForPackage(data: any) {
    return new Promise<{ success: boolean; message: string }>(
      (resolve, reject) => {
        let subscriptionCost: number;
        //optimize -> call user and package at same time
        //calculate if user has enough money and calculate how much his package costs
        User.findOne({ where: { id: data.userId } }).then((user) => {
          Package.findOne({ where: { id: data.packageId } }).then(
            (selectedPackage) => {
              switch (data.dateUnit) {
                case 'Week':
                  subscriptionCost =
                    data.amountOfDateUnits * selectedPackage.pricePerWeek;
                  break;
                case 'Month':
                  subscriptionCost =
                    data.amountOfDateUnits * selectedPackage.pricePerMonth;
                  break;
              }
              if (user.l$Balance < subscriptionCost) {
                return resolve({ success: false, message: 'Balance Too Low' });
              }

              //Create log
              PaymentLog.create({
                userUuid: user.uuid,
                amount: subscriptionCost,
              });
              //Deduct the money
              User.update(
                { l$Balance: user.l$Balance - subscriptionCost },
                { where: { id: data.userId } },
              );

              //removes free trial if exists for this bot
              Subscription.destroy({
                where: { packageId: 1, botId: data.botId },
              })
                .then(() => {
                  Subscription.findOne({ where: { botId: data.botId } }).then(
                    (sub) => {
                      const currentDate = new Date();

                      //updates subscription if it already exists, otherwise it should create it
                      if (sub) {
                        let endDate = sub.subscriptionEnd;
                        switch (data.dateUnit) {
                          case 'Week':
                            endDate = addDaysToDate(
                              endDate,
                              data.amountOfDateUnits * 7,
                            );
                            break;
                          case 'Month':
                            endDate = addMonthsToDate(
                              endDate,
                              data.amountOfDateUnits,
                            );
                            break;
                        }
                        //updates subscription length
                        return Subscription.update(
                          {
                            subscriptionStart: currentDate,
                            subscriptionEnd: endDate,
                          },
                          {
                            where: {
                              botId: data.botId,
                              packageId: data.packageId,
                            },
                          },
                        )
                          .then((res) => {
                            console.log(endDate);
                            return resolve({
                              success: true,
                              message: 'Payment Successful',
                            });
                          })
                          .catch((err) => {
                            console.error(err);
                            return reject({
                              success: false,
                              message: 'Unknown Error Occured',
                            });
                          });
                      } else {
                        let endDate = new Date();
                        switch (data.dateUnit) {
                          case 'Week':
                            endDate = addDaysToDate(
                              endDate,
                              data.amountOfDateUnits * 7,
                            );
                            break;
                          case 'Month':
                            endDate = addMonthsToDate(
                              endDate,
                              data.amountOfDateUnits,
                            );
                            break;
                        }
                        //create subscription
                        return Subscription.create({
                          packageId: data.packageId,
                          subscriptionStart: currentDate,
                          subscriptionEnd: endDate,
                          botId: data.botId,
                        })
                          .then((res) =>
                            resolve({
                              success: true,
                              message: 'Payment Successful',
                            }),
                          )
                          .catch((err) => {
                            console.error(err);
                            return reject({
                              success: false,
                              message: 'Unknown Error Occured',
                            });
                          });
                      }
                    },
                  );
                })
                .catch((err) => console.error(err));
            },
          );
        });
      },
    );
  }
}
