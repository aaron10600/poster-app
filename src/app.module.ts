import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { typeOrmConfig } from './database/typeorm.config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';

import { TestController } from './test-controllers/test.controller';
import { UsersController } from './users/users.controller';
import { RateLimitGuard } from './rate-limit/rate-limit.guard';
import { RateLimitModule } from './rate-limit/rate-limit.module';
import { TelegramModule } from './telegram/telegram.module';
import { TelegramService } from './telegram/telegram.service';
import { HealthModule } from './health/health.module';
import { PostsModule } from './post/posts.module';
import { DeployController } from './deploy-test/deploy.controller';
import { DeployModule } from './deploy-test/deploy.module';
import { RawgModule } from './integrations/rawg/rawg.module';
import { GamesModule } from './games/games.module';
import { UserGamesModule } from './user-games/user-games.module';
import { GamesController } from './games/games.controller';
import { UserGamesController } from './user-games/user-games.controller';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),

    ScheduleModule.forRoot(),

    
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,    
          limit: 100,  //100 REQUESTS PER MINUTE
        },
        {
          ttl: 1000,
          limit: 10 //10 REQUESTS PER SECOND
        }
      ],
    }),

    AuthModule,
    UsersModule,
    RolesModule,
    RateLimitModule,
    TelegramModule,
    HealthModule, 
    PostsModule,
    DeployModule,
    RawgModule,
    GamesModule,
    UserGamesModule,
    
  ],

  controllers: [TestController, UsersController, DeployController, GamesController, UserGamesController],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard
    },

    
  ],
})
export class AppModule {}
