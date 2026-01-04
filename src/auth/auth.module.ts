import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { TokensModule } from '../tokens/tokens.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailVerificationService } from './email-verification.service';
import { EmailVerification } from './entities/email-verification.entity';
import { MailService } from 'src/mail/mail.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { ForgotPasswordService } from './forgot-password.service';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    TokensModule, 
    TypeOrmModule.forFeature([EmailVerification, PasswordResetToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: config.get('JWT_ACCESS_EXPIRES') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailVerificationService,
    MailService,
    JwtStrategy,
    ForgotPasswordService
  ],
  exports: [AuthService, EmailVerificationService, ForgotPasswordService],
})
export class AuthModule {}
