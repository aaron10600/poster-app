import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Role } from 'src/roles/entities/role.entity';
import { RolesService } from 'src/roles/roles.service';
import { EmailChangeToken } from './entities/email-change-token.entity';
import { MailService } from 'src/mail/mail.service';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
    imports: [TypeOrmModule.forFeature([User, Role, EmailChangeToken]),TokensModule],
    providers: [UsersService, MailService],
    exports: [UsersService],
})

export class UsersModule {}