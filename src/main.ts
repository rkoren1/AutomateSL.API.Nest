import { NestApplication, NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as fs from 'fs';
import * as spdy from 'spdy';
import { AppModule } from './app.module';
import { discClient } from './core/services/discord-bot.service';

async function bootstrap() {
  const expressApp = express();
  const httpsOptions = {
    key: fs.readFileSync('src/private-key.pem'),
    cert: fs.readFileSync('src/public-certificate.pem'),
  };
  const server = spdy.createServer(httpsOptions, expressApp);
  const app: NestApplication = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.use(cookieParser());
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://www.automatesl.com',
      'https://automatesl.com',
    ],
    optionsSuccessStatus: 200,
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Automate SL API')
    .addApiKey({ type: 'apiKey', name: 'apiKey', in: 'query' }, 'apiKey')
    .setDescription('Automate SL API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);
  await app.init();
  await server.listen(3000);
  discClient.login(process.env.DISC_BOT_TOKEN);
}
bootstrap();
