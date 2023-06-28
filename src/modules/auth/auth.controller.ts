import { Controller, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { ApiOkResponse } from '@nestjs/swagger';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import * as jwt from 'jsonwebtoken';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
  @Get('logout')
  logout(@Req() req, @Res() res) {
    //on client, also delete accessToken
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //no content
    const refreshToken = cookies.jwt;
    //find user with upper refresh token
    User.findOne({
      attributes: ['email'],
      where: { refreshToken: refreshToken },
    })
      .then((foundUser) => {
        //delete refreshtoken in db (make it empty string)
        User.update({ refreshToken: '' }, { where: { email: foundUser.email } })
          .then((result) => {
            res.clearCookie('jwt', { httpOnly: true, maxAge: 86400000 }); //secure: true - only serves on https
            return res.sendStatus(204);
          })
          .catch((err) => res.sendStatus(500));
      })
      .catch((err) => {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 86400000 });
        return res.sendStatus(204);
      });
  }
}
