import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoles1766428908700 implements MigrationInterface {
  name = 'SeedRoles1766428908700';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Import your role configs
    const DEFAULT_ROLES = ['USER', 'SUPERADMIN']; // adjust based on your config
    const PROJECT_ROLES = []; // adjust based on your config

    const rolesToCreate = [...DEFAULT_ROLES, ...PROJECT_ROLES];

    for (const name of rolesToCreate) {
      // Check if role exists
      const existing = await queryRunner.query(
        `SELECT id FROM roles WHERE name = $1`,
        [name],
      );

      if (existing.length === 0) {
        await queryRunner.query(`INSERT INTO roles (name) VALUES ($1)`, [name]);
      }
    }
    console.log('Roles seeded successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles`);
  }
}
