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

    async createArticleFavorite(currentUser: UserEntity, slug: string): Promise<Article> {
        let article: ArticleEntity = await this.articleService.getArticleBySlugWithUser(slug);

        article.users.find(user => user.id === currentUser.id) ?
            article.favoritesCount = article.favoritesCount :
            article.favoritesCount = article.favoritesCount + 1;
        article.users = [...article.users, currentUser];
        article.favorited = true;

        await this.articleRepository.save(article);
        delete article.users;
        return await this.articleService.getBuildArticle(currentUser.username, article)
    }
    async deleteArticleFavorite(currentUser: UserEntity, slug: string): Promise<Article> {
        let article: ArticleEntity;
        try {
            article = await this.articleRepository.findOne({ where: { slug }, relations: ['users'] })

        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
        if (!article) throw new NotFoundException(`Article with #slug: ${slug} not found`);

        article.users.find(user => user.id === currentUser.id) ?
            article.favoritesCount = article.favoritesCount - 1 :
            article.favoritesCount = article.favoritesCount;
        article.users = article.users.filter(thisUser => thisUser.username !== currentUser.username);
        if (article.users.length === 0) article.favorited = false;

        await this.articleRepository.save(article);
        delete article.users;
        return await this.articleService.getBuildArticle(currentUser.username, article)
    }
}