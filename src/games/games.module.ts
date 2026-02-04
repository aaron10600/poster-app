import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { RawgModule } from '../integrations/rawg/rawg.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    RawgModule, // 👈 para usar RawgService
  ],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService, TypeOrmModule], // 👈 opcional pero útil
})
export class GamesModule {}
