import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, Unique } from 'typeorm';
import { Game } from '../../games/entities/game.entity';

export enum GameStatus {
  PLAYING = 'PLAYING',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED',
  WISHLIST = 'WISHLIST',
}

@Entity()
@Unique(['userId', 'game'])
export class UserGame {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => Game, (game) => game.userGames, { eager: true })
  game: Game;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.WISHLIST,
  })
  status: GameStatus;

  @Column({ type: 'int', nullable: true })
  rating: number;

  @Column({ type: 'text', nullable: true })
  review: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
