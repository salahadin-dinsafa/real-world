import { MigrationInterface, QueryRunner } from "typeorm";

export class FollowRelation1671202430701 implements MigrationInterface {
    name = 'FollowRelation1671202430701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_following_user" ("usersId_1" integer NOT NULL, "usersId_2" integer NOT NULL, CONSTRAINT "PK_8667f0a05cee285f7fca909d520" PRIMARY KEY ("usersId_1", "usersId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_70fdcba719a3f01f53558a8d6c" ON "user_following_user" ("usersId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_479dbc62a30427a046fd0e37a3" ON "user_following_user" ("usersId_2") `);
        await queryRunner.query(`CREATE TABLE "user_followedby_user" ("usersId_1" integer NOT NULL, "usersId_2" integer NOT NULL, CONSTRAINT "PK_b902a73e525d5a95833447e29db" PRIMARY KEY ("usersId_1", "usersId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_422d2256713c2433895130e837" ON "user_followedby_user" ("usersId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_716a13bcf1f099b14390d07dd2" ON "user_followedby_user" ("usersId_2") `);
        await queryRunner.query(`ALTER TABLE "user_following_user" ADD CONSTRAINT "FK_70fdcba719a3f01f53558a8d6c5" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_following_user" ADD CONSTRAINT "FK_479dbc62a30427a046fd0e37a3a" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_followedby_user" ADD CONSTRAINT "FK_422d2256713c2433895130e8377" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_followedby_user" ADD CONSTRAINT "FK_716a13bcf1f099b14390d07dd28" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_followedby_user" DROP CONSTRAINT "FK_716a13bcf1f099b14390d07dd28"`);
        await queryRunner.query(`ALTER TABLE "user_followedby_user" DROP CONSTRAINT "FK_422d2256713c2433895130e8377"`);
        await queryRunner.query(`ALTER TABLE "user_following_user" DROP CONSTRAINT "FK_479dbc62a30427a046fd0e37a3a"`);
        await queryRunner.query(`ALTER TABLE "user_following_user" DROP CONSTRAINT "FK_70fdcba719a3f01f53558a8d6c5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_716a13bcf1f099b14390d07dd2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_422d2256713c2433895130e837"`);
        await queryRunner.query(`DROP TABLE "user_followedby_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_479dbc62a30427a046fd0e37a3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_70fdcba719a3f01f53558a8d6c"`);
        await queryRunner.query(`DROP TABLE "user_following_user"`);
    }

}
