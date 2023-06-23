import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    return User.create({
      email: createUserDto.email,
      password: createUserDto.password,
    })
      .then((res) => ({
        success: true,
        message: 'Succesfuly created new user',
      }))
      .catch((error) => {
        if (error) {
          if (error.errno === 1062)
            return {
              success: false,
              message: 'This username is already taken.',
            };
          console.error(error);
          return {
            success: false,
            message: 'Error during creation of new user',
          };
        }
      });
  }
  authenticate(authenticateUserDto: AuthenticateUserDto) {
    User.findOne({
      attributes: ['id', 'email', 'password'],
      where: { email: authenticateUserDto.email },
    })
      .then((user) => {
        if (!user) return { message: 'invalid credentials' };
        bcrypt
          .compare(authenticateUserDto.password, user.password)
          .then((result) => {
            if (result === true) {
              const accessToken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '300s' }, //usually 5min
              );
              const refreshToken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' },
              );
              //save refreshToken in db
              User.update(
                { refreshToken: refreshToken },
                { where: { email: authenticateUserDto.email } },
              )
                .then((updateResult) => ({
                  authenticated: true,
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                }))
                .catch((err) => {
                  console.error(err);
                  return { authenticated: false, message: 'error occured' };
                });
            } else {
              return { authenticated: false };
            }
          })
          .catch((err) => {
            console.error(err);
            return { authenticated: false, message: 'error occured' };
          });
      })
      .catch((err) => {
        console.error(err);
        return { authenticated: false, message: 'error occured' };
      });
  }
}
