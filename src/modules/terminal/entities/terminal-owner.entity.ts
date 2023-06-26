import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ underscored: true, tableName: 'terminal_owner' })
export class TerminalOwner extends Model<TerminalOwner> {
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
  avatarUuid: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  avatarName: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  parcelName: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  slUrl: string;
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  lastActive: Date;
}
