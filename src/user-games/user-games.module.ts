import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGame } from './entities/user-game.entity';
import { UserGamesService } from './user-games.service';
import { UserGamesController } from './user-games.controller';
import { Game } from '../games/entities/game.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserGame, Game]),
  ],
  controllers: [UserGamesController],
  providers: [UserGamesService],
})
export class UserGamesModule {}
