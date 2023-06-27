import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Subscription } from 'src/modules/subscription/entities/subscription.entity';

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
  packageDescription: string;
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
  @HasMany(() => Subscription, 'packageId')
  subscriptions: Subscription[];
}
