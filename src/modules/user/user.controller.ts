import { Body, Controller, Post, Res } from '@nestjs/common';
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
  authenticate(@Body() authenticateUserDto: AuthenticateUserDto, @Res() res) {
    return this.userService
      .authenticate(authenticateUserDto)
      .then((result) => {
        if (result.refresh_token) {
          if (authenticateUserDto.rememberMe) {
            res.cookie('jwt', result.refresh_token, {
              httpOnly: true,
              maxAge: 7889400000,
            }); // maxAge = 3 months in ms
          } else {
            res.cookie('jwt', result.refresh_token, {
              httpOnly: true,
              maxAge: 86400000,
            }); // maxAge = 1day in ms
          }
        }
        return res.status(200).json({
          email: authenticateUserDto.email,
          authenticated: result.authenticated,
          access_token: result.access_token,
          message: 'Logged in Successfuly',
        });
      })
      .catch((err) => {
        return res.status(400).send({
          authenticated: false,
          access_token: null,
          email: null,
          message: 'Invalid Credentials',
        });
      });
  }
}
