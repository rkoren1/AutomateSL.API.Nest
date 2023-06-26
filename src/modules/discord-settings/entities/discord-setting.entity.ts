import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ underscored: true, tableName: 'discord_settings' })
export class DiscordSettings extends Model<DiscordSettings> {
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
  botId: number;
  @Column({
    type: DataType.STRING,
  })
  webHookUrl: string;
  @Column({
    type: DataType.STRING,
  })
  slGroupUuid: string;
  @Column({
    type: DataType.STRING,
  })
  discChannelId: string;
}
