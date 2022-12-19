import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticlesService } from './services/articles.service';
import { ArticlesController } from './controllers/articles.controller';
import { ArticleEntity } from './entities/article.entity';
import { AuthModule } from '../auth/auth.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { CommentEntity } from './entities/comment.entity';
import { CommentsService } from './services/comments.service';
import { CommentsController } from './controllers/comments.controller';
import { FavoritesService } from './services/favorites.service';
import { FavoritesController } from './controllers/favorites.controller';

@Module({
  imports: [
    AuthModule,
    ProfilesModule,
    TypeOrmModule.forFeature([ArticleEntity, CommentEntity])],
  providers: [ArticlesService, CommentsService, FavoritesService],
  controllers: [ArticlesController, CommentsController, FavoritesController],
})
export class ArticlesModule { }
