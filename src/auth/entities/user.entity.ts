import { ArticleEntity } from "../../articles/entities/article.entity";
import {
    BaseEntity,
    Column, Entity,
    Index, JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";

@Entity({ name: "users" })
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
}