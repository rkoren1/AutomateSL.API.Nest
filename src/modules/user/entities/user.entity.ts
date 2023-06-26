import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { BotDb } from 'src/modules/bot/entities/bot.entity';
import { SharedBotUserSubscription } from 'src/modules/shared-bot-user-subscription/entities/shared-bot-user-subscription.entity';
@Table({ underscored: true, tableName: 'user' })
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;
  @Column({
    type: DataType.STRING,
  })
  refreshToken: string;
  @Column({
    type: DataType.INTEGER,
  })
  l$Balance: number;
  @Column({
    type: DataType.STRING,
    unique: 'uuid',
  })
  uuid: string;
  @Column({
    type: DataType.STRING,
  })
  avatarName: string;

  @HasMany(() => BotDb, 'userId')
  bot: BotDb[];

  @HasMany(() => SharedBotUserSubscription, 'userId')
  sharedBotUserSubscriptions: SharedBotUserSubscription[];
}
