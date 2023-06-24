import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateUserRes {
  @ApiProperty()
  readonly email?: string;
  @ApiProperty()
  readonly authenticated?: boolean;
  @ApiProperty()
  readonly message?: string;
  @ApiProperty()
  readonly access_token?: string;
  @ApiProperty()
  readonly refresh_token?: string;
}
