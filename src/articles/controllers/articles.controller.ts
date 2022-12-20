import {
    Body, Controller,
    Delete, Get, Param, Post, Put, Query, UseGuards,
    Logger
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger/dist';

import { GetUser } from '../../auth/decorators/get-user.decorator';
import { UserEntity } from '../../auth/entities/user.entity';
import { ArticlesService } from '../services/articles.service';
import { Articles } from '../types/articles.type';
import { CreateArticleDto } from '../dto/create-article.dto';
import { FeedPaginationDto } from '../dto/feed-pagination.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { Article } from '../types/article.type';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
    logger = new Logger('ArticlesController');

    constructor(private readonly articlesService: ArticlesService) { }

    @ApiOperation({ summary: 'Get recent articles from users you follow', description: 'Get most recent articles from users you follow. Use query parameter' })
    @ApiOkResponse({
        schema: {
            example: {
                articles: [{
                    slug: 'string',
                    title: 'string',
                    description: 'string',
                    body: 'string',
                    tagList: 'string[]',
                    createdAt: 'Date',
                    updatedAt: 'Date',
                    favorited: 'boolean',
                    favoritesCount: 'number',
                    author: {
                        bio: 'string',
                        following: 'boolean',
                        image: 'string',
                        username: 'string',
                    }
                }]
            }
        }
    })
    @UseGuards(AuthGuard())
    @Get('/feed')
    getArticlesFeed(
        @GetUser() user: UserEntity,
        @Query() feedPaginationDto: FeedPaginationDto): Promise<Articles> {
        this.logger.verbose(`User with #id: ${user.id} getting article feed with #FeedPaginationDto: ${JSON.stringify(feedPaginationDto)}`)
        return this.articlesService.getArticlesFeed(user, feedPaginationDto)
    }

    @ApiOperation({ summary: 'Get recent articles globaly', description: 'Get most recent articles globally. Use query parameters to filter results. Auth is optionl' })
    @ApiOkResponse({
        schema: {
            example: {
                articles: [{
                    slug: 'string',
                    title: 'string',
                    description: 'string',
                    body: 'string',
                    tagList: 'string[]',
                    createdAt: 'Date',
                    updatedAt: 'Date',
                    favorited: 'boolean',
                    favoritesCount: 'number',
                    author: {
                        bio: 'string',
                        following: 'boolean',
                        image: 'string',
                        username: 'string',
                    }
                }]
            }
        }
    })
    @Get()
    getArticles(
        @GetUser() user: UserEntity,
        @Query() paginationDto: PaginationDto):
        Promise<Articles> {
        this.logger.verbose(`getting articles with #PaginationDto: ${JSON.stringify(paginationDto)}`)
        return this.articlesService.getArticles(user, paginationDto);
    }

    @ApiOperation({ summary: 'Create an article', description: 'Create an article. Auth is required' })
    @ApiCreatedResponse({
        schema: {
            example: {
                article: {
                    slug: 'string',
                    title: 'string',
                    description: 'string',
                    body: 'string',
                    tagList: 'string[]',
                    createdAt: 'Date',
                    updatedAt: 'Date',
                    favorited: 'boolean',
                    favoritesCount: 'number',
                    author: {
                        bio: 'string',
                        following: 'boolean',
                        image: 'string',
                        username: 'string',
                    }
                }
            }
        }
    })
    @UseGuards(AuthGuard())
    @Post()
    createArticle(
        @GetUser() user: UserEntity,
        @Body() createArticleDto: CreateArticleDto): Promise<Article> {
        this.logger.verbose(`User with #id: ${user.id} creating article with #CreateArticleDto: ${JSON.stringify(createArticleDto)}`)
        return this.articlesService.createArticle(user, createArticleDto);
    }

    @ApiOperation({ summary: 'Get an article', description: 'Get an article. Auth not required' })
    @ApiOkResponse({
        schema: {
            example: {
                article: {
                    slug: 'string',
                    title: 'string',
                    description: 'string',
                    body: 'string',
                    tagList: 'string[]',
                    createdAt: 'Date',
                    updatedAt: 'Date',
                    favorited: 'boolean',
                    favoritesCount: 'number',
                    author: {
                        bio: 'string',
                        following: 'boolean',
                        image: 'string',
                        username: 'string',
                    }
                }
            }
        }
    })
    @Get(':slug')
    getArticle(
        @GetUser() user: UserEntity,
        @Param('slug') slug: string): Promise<Article> {
        this.logger.verbose(`getting a single article with #slug: ${slug}`);
        return this.articlesService.getArticle(user, slug)
    }

    @ApiOperation({ summary: 'Update an article', description: 'Update an article. Auth is required' })
    @ApiOkResponse({
        schema: {
            example: {
                article: {
                    slug: 'string',
                    title: 'string',
                    description: 'string',
                    body: 'string',
                    tagList: 'string[]',
                    createdAt: 'Date',
                    updatedAt: 'Date',
                    favorited: 'boolean',
                    favoritesCount: 'number',
                    author: {
                        bio: 'string',
                        following: 'boolean',
                        image: 'string',
                        username: 'string',
                    }
                }
            }
        }
    })
    @UseGuards(AuthGuard())
    @Put(':slug')
    updateArticle(
        @GetUser('username') username: string,
        @Param('slug') slug: string,
        @Body() updateArticleDto: UpdateArticleDto
    ): Promise<Article> {
        this.logger.verbose(`User with #username: ${username} updating article with #UpdateArticleDto: ${JSON.stringify(updateArticleDto)}`)
        return this.articlesService.updateArticle(username, slug, updateArticleDto)
    }

    @ApiOperation({ summary: 'Delete an article', description: 'Delete an article. Auth is required' })
    @UseGuards(AuthGuard())
    @Delete(':slug')
    deleteArticle(
        @GetUser() user: UserEntity,
        @Param('slug') slug: string
    ): Promise<void> {
        this.logger.verbose(`User with #id: ${user.id} removing article with slug: ${slug}`)
        return this.articlesService.deleteArticle(user, slug);
    }

}
