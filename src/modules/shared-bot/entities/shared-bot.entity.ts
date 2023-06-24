import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { SharedBotUserSubscription } from 'src/modules/shared-bot-user-subscription/entities/shared-bot-user-subscription.entity';

@Table({ underscored: true, tableName: 'shared_bot' })
export class SharedBot extends Model<SharedBot> {
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
  loginFirstName: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  loginLastName: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  loginPassword: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  loginSpawnLocation: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  running: boolean;
  @Column({
    type: DataType.STRING,
  })
  loginRegion: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  packageId: number;
  @Column({
    type: DataType.STRING(36),
    allowNull: false,
  })
  uuid: string;
  @Column({
    type: DataType.STRING(36),
    allowNull: false,
  })
  imageId: string;

  @HasMany(() => SharedBotUserSubscription, 'sharedBotId')
  sharedBotUserSubscriptions: SharedBotUserSubscription;
}
