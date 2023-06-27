import { Controller, Get, Req, Res } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { AppService } from './app.service';
import { RefreshTokenResponseDto } from './modules/dto/refresh-token-response.dto';
import { User } from './modules/user/entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('refreshtoken')
  @ApiOkResponse({
    type: RefreshTokenResponseDto,
  })
  refreshToken(@Req() req, @Res() res) {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    //find user with upper refresh token
    return User.findOne({
      attributes: ['email'],
      where: { refreshToken: refreshToken },
    })
      .then((foundUser) => {
        if (!foundUser) return res.sendStatus(204);
        //evaluate jwt
        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (err, decoded) => {
            if (err || foundUser.email !== decoded.email) {
              return res.sendStatus(403);
            }
            const accessToken = jwt.sign(
              { id: decoded.id, email: decoded.email },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '300s' },
            );
            res.json({ access_token: accessToken, email: foundUser.email });
          },
        );
      })
      .catch(
        (err) => res.sendStatus(403), //unauthorized
      );
  }
}
