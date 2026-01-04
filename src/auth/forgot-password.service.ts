import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    @InjectRepository(PasswordResetToken)
    private readonly tokenRepository: Repository<PasswordResetToken>
  ) {}

  // ===========================
  // GENERAR TOKEN DE RESET Y ENVIAR MAIL
  // ===========================
  async sendResetPasswordEmail(email: string) {
    const user = await this.usersService.findByEmail(email);

    // RESPUESTA GENÉRICA PARA NO REVELAR SI EL EMAIL EXISTE
    if (!user) return;

    // ELIMINAR TOKENS VIEJOS
    await this.tokenRepository.delete({ user: { id: user.id } });

    // GENERAR TOKEN ALEATORIO
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(token, 10);

    // EXPIRA EN 30 MINUTOS
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    const tokenEntity = this.tokenRepository.create({
      tokenHash,
      expiresAt,
      user,
    });

    await this.tokenRepository.save(tokenEntity);

    // ENVIAR EMAIL CON LINK
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.mailService.sendResetPassword(user.email ,user.email, resetLink);
  }

  // ===========================
  // VALIDAR TOKEN Y CAMBIAR CONTRASEÑA
  // ===========================
  async resetPassword(token: string, newPassword: string) {
    const tokens = await this.tokenRepository.find({
      relations: ['user'],
    });

    // BUSCAR TOKEN QUE COINCIDA
    let validToken: PasswordResetToken | null = null;
    for (const t of tokens) {
      const isMatch = await bcrypt.compare(token, t.tokenHash);
      if (isMatch) {
        validToken = t;
        break;
      }
    }

    if (!validToken) throw new BadRequestException('Invalid or expired token');
    if (validToken.expiresAt < new Date())
      throw new BadRequestException('Token expired');

    // ACTUALIZAR CONTRASEÑA
    const user = validToken.user;
    await this.usersService.updateUserPassword(user, newPassword);

    // ELIMINAR TOKEN
    await this.tokenRepository.remove(validToken);
  }
}
