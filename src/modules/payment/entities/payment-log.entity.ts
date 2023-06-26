import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ underscored: true, tableName: 'payment_log' })
export class PaymentLog extends Model<PaymentLog> {
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
  userUuid: string;
  @Column({
    type: DataType.INTEGER,
  })
  amount: number;
}
