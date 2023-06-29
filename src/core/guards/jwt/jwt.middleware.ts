import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return (res.statusCode = 401);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return (res.statusCode = 403); //invalid token
      req['email'] = decoded.email;
      req['id'] = decoded.id;
      next();
    });
  }
}
