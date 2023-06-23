import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateUserRes {
  @ApiProperty()
  readonly authenticated?: boolean;
  @ApiProperty()
  readonly message?: string;
  @ApiProperty()
  readonly accessToken?: string;
  @ApiProperty()
  readonly refreshToken?: string;
}
