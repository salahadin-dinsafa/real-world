import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';

import * as morgan from 'morgan';
import { DocumentBuilder } from "@nestjs/swagger";
import { SwaggerModule } from '@nestjs/swagger/dist';
import { config } from 'dotenv';
config();

import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filter/all-exception.filter';

const logStream = fs.createWriteStream('api.log', { flags: 'a' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(morgan('combined', { stream: logStream }));
  app.useGlobalFilters(new AllExceptionFilter);

  const options = new DocumentBuilder()
    .setContact('Salahadin Dinsafa', 'https://realworld.io/', 'salahadindinsafa@gmail.com')
    .setDescription('Conduit API')
    .setLicense('MIT License', 'https://opensource.org/licenses/MIT')
    .setTitle('RealWorld Conduit API')
    .setVersion('1.0.0')
    .build()
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const port: number = +process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
