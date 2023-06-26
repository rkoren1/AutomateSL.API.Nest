import { ApiProperty } from '@nestjs/swagger';

export class PayForPackageResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  message?: string;
}
