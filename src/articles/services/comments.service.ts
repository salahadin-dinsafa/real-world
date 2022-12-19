import {
    Injectable,
    UnprocessableEntityException, NotFoundException, UnauthorizedException
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

import { ArticleEntity } from "../entities/article.entity";
import { CommentEntity } from "../entities/comment.entity";
import { CommentElement } from "../types/comment.type";
import { Comments } from "../types/comments.type";
import { Comment } from '../types/comment.type';
import { CreateCommentType } from "../types/create-comment.type";
import { UserEntity } from "../../auth/entities/user.entity";
import { ArticlesService } from "./articles.service";
import { ProfilesService } from "../../profiles/profiles.service";

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,
        private readonly articleService: ArticlesService,
        private readonly profileService: ProfilesService,
        private readonly datasource: DataSource
    ) { }

    async createArticleComments(user: UserEntity, slug: string, createComment: CreateCommentType)
        : Promise<Comment> {
        let article: ArticleEntity = await this.articleService.getArticleBySlugWithComment(slug);
        let comment: CommentEntity;
        try {
            comment = this.commentRepository.create({
                body: createComment.comment.body,
                author: user,
                article
            })
            comment = await this.commentRepository.save(comment);
            return await this.getBuildComment(user.username, comment)
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }
    async getArticleComments(username: string, slug: string): Promise<Comments> {
        let article: ArticleEntity = await this.articleService.getArticleBySlugWithComment(slug);

        try {
            const queryBuilder =
                this.datasource.getRepository(CommentEntity)
                    .createQueryBuilder('comments')
                    .leftJoinAndSelect('comments.author', 'author')
                    .leftJoinAndSelect('comments.article', 'article')

            queryBuilder.andWhere('article.id = :id', { id: article.id });
            const comments: CommentElement[] = await Promise.all(
                await queryBuilder.getMany()
                    .then(comments =>
                        comments.map(async comment =>
                            await this.getBuildComment(username, comment)
                                .then(comment => comment.comment)))
            )
            return {
                comments
            }

        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }
    async deleteArticleComment(user: UserEntity, slug: string, id: number): Promise<void> {
        let article: ArticleEntity = await this.articleService.getArticleBySlugWithComment(slug);
        let comment: CommentEntity;
        try {
            comment =
                await this.commentRepository.findOne({ where: { id }, relations: ['author', 'article'] })

        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
        if (!comment) throw new NotFoundException(`comment with #id: ${id} not found`);
        if (comment.author.id !== user.id) throw new UnauthorizedException('you can\'t delete this comment');
        if (comment.article.id !== article.id) throw new UnauthorizedException('comment not belong to this article');
        await this.commentRepository.remove(comment);
        return;
    }

    async getBuildComment(currentUsername: string, comment: CommentEntity): Promise<Comment> {
        delete comment.article;
        const { profile } = await this.profileService.getProfile(currentUsername, comment.author);
        return {
            comment: {
                ...comment,
                author: profile
            }
        }
    }
}