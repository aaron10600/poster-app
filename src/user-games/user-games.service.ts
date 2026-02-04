import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGame } from './entities/user-game.entity';
import { Game } from '../games/entities/game.entity';
import { AddUserGameDto } from './dto/add-user-game.dto';

@Injectable()
export class UserGamesService {
  constructor(
    @InjectRepository(UserGame)
    private userGameRepo: Repository<UserGame>,
    @InjectRepository(Game)
    private gameRepo: Repository<Game>,
  ) {}

  async addGame(userId: string, dto: AddUserGameDto) {
    const game = await this.gameRepo.findOne({ where: { id: dto.gameId } });
    if (!game) throw new Error('Game not found');

    const userGame = this.userGameRepo.create({
      userId,
      game,
      status: dto.status,
      rating: dto.rating,
      review: dto.review,
    });

    return this.userGameRepo.save(userGame);
  }

  async update(userId: string, id: string, dto: Partial<AddUserGameDto>) {
    const ug = await this.userGameRepo.findOne({ where: { id } });
    if (!ug || ug.userId !== userId) throw new ForbiddenException();

    Object.assign(ug, dto);
    return this.userGameRepo.save(ug);
  }

  async list(userId: string) {
    return this.userGameRepo.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }
}
