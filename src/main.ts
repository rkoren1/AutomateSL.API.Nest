import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { discClient } from './core/services/discord-bot.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
    .setDescription('Automate SL API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);
  await app.listen(3000);
  discClient.login(process.env.DISC_BOT_TOKEN);
}
bootstrap();
