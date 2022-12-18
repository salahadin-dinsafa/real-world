import { UserEntity } from "../../auth/entities/user.entity";
import { BaseEntity, BeforeUpdate, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CommentEntity } from "./comment.entity";

@Entity({ name: 'articles' })
export class ArticleEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    slug: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    body: string;

    @Column('simple-array', { default: [] })
    tagList: string[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ default: false })
    favorited: boolean;

    @Column({ default: 0 })
    favoritesCount: number;

    @ManyToOne(() => UserEntity, userEntity => userEntity.articles, { eager: true })
    @JoinColumn()
    author: UserEntity;

    @ManyToMany(() => UserEntity, userEntity => userEntity.likes)
    users: UserEntity[];

    @OneToMany(() => CommentEntity, commentEntity => commentEntity.article, { cascade: true })
    comments: CommentEntity[]

    @BeforeUpdate()
    updateTime() {
        this.updatedAt = new Date();
    }





}