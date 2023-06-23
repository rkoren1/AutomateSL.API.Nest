import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthenticateUserRes } from './dto/authenticate-user-response.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('createuser')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('authenticate')
  @ApiOkResponse({
    type: AuthenticateUserRes,
  })
  authenticate(@Body() authenticateUserDto: AuthenticateUserDto) {
    return this.userService.authenticate(authenticateUserDto);
  }
}
