import { ExtensionPeriodUnit } from 'src/core/constants/constants';

export class PaySubscriptionDto {
  extensionTime: number;
  extensionTimeUnit: ExtensionPeriodUnit;
  packageId: number;
  botId: number;
}
