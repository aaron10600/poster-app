import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { RefreshToken } from 'src/tokens/entities/refresh-token.entity';
import { EmailChangeToken } from './email-change-token.entity';


@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ default: false })
    isVerified: boolean;

    @ManyToMany(() => Role, (role) => role.users, { eager: true })
    @JoinTable({
        name: 'users_roles',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
    })
    roles: Role[];

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'timestamp', nullable: true })
    deactivatedAt?: Date

    @OneToMany(() => RefreshToken, rt => rt.user)
    refreshTokens: RefreshToken[];

    @OneToMany(() => EmailChangeToken, (token) => token.user)
    emailChangeTokens: EmailChangeToken[];

    //ADD ALL THE USER FIELDS
    //FOR EXAMPLE profilePic, description...

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}