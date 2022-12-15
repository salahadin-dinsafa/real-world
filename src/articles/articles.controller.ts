import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    @Get('/feed')
    getArticlesFeed() { }

    @Get()
    getArticles() { }

    @Post()
    createArticle() { }

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
