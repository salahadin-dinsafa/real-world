import { ProfileElement } from "../../profiles/types/profile.type";

export interface Article {
    article: ArticleElement
}

export interface ArticleElement {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[],
    createdAt: Date;
    updatedAt: Date;
    favorited: boolean;
    favoritesCount: number;
    author: ProfileElement
}