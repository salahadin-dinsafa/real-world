import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CreateCommentDto } from "../dto/create-comment.dto";
import { Comments } from "../types/comments.type";
import { Comment } from "../types/comment.type";
import { GetUser } from "../../auth/decorators/get-user.decorator";
import { UserEntity } from "../../auth/entities/user.entity";
import { CommentsService } from "../services/comments.service";

@ApiTags('Comments')
@Controller('articles')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @ApiOperation({ summary: 'Get comments for an article' })
    @ApiOkResponse({
        schema: {
            example: {
                comments: [
                    {
                        id: 'number',
                        createdAt: 'Date',
                        updatedAt: 'Date',
                        body: 'string',
                        author: {
                            bio: 'string',
                            following: 'boolean',
                            image: 'string',
                            username: 'string',
                        }
                    }
                ]
            }
        }
    })
    @Get(':slug/comments')
    getArticleComments(
        @GetUser('username') username: string,
        @Param('slug') slug: string
    ): Promise<Comments> {
        return this.commentsService.getArticleComments(username, slug);
    }

    @ApiOperation({ summary: 'Create a comment for an article' })
    @ApiCreatedResponse({
        schema: {
            example: {
                comment: {
                    id: 'number',
                    createdAt: 'Date',
                    updatedAt: 'Date',
                    body: 'string',
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
    @Post(':slug/comments')
    createArticleComments(
        @GetUser() user: UserEntity,
        @Param('slug') slug: string,
        @Body() createCommentDto: CreateCommentDto
    ): Promise<Comment> {
        return this.commentsService.createArticleComments(user, slug, createCommentDto);
    }

    @ApiOperation({ summary: 'Delete a comment for an article' })
    @UseGuards(AuthGuard())
    @Delete(':slug/comments/:id')
    deleteArticleComment(
        @GetUser() user: UserEntity,
        @Param('slug') slug: string,
        @Param('id', ParseIntPipe) id: number
    ): Promise<void> {
        return this.commentsService.deleteArticleComment(user, slug, id);
    }
}

