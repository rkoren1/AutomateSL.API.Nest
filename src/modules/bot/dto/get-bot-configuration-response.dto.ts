import { ApiProperty } from '@nestjs/swagger';

export class GetBotConfigurationResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  loginFirstName: string;
  @ApiProperty()
  loginSpawnLocation: string;
  @ApiProperty()
  imageId: string;
  @ApiProperty()
  subscriptions?: [];
  @ApiProperty()
  loginRegion?: string;
  @ApiProperty()
  message?: string;
}
