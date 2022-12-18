export interface CreateArticleType {
    article: CreateArticleElementType
}

interface CreateArticleElementType {
    title: string;
    body: string;
    description: string;
    tagList?: string[];
}