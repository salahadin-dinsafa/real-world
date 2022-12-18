import { ProfileElement } from "../../profiles/types/profile.type";

export interface Comment {
    comment: CommentElement
}

export interface CommentElement {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    body: string;
    author: ProfileElement
}

