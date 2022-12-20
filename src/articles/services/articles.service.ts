import {
    Injectable, NotFoundException,
    UnauthorizedException, UnprocessableEntityException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import slugify from 'slugify';

import { AuthService } from '../../auth/auth.service';
import { ProfilesService } from '../../profiles/profiles.service';
import { ArticleEntity } from '../entities/article.entity';
import { UserEntity } from '../../auth/entities/user.entity';
import { Articles } from '../types/articles.type';
import { CreateArticleType } from '../types/create-article.type';
import { UpdateArticleType } from '../types/update-article.type';
import { Article, ArticleElement } from '../types/article.type';
import { ProfileElement } from '../../profiles/types/profile.type';
import { PaginationType } from '../types/pagination.type';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        private readonly datasource: DataSource,
        private readonly authService: AuthService,
        private readonly profileService: ProfilesService
    ) { }

    async getArticleBySlug(slug: string): Promise<ArticleEntity> {
        let article: ArticleEntity;
        try {
            article = await this.articleRepository.findOne({ where: { slug } });
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
        if (!article) throw new NotFoundException(`article with #slug: ${slug} not found`);
        return article;
    }
    async getArticleBySlugWithComment(slug: string): Promise<ArticleEntity> {
        let article: ArticleEntity;
        try {
            article = await this.articleRepository.findOne({ where: { slug }, relations: ['comments'] });
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
        if (!article) throw new NotFoundException(`article with #slug: ${slug} not found`);
        return article;
    }
    async getArticleBySlugWithUser(slug: string): Promise<ArticleEntity> {
        let article: ArticleEntity;
        try {
            article = await this.articleRepository.findOne({ where: { slug }, relations: ['users'] });
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
        if (!article) throw new NotFoundException(`article with #slug: ${slug} not found`);
        return article;
    }


    async getArticles(currentUser: UserEntity, pagination: PaginationType): Promise<Articles> {
        const { tag, author, limit, offset, favorited } = pagination;
        let username: string;
        currentUser ? username = currentUser.username : username = '';
        if (author) await this.authService.getUserByUsername(author);
        try {
            const queryBuilder =
                this.datasource
                    .getRepository(ArticleEntity)
                    .createQueryBuilder('articles')
                    .leftJoinAndSelect('articles.author', 'author')
                    .leftJoinAndSelect('articles.users', 'users')
            queryBuilder.addOrderBy('articles.updatedAt', 'DESC');
            if (tag) {
                queryBuilder.andWhere('articles.tagList LIKE :tag', { tag: `%${tag}%` })
            }

            if (author) {
                queryBuilder.andWhere('author.username = :username', { username: author })
            }

            if (favorited) {
                queryBuilder.andWhere('users.username = :username', { username: favorited })
            }

            limit ? queryBuilder.take(limit) : queryBuilder.take(10);
            offset ? queryBuilder.skip(offset) : queryBuilder.skip(0);

            const builtArticles: Articles = await this.getBuildArticles(username, await queryBuilder.getMany());

            return builtArticles;
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }
    async getArticlesFeed(user: UserEntity, pagination: PaginationType): Promise<Articles> {
        const { limit, offset } = pagination;
        let currentUser: UserEntity =
            await this.authService.getUserByUsernameWithRelationFollowing(user.username);
        try {
            const queryBuilder =
                this.datasource
                    .getRepository(ArticleEntity)
                    .createQueryBuilder('articles')
                    .leftJoinAndSelect('articles.author', 'author')
            const followedUsersname: string[] =
                currentUser.following.map(user => user.username);

            queryBuilder.andWhere('author.username IN (:...followedUsersname)', { followedUsersname })

            limit ? queryBuilder.take(limit) : queryBuilder.take(10);
            offset ? queryBuilder.skip(offset) : queryBuilder.skip(0);

            const builtArticles: Articles = await this.getBuildArticles(user.username, await queryBuilder.getMany());

            return builtArticles;
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }
    async createArticle(user: UserEntity, createArticle: CreateArticleType): Promise<Article> {
        const { article } = createArticle;
        try {
            const newArticle: ArticleEntity = this.articleRepository.create({
                ...article,
                slug: this.getSlug(article.title),
                author: user
            })
            return await this.getBuildArticle(user.username, await this.articleRepository.save(newArticle));
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }
    async getArticle(currentUser: UserEntity, slug: string): Promise<Article> {
        let article: ArticleEntity = await this.getArticleBySlug(slug);
        let username: string;
        currentUser ? username = currentUser.username : username = '';
        return await this.getBuildArticle(username, article);
    }
    async updateArticle(currentusername: string, slug: string, updateArticle: UpdateArticleType)
        : Promise<Article> {
        let article: ArticleEntity = await this.getArticleBySlug(slug);
        if (article.author.username !== currentusername)
            throw new UnauthorizedException(`User unauthorized for this article`);
        let title: string;
        try {
            if (updateArticle.article.title) {
                title = updateArticle.article.title
            } else {
                title = article.title
            }
            Object.assign(article, {
                ...updateArticle.article,
                slug: this.getSlug(title)
            })

            await this.articleRepository.save(article);
            return await this.getBuildArticle(currentusername, article)

        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }
    async deleteArticle(user: UserEntity, slug: string): Promise<void> {
        let article: ArticleEntity = await this.getArticleBySlug(slug);
        if (article.author.username !== user.username)
            throw new UnauthorizedException(`User unauthorized for this article`);
        try {
            await this.articleRepository.remove(article);
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }





    async getBuildArticle(currentUsername: string, article: ArticleEntity): Promise<Article> {
        delete article.id;
        delete article.users;
        const author: ProfileElement =
            await this.profileService.getProfile(currentUsername, article.author)
                .then(article => article.profile);
        return {
            article: {
                ...article,
                author
            }
        }
    }
    async getBuildArticles(currentUsername: string, articles: ArticleEntity[]): Promise<Articles> {
        const modifiedArticles: ArticleElement[] = await Promise.all(
            articles.map(async article =>
                await this.getBuildArticle(currentUsername, article).then(article => article.article))
        )
        return {
            articles: modifiedArticles
        }
    }

    private getSlug(title: string): string {
        return slugify(title, {
            lower: true
        }) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
    }
}
