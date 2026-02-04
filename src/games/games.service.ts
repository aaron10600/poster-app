import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { RawgService } from '../integrations/rawg/rawg.service';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
    private readonly rawgService: RawgService,
  ) {}

  async search(query: string): Promise<Game[]> {
    const results = await this.rawgService.searchGames(query);

    const games: Game[] = [];

    for (const g of results) {
      const externalId = g.id.toString();

      // 1️⃣ Buscar si ya existe en la DB
      let game = await this.gameRepo.findOne({
        where: { externalId },
      });

      // 2️⃣ Si no existe → crear
      if (!game) {
        game = await this.gameRepo.save({
          externalId,
          title: g.name,
          coverUrl: g.background_image ?? undefined,
          releaseDate: g.released ? new Date(g.released) : undefined,
        });
      }

      games.push(game);
    }

    return games;
  }
}
