import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ underscored: true, tableName: 'shared_bot_user_subscription' })
export class SharedBotUserSubscription extends Model<SharedBotUserSubscription> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sharedBotId: number;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  subscriptionStart: Date;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  subscriptionEnd: Date;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  packageId: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;
}
