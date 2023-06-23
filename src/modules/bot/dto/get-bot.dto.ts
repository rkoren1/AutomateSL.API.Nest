import { ApiProperty } from '@nestjs/swagger';

export class GetBotDto {
  @ApiProperty()
  my: SharedOrMyBot[];
  @ApiProperty()
  shared: SharedOrMyBot[];
}

class SharedOrMyBot {
  @ApiProperty()
  readonly id: number;
  @ApiProperty()
  readonly loginName: string;
  @ApiProperty()
  readonly loginLastName: string;
  @ApiProperty()
  readonly running: boolean;
  @ApiProperty()
  readonly uuid: string;
  @ApiProperty()
  readonly imageId: string;
  @ApiProperty()
  readonly validSubscription: boolean;
}
