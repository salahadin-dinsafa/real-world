import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDb1669313965703 implements MigrationInterface {
    name = 'SeedDb1669313965703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO users (username, email, password) VALUES 
            ('user1', 'user1@gmail.com','$2a$15$62WcXQo/PLtcHIi8G1tYT.wnK5G3bWgwn7vMSsUHxBtnwK1X1qtTa'),
            ('user2', 'user2@gmail.com','$2a$15$62WcXQo/PLtcHIi8G1tYT.wnK5G3bWgwn7vMSsUHxBtnwK1X1qtTa'),
            ('foo1', 'foo1@gmail.com','$2a$15$62WcXQo/PLtcHIi8G1tYT.wnK5G3bWgwn7vMSsUHxBtnwK1X1qtTa')
            `);
        await queryRunner.query(
            `INSERT INTO tags (name) VALUES 
            ('kurulus osman'),
            ('Ertugrul gazi'),
            ('Itqan')`);
        await queryRunner.query(
            `INSERT INTO articles (slug, title, body, description, "authorId") VALUES 
            ('article-1-user-1', 'article-1-title','article-1-body', 'article-1-description', '1'),
            ('article-2-user-1', 'article-2-title','article-2-body', 'article-2-description', '1'),
            ('article-1-user-2', 'article-1-title','article-3-body', 'article-3-description', '2'),
            ('article-2-user-2', 'article-2-title','article-3-body', 'article-3-description', '2')`);
        await queryRunner.query(
            `INSERT INTO user_following_user ("usersId_1", "usersId_2") VALUES
            ('3', '2')`
        );
        await queryRunner.query(
            `INSERT INTO user_followedby_user ("usersId_1", "usersId_2") VALUES
            ('2', '3')`
        );
    }

    public async down(): Promise<void> { }

}
