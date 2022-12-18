import { MigrationInterface, QueryRunner } from "typeorm";

export class ArticleRelationWithLike1671311889691 implements MigrationInterface {
    name = 'ArticleRelationWithLike1671311889691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_followedby_user" DROP CONSTRAINT "FK_422d2256713c2433895130e8377"`);
        await queryRunner.query(`ALTER TABLE "user_followedby_user" DROP CONSTRAINT "FK_716a13bcf1f099b14390d07dd28"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_422d2256713c2433895130e837"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_716a13bcf1f099b14390d07dd2"`);
        await queryRunner.query(`CREATE TABLE "user_likes_article" ("usersId" integer NOT NULL, "articlesId" integer NOT NULL, CONSTRAINT "PK_612cf794cf5dfedbb98ce2aedaa" PRIMARY KEY ("usersId", "articlesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2bafb0e32e41bcaf50172c7279" ON "user_likes_article" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f537ad2bf36da4481c5b43881c" ON "user_likes_article" ("articlesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_942512fce3b7992ffa8d85f63e" ON "user_followedby_user" ("usersId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_287f6614d32063670e55990456" ON "user_followedby_user" ("usersId_2") `);
        await queryRunner.query(`ALTER TABLE "user_followedby_user" ADD CONSTRAINT "FK_942512fce3b7992ffa8d85f63ef" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_followedby_user" ADD CONSTRAINT "FK_287f6614d32063670e55990456b" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_likes_article" ADD CONSTRAINT "FK_2bafb0e32e41bcaf50172c72799" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_likes_article" ADD CONSTRAINT "FK_f537ad2bf36da4481c5b43881c9" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_likes_article" DROP CONSTRAINT "FK_f537ad2bf36da4481c5b43881c9"`);
        await queryRunner.query(`ALTER TABLE "user_likes_article" DROP CONSTRAINT "FK_2bafb0e32e41bcaf50172c72799"`);
        await queryRunner.query(`ALTER TABLE "user_followedby_user" DROP CONSTRAINT "FK_287f6614d32063670e55990456b"`);
        await queryRunner.query(`ALTER TABLE "user_followedby_user" DROP CONSTRAINT "FK_942512fce3b7992ffa8d85f63ef"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_287f6614d32063670e55990456"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_942512fce3b7992ffa8d85f63e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f537ad2bf36da4481c5b43881c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2bafb0e32e41bcaf50172c7279"`);
        await queryRunner.query(`DROP TABLE "user_likes_article"`);
        await queryRunner.query(`CREATE INDEX "IDX_716a13bcf1f099b14390d07dd2" ON "user_followedby_user" ("usersId_2") `);
        await queryRunner.query(`CREATE INDEX "IDX_422d2256713c2433895130e837" ON "user_followedby_user" ("usersId_1") `);
        await queryRunner.query(`ALTER TABLE "user_followedby_user" ADD CONSTRAINT "FK_716a13bcf1f099b14390d07dd28" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_followedby_user" ADD CONSTRAINT "FK_422d2256713c2433895130e8377" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
