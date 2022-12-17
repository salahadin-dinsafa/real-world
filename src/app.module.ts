import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';


import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ArticlesModule } from './articles/articles.module';
import { TagsModule } from './tags/tags.module';
import { ormConfig } from './common/db/ormconfig.datasource';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.required(),
        DB_PORT: [
          Joi.number(),
          Joi.required()],
        DB_USER: Joi.required(),
        DB_PASSWORD: Joi.required(),
        DB_NAME: Joi.required(),
        JWT_SECRET: Joi.required()
      })
    }),
    TypeOrmModule.forRootAsync(
      { useFactory: ormConfig }
    ),
    AuthModule,
    ProfilesModule,
    ArticlesModule,
    TagsModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true }
      })
    }
  ]
})
export class AppModule { }
