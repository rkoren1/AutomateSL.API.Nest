import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

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
}
