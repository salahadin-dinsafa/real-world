import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { ArticleEntity } from './entities/article.entity';
import { AuthModule } from '../auth/auth.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { CommentEntity } from './entities/comment.entity';

@Module({
  imports: [
    AuthModule,
    ProfilesModule,
    TypeOrmModule.forFeature([ArticleEntity, CommentEntity])],
  providers: [ArticlesService],
  controllers: [ArticlesController],
})
export class ArticlesModule { }
