import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('email_change_tokens')
export class EmailChangeToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tokenHash: string;

  @Column()
  newEmail: string;

  @Column()
  expiresAt: Date;

 @ManyToOne(() => User, (user) => user.emailChangeTokens, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
