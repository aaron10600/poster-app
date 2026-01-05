import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly tokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}


  //GENERATE SHORT ACCES TOKEN (15MIN)
  async generateAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map(r => r.name),
      isVerified: user.isVerified,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    return accessToken
  }


  //GENERATE LONGER REFRESHTOKEN (7 DAYS)
async generateRefreshToken(user: User): Promise<string> {
  await this.tokenRepository.delete({ user: { id: user.id } });

  const payload = {
    sub: user.id,
    email: user.email,
    username: user.username,
    roles: user.roles.map(r => r.name),
    isVerified: user.isVerified,
  };

  const refreshToken = this.jwtService.sign(payload, {
    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    expiresIn: '7d',
  });

  const tokenHash = await bcrypt.hash(refreshToken, 10);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const tokenEntity = this.tokenRepository.create({
    tokenHash,
    expiresAt,
    user,
  });

  await this.tokenRepository.save(tokenEntity);

  return refreshToken;
}


  async validateRefreshToken(
    refreshToken: string,
    user: User,
  ): Promise<RefreshToken> {
    const tokens = await this.tokenRepository.find({
      where: { user: { id: user.id } },
    });


    //AQUI PILLA CORRECTAMENTE EL REFRESHTOKEN QUE HAY EN LA DB, PERO PONE USER UNDEFINED

    for (const token of tokens) {
      const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);
      if (isMatch) {
        if (token.expiresAt < new Date()) {
          await this.tokenRepository.remove(token);
          throw new UnauthorizedException('REFRESH TOKEN EXPIRED');
        }
        return token;
      }
    }

    throw new UnauthorizedException('INVALID REFRESH TOKEN');
  }

async rotateRefreshToken(user: User): Promise<string> {
  // Borrar todos los tokens antiguos
  await this.tokenRepository.delete({ user: { id: user.id } });

  return this.generateRefreshToken(user);
}


  async decodeToken(token: string) {
    try {
      return this.jwtService.decode(token);
    } catch {
      throw new UnauthorizedException('INVALID TOKEN');
    }
  }


  async revokeAllUserTokens(user: User): Promise<void> {
    await this.tokenRepository.delete({ user: { id: user.id } });
}


}
