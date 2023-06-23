import { Injectable, NestMiddleware } from '@nestjs/common';
import { Terminal } from 'src/modules/terminal/entities/terminal.entity';

@Injectable()
export class TerminalApikeyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const apiKey = req.query.apiKey;
    Terminal.findOne({
      attributes: ['name', 'apiKey'],
      where: { apiKey: apiKey },
    })
      .then((terminal) => {
        if (terminal === undefined || apiKey !== terminal.apiKey) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
        req.terminalName = terminal.name;
        next();
      })
      .catch((err) => res.status(401).json({ message: 'Unauthorized' }));
  }
}
