import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostsTable1767607686723 implements MigrationInterface {
    name = 'CreatePostsTable1767607686723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_refresh_token_user_id"`);
        await queryRunner.query(`ALTER TABLE "email_change_tokens" DROP CONSTRAINT "FK_email_change_tokens_user_id"`);
        await queryRunner.query(`ALTER TABLE "password_resets" DROP CONSTRAINT "FK_password_resets_user_id"`);
        await queryRunner.query(`ALTER TABLE "email_verifications" DROP CONSTRAINT "FK_email_verifications_user_id"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_users_roles_user_id"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_users_roles_role_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_roles_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_roles_role_id"`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" text NOT NULL, "creatorId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "password_reset_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tokenHash" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_838af121380dfe3a6330e04f5bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e4435209df12bc1f001e536017" ON "users_roles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1cf664021f00b9cc1ff95e17de" ON "users_roles" ("role_id") `);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_change_tokens" ADD CONSTRAINT "FK_5079c637bc96fe23c8aa4ccd7da" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c07f375e63832303f0a5049b776" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "password_resets" ADD CONSTRAINT "FK_d95569f623f28a0bf034a55099e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_verifications" ADD CONSTRAINT "FK_4e63a91e0a684b31496bd50733e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "password_reset_token" ADD CONSTRAINT "FK_a4e53583f7a8ab7d01cded46a41" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_e4435209df12bc1f001e5360174" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_1cf664021f00b9cc1ff95e17de4"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_e4435209df12bc1f001e5360174"`);
        await queryRunner.query(`ALTER TABLE "password_reset_token" DROP CONSTRAINT "FK_a4e53583f7a8ab7d01cded46a41"`);
        await queryRunner.query(`ALTER TABLE "email_verifications" DROP CONSTRAINT "FK_4e63a91e0a684b31496bd50733e"`);
        await queryRunner.query(`ALTER TABLE "password_resets" DROP CONSTRAINT "FK_d95569f623f28a0bf034a55099e"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c07f375e63832303f0a5049b776"`);
        await queryRunner.query(`ALTER TABLE "email_change_tokens" DROP CONSTRAINT "FK_5079c637bc96fe23c8aa4ccd7da"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1cf664021f00b9cc1ff95e17de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e4435209df12bc1f001e536017"`);
        await queryRunner.query(`DROP TABLE "password_reset_token"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`CREATE INDEX "IDX_users_roles_role_id" ON "users_roles" ("role_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_users_roles_user_id" ON "users_roles" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_users_roles_role_id" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_users_roles_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "email_verifications" ADD CONSTRAINT "FK_email_verifications_user_id" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "password_resets" ADD CONSTRAINT "FK_password_resets_user_id" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "email_change_tokens" ADD CONSTRAINT "FK_email_change_tokens_user_id" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_refresh_token_user_id" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
