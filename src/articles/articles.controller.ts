import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserEntity } from '../auth/entities/user.entity';
import { ArticlesService } from './articles.service';
import { Articles } from './articles.type';
import { CreateArticleDto } from './dto/create-article.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FeedPaginationDto } from './dto/feed-pagination.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './types/article.type';
import { Comment } from './types/comment.type';
import { Comments } from './types/comments.type';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    @UseGuards(AuthGuard())
    @Get('/feed')
    getArticlesFeed(
        @GetUser() user: UserEntity,
        @Query() feedPaginationDto: FeedPaginationDto): Promise<Articles> {
        return this.articlesService.getArticlesFeed(user, feedPaginationDto)
    }

    @Get()
    getArticles(
        @GetUser() user: UserEntity,
        @Query() paginationDto: PaginationDto):
        Promise<Articles> {
        return this.articlesService.getArticles(user, paginationDto);
    }

    @UseGuards(AuthGuard())
    @Post()
    createArticle(
        @GetUser() user: UserEntity,
        @Body() createArticleDto: CreateArticleDto): Promise<Article> {
        return this.articlesService.createArticle(user, createArticleDto);
    }

    @Get(':slug')
    getArticle(
        @GetUser('username') username: string,
        @Param('slug') slug: string): Promise<Article> {
        return this.articlesService.getArticle(username, slug)
    }

    @UseGuards(AuthGuard())
    @Put(':slug')
    updateArticle(
        @GetUser('username') username: string,
        @Param('slug') slug: string,
        @Body() updateArticleDto: UpdateArticleDto
    ): Promise<Article> {
        return this.articlesService.updateArticle(username, slug, updateArticleDto)
    }

    @UseGuards(AuthGuard())
    @Delete(':slug')
    deleteArticle(
        @GetUser() user: UserEntity,
        @Param('slug') slug: string
    ): Promise<void> {
        return this.articlesService.deleteArticle(user, slug);
    }

    @Get(':slug/comments')
    getArticleComments(
        @GetUser('username') username: string,
        @Param('slug') slug: string
    ): Promise<Comments> {
        return this.articlesService.getArticleComments(username, slug);
    }

    @UseGuards(AuthGuard())
    @Post(':slug/comments')
    createArticleComments(
        @GetUser() user: UserEntity,
        @Param('slug') slug: string,
        @Body() createCommentDto: CreateCommentDto
    ): Promise<Comment> {
        return this.articlesService.createArticleComments(user, slug, createCommentDto);
    }

    @UseGuards(AuthGuard())
    @Delete(':slug/comments/:id')
    deleteArticleComment(
        @GetUser() user: UserEntity,
        @Param('slug') slug: string,
        @Param('id', ParseIntPipe) id: number
    ): Promise<void> {
        return this.articlesService.deleteArticleComment(user, slug, id);
    }

    @UseGuards(AuthGuard())
    @Post(':slug/favorite')
    createArticleFavorite(
        @GetUser() user: UserEntity,
        @Param('slug') slug: string
    ): Promise<Article> {
        return this.articlesService.createArticleFavorite(user, slug);
    }

    @UseGuards(AuthGuard())
    @Delete(':slug/favorite')
    deleteArticleFavorite(
        @GetUser() user: UserEntity,
        @Param('slug') slug: string
    ): Promise<Article> {
        return this.articlesService.deleteArticleFavorite(user, slug);
    }
}
