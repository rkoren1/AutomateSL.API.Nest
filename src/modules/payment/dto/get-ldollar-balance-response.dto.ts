import { ApiProperty } from '@nestjs/swagger';

export class GetLDollarBalanceReponseDto {
  @ApiProperty()
  lDollarBalance: number;
}
