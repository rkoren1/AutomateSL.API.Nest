import { TerminalApikeyMiddleware } from './terminal-apikey.middleware';

describe('TerminalApikeyMiddleware', () => {
  it('should be defined', () => {
    expect(new TerminalApikeyMiddleware()).toBeDefined();
  });
});
