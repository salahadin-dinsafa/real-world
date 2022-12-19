import { Injectable, UnprocessableEntityException, NotFoundException } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ArticleEntity } from "../entities/article.entity";
import { Article } from "../types/article.type";
import { UserEntity } from "../../auth/entities/user.entity";
import { ArticlesService } from "./articles.service";

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        private readonly articleService: ArticlesService
    ) { }

    async createArticleFavorite(user: UserEntity, slug: string): Promise<Article> {
        let article: ArticleEntity = await this.articleService.getArticleBySlugWithUser(slug);

        !article.users.find(user => user) ?
            article.favoritesCount += 1 :
            null;
        article.users = [...article.users, user];
        article.favorited = true;

        await this.articleRepository.save(article);
        delete article.users;
        return await this.articleService.getBuildArticle(user.username, article)
    }
    async deleteArticleFavorite(user: UserEntity, slug: string): Promise<Article> {
        let article: ArticleEntity;
        try {
            article = await this.articleRepository.findOne({ where: { slug }, relations: ['users'] })

        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
        if (!article) throw new NotFoundException(`Article with #slug: ${slug} not found`);

        article.users.find(user => user) ?
            article.favoritesCount -= 1 :
            null;
        article.users = article.users.filter(thisUser => thisUser.username !== user.username);
        if (article.users.length === 0) article.favorited = false;

        await this.articleRepository.save(article);
        delete article.users;
        return await this.articleService.getBuildArticle(user.username, article)
    }
}