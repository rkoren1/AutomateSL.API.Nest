import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ underscored: true, tableName: 'bot_log' })
export class BotLog extends Model<BotLog> {
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
  name: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  botUuid: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  message: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  event: string;
}
