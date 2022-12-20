import {
    BaseEntity,
    Column, Entity,
    Index, JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";

import { ArticleEntity } from "../../articles/entities/article.entity";
import { CommentEntity } from "../../articles/entities/comment.entity";

@Entity({ name: "realworld-users" })
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: '' })
    bio: string;

    @Column({ default: '' })
    image: string;

    @ManyToMany(() => UserEntity)
    @JoinTable({ name: 'user_following_user' })
    following: UserEntity[];

    @ManyToMany(() => UserEntity)
    @JoinTable({ name: 'user_followedby_user' })
    follower: UserEntity[];

    @OneToMany(() => ArticleEntity, articleEntity => articleEntity.author, { cascade: true })
    articles: ArticleEntity[];

    @ManyToMany(() => ArticleEntity, articleEntity => articleEntity.users)
    @JoinTable({ name: 'user_likes_article' })
    likes: ArticleEntity[];

    @OneToMany(() => CommentEntity, commentEntity => commentEntity.author)
    comments: CommentEntity[]
}