import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1766428001874 implements MigrationInterface {
    name = 'Init1766428001874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable UUID extension
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create roles table
        await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_roles_name" UNIQUE ("name"),
                CONSTRAINT "PK_roles_id" PRIMARY KEY ("id")
            )
        `);

        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "username" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "isVerified" boolean NOT NULL DEFAULT false,
                "isActive" boolean NOT NULL DEFAULT true,
                "deactivatedAt" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_username" UNIQUE ("username"),
                CONSTRAINT "UQ_users_email" UNIQUE ("email"),
                CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
            )
        `);

        // Create users_roles join table
        await queryRunner.query(`
            CREATE TABLE "users_roles" (
                "user_id" uuid NOT NULL,
                "role_id" uuid NOT NULL,
                CONSTRAINT "PK_users_roles" PRIMARY KEY ("user_id", "role_id")
            )
        `);

        // Create index on users_roles
        await queryRunner.query(`CREATE INDEX "IDX_users_roles_user_id" ON "users_roles" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_users_roles_role_id" ON "users_roles" ("role_id")`);

        // Create refresh_token table
        await queryRunner.query(`
            CREATE TABLE "refresh_token" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "tokenHash" character varying NOT NULL,
                "expiresAt" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                CONSTRAINT "PK_refresh_token_id" PRIMARY KEY ("id")
            )
        `);

        // Create password_resets table
        await queryRunner.query(`
            CREATE TABLE "password_resets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "codeHash" character varying NOT NULL,
                "expiresAt" TIMESTAMP NOT NULL,
                "used" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                CONSTRAINT "PK_password_resets_id" PRIMARY KEY ("id")
            )
        `);

        // Create email_change_tokens table
        await queryRunner.query(`
            CREATE TABLE "email_change_tokens" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "tokenHash" character varying NOT NULL,
                "newEmail" character varying NOT NULL,
                "expiresAt" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                CONSTRAINT "PK_email_change_tokens_id" PRIMARY KEY ("id")
            )
        `);

        // Create email_verifications table
        await queryRunner.query(`
            CREATE TABLE "email_verifications" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "codeHash" character varying NOT NULL,
                "expiresAt" TIMESTAMP NOT NULL,
                "used" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid,
                CONSTRAINT "PK_email_verifications_id" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "users_roles" 
            ADD CONSTRAINT "FK_users_roles_user_id" 
            FOREIGN KEY ("user_id") REFERENCES "users"("id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "users_roles" 
            ADD CONSTRAINT "FK_users_roles_role_id" 
            FOREIGN KEY ("role_id") REFERENCES "roles"("id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "refresh_token" 
            ADD CONSTRAINT "FK_refresh_token_user_id" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "password_resets" 
            ADD CONSTRAINT "FK_password_resets_user_id" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "email_change_tokens" 
            ADD CONSTRAINT "FK_email_change_tokens_user_id" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "email_verifications" 
            ADD CONSTRAINT "FK_email_verifications_user_id" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        console.log('Database initialized successfully');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints first
        await queryRunner.query(`ALTER TABLE "email_verifications" DROP CONSTRAINT "FK_email_verifications_user_id"`);
        await queryRunner.query(`ALTER TABLE "email_change_tokens" DROP CONSTRAINT "FK_email_change_tokens_user_id"`);
        await queryRunner.query(`ALTER TABLE "password_resets" DROP CONSTRAINT "FK_password_resets_user_id"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_refresh_token_user_id"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_users_roles_role_id"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_users_roles_user_id"`);

        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_users_roles_role_id"`);
        await queryRunner.query(`DROP INDEX "IDX_users_roles_user_id"`);

        // Drop tables in reverse order
        await queryRunner.query(`DROP TABLE "email_verifications"`);
        await queryRunner.query(`DROP TABLE "email_change_tokens"`);
        await queryRunner.query(`DROP TABLE "password_resets"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
        await queryRunner.query(`DROP TABLE "users_roles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        console.log('Database reverted successfully');
    }

}
