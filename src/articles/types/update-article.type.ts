export interface UpdateArticleType {
    article: UpdateArticleElement
}

interface UpdateArticleElement {
    title?: string;
    body?: string;
    description?: string;
}