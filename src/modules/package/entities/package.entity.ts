import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ underscored: true, tableName: 'package' })
export class Package extends Model<Package> {
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
  packageName: string;
  @Column({
    type: DataType.STRING,
  })
  pacakageDescription: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  pricePerWeek: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  discount: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  pricePerMonth: number;
  @Column({
    type: DataType.INTEGER,
  })
  couponId: number;
}