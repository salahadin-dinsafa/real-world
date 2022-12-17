import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import slugify from 'slugify';

import { AuthService } from '../auth/auth.service';
import { ArticleEntity } from './entities/article.entity';
import { CreateArticleType } from './types/create-article.type';
import { PaginationType } from './types/pagination.type';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        private readonly datasource: DataSource,
        private readonly authService: AuthService
    ) { }

    async getArticles(pagination: PaginationType): Promise<ArticleEntity[]> {
        const { tag, author, limit, offset, favorited } = pagination;
        if (author) await this.authService.getUserByUsername(author);
        try {
            const queryBuilder =
                this.datasource
                    .getRepository(ArticleEntity)
                    .createQueryBuilder('articles')
                    .leftJoinAndSelect('articles.author', 'author')
                ;
            limit ? queryBuilder.take(limit) : queryBuilder.take(10);
            offset ? queryBuilder.skip(offset) : queryBuilder.skip(0);

            if (tag) {
                // todo: cheack query
                queryBuilder.andWhere('articles.tagList LIKE (:..tag)', { tag: `%${tag}%` })
            }

            if (author) {
                queryBuilder.andWhere('author.username = :username', { username: author })
            }

            if (favorited) {
                // todo: implement
            }
            return await queryBuilder.getMany();

        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    async createArticle(createArticle: CreateArticleType): Promise<ArticleEntity> {
        try {
            const article: ArticleEntity = this.articleRepository.create({
                ...createArticle,
                slug: slugify(createArticle.title, { lower: true, replacement: '-' }),
                // todo: assign author

            })
            return await this.articleRepository.save(article);
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    async getArticle(slug: string): Promise<ArticleEntity> {
        let article: ArticleEntity;
        try {
            article = await this.articleRepository.findOne({ where: { slug } });
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
        if (!article) throw new NotFoundException(`article with #slug: ${slug} not found`);
        return article;
    }
}
