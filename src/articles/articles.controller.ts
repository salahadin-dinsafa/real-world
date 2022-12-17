import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';

import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { FeedPaginationDto } from './dto/feed-pagination.dto';
import { PaginationDto } from './dto/pagination.dto';
import { ArticleEntity } from './entities/article.entity';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    // todo: need follow
    // todo: auth required
    @Get('/feed')
    getArticlesFeed(@Query() feedPaginationDto: FeedPaginationDto) { }

    @Get()
    getArticles(@Query() paginationDto: PaginationDto): Promise<ArticleEntity[]> {
        return this.articlesService.getArticles(paginationDto);
    }

    // todo: user required
    @Post()
    createArticle(@Body() createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
        return this.articlesService.createArticle(createArticleDto);
    }

    @Get(':slug')
    getArticle() { }

    @Put(':slug')
    updateArticle() { }

    @Delete(':slug')
    deleteArticle() { }

    @Get(':slug/comments')
    getArticleComments() { }

    @Post(':slug/comments')
    createArticleComments() { }

    @Delete(':slug/comments/:id')
    deleteArticleComment() { }

    @Post(':slug/favorite')
    createArticleFavorite() { }

    @Delete(':slug/favorite')
    deleteArticleFavorite() { }
}
