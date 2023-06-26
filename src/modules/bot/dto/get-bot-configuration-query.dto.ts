import { ApiProperty } from '@nestjs/swagger';

export class GetBotConfigurationQueryDto {
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
}
