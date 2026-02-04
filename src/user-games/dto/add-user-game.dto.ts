import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { GameStatus } from '../entities/user-game.entity';

export class AddUserGameDto {
  @IsString()
  gameId: string;

  @IsOptional()
  @IsEnum(GameStatus)
  status?: GameStatus;

  @IsOptional()
  @IsInt()
  rating?: number;

  @IsOptional()
  @IsString()
  review?: string;
}
