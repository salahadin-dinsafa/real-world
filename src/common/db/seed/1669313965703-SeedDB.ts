import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDb1669313965703 implements MigrationInterface {
    name = 'SeedDb1669313965703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO users (username, email, password) VALUES 
            ('user1', 'user1@gmail.com','$2a$15$p487G6lSNFmyfH.qM6q1kus3QHd5eTamsT2Mzk7nxUE87TWi5rtuy'),
            ('user2', 'user2@gmail.com','$2a$15$p487G6lSNFmyfH.qM6q1kus3QHd5eTamsT2Mzk7nxUE87TWi5rtuy')
            `);
        await queryRunner.query(
            `INSERT INTO tags (name) VALUES 
            ('kurulus osman'),
            ('Ertugrul gazi'),
            ('Itqan')`);
        await queryRunner.query(
            `INSERT INTO articles (slug, title, "authorId") VALUES 
            ('article-1-user-1', 'article-1-title', '1'),
            ('article-2-user-1', 'article-2-title', '1'),
            ('article-1-user-2', 'article-1-title', '2'),
            ('article-2-user-2', 'article-2-title', '2')`);
    }

    public async down(): Promise<void> { }

}
