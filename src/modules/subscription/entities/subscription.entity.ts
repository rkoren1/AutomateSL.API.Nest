import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ underscored: true, tableName: 'subscription' })
export class Subscription extends Model<Subscription> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  subscriptionStart: Date;
  @Column({
    type: DataType.DATE,
    allowNull: false,
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
  botId: number;
}
