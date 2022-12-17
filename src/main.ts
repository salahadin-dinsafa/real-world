import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';

import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filter/all-exception.filter';

const logStream = fs.createWriteStream('api.log', { flags: 'a' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(morgan('combined', { stream: logStream }));
  app.useGlobalFilters(new AllExceptionFilter);
  await app.listen(3000);
}
bootstrap();
