import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Base configuration for TypeORM
const baseConfig: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'nest_template',
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/database/migrations/*.js'],
    migrationsTableName: 'migrations',
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
};

// Export DataSource for TypeORM CLI
export default new DataSource(baseConfig);

// Export configuration function for NestJS
export const typeOrmConfig = (
    configService: ConfigService,
): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.user'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.name'),

    autoLoadEntities: true,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/database/migrations/*.js'],
    migrationsTableName: 'migrations',
    migrationsRun: true,
    synchronize: false,
    logging: configService.get<string>('app.env') === 'development',
});