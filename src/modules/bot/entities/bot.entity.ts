import crypto from 'crypto';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ underscored: true, tableName: 'bot' })
export class Bot extends Model<Bot> {
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
    get() {
      const rawValue = this.getDataValue('loginPassword');
      if (rawValue) return decrypt(rawValue);
    },
    set(value) {
      this.setDataValue('loginPassword', encrypt(value));
    },
  })
  loginPassword: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  loginSpawnLocation: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  running: boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  shouldRun: boolean;
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
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  actionId: number;
}

function encrypt(text) {
  const iv = process.env.LOGIN_PASS_IV;
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.LOGIN_PASS_KEY),
    iv,
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
}
function decrypt(encryptedData: string) {
  const iv = process.env.LOGIN_PASS_IV;
  const encryptedText = Buffer.from(encryptedData, 'hex');

  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.LOGIN_PASS_KEY),
    iv,
  );

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
