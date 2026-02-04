import { Controller, Get, Query } from '@nestjs/common';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('search')
  search(@Query('q') q: string) {
    return this.gamesService.search(q);
  }
}
