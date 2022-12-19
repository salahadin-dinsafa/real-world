import { Controller, Delete, Param, Post, UseGuards } from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { Article } from "../types/article.type";
import { GetUser } from "../../auth/decorators/get-user.decorator";
import { UserEntity } from "../../auth/entities/user.entity";
import { FavoritesService } from "../services/favorites.service";

@ApiTags('Favorites')
@Controller('articles')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) { }

    @ApiOperation({ summary: 'Favorite an article' })
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
    @Post(':slug/favorite')
    createArticleFavorite(
        @GetUser() user: UserEntity,
        @Param('slug') slug: string
    ): Promise<Article> {
        return this.favoritesService.createArticleFavorite(user, slug);
    }

    @ApiOperation({ summary: 'Unfavorite an article' })
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
    @Delete(':slug/favorite')
    deleteArticleFavorite(
        @GetUser() user: UserEntity,
        @Param('slug') slug: string
    ): Promise<Article> {
        return this.favoritesService.deleteArticleFavorite(user, slug);
    }
}