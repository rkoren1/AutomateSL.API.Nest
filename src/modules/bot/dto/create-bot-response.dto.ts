import { ApiProperty } from '@nestjs/swagger';

export class CreateBotResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  message: string;
}
