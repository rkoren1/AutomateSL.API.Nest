import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
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
  authenticate(@Body() authenticateUserDto: AuthenticateUserDto) {
    return this.userService.authenticate(authenticateUserDto);
  }
}
