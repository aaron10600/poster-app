import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegramService } from 'src/telegram/telegram.service';

@Module({
  imports: [
    TerminusModule,
    TypeOrmModule,
    ConfigModule,
    ScheduleModule.forRoot(), // necesario para tareas programadas
  ],
  controllers: [HealthController],
  providers: [HealthService, TelegramService],
})
export class HealthModule {}
