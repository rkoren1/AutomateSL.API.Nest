import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TerminalService } from './terminal.service';
import { TerminalController } from './terminal.controller';
import { TerminalApikeyMiddleware } from 'src/core/guards/terminal-apikey/terminal-apikey.middleware';

@Module({
  controllers: [TerminalController],
  providers: [TerminalService],
})
export class TerminalModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TerminalApikeyMiddleware).forRoutes('/terminal');
  }
}
