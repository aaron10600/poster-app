import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { UserGame } from '../../user-games/entities/user-game.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  externalId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  coverUrl?: string;

  @Column({ type: 'date', nullable: true })
  releaseDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  // 👇 ESTO es lo que te faltaba
  @OneToMany(() => UserGame, (userGame) => userGame.game)
  userGames: UserGame[];
}
