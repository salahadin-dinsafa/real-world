import { BaseEntity, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { UserEntity } from "../../auth/entities/user.entity";
import { ArticleEntity } from "./article.entity";

@Entity({ name: 'comments' })
export class CommentEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    body: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => UserEntity, userEntity => userEntity.comments)
    @JoinColumn({ name: 'authorId' })
    author: UserEntity;

    @ManyToOne(() => ArticleEntity, articleEntity => articleEntity.comments)
    @JoinColumn({ name: 'articleId' })
    article: ArticleEntity;

    @BeforeUpdate()
    updateTime() {
        this.updatedAt = new Date();
    }


}