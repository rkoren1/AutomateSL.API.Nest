import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('src/private-key.pem'),
    cert: fs.readFileSync('src/public-certificate.pem'),
  };
  const app = await NestFactory.create(AppModule, { httpsOptions });
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
}
bootstrap();
