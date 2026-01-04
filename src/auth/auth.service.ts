import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { ConfigService } from '@nestjs/config';
import { EmailVerificationService } from './email-verification.service';
import { MailService } from 'src/mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokensService: TokensService,
  ) {}

  async register(dto: RegisterDto) {
    //CHECK IF A USER WITH THIS USERNAME OR EMAIL ALREADY EXISTS
    const existingUser = await this.usersService.checkAvailability(
      dto.email,
      dto.username,
    );
    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new BadRequestException('A USER WITH THIS EMAIL ALREADY EXISTS');
      }
      if (existingUser.username === dto.username) {
        throw new BadRequestException(
          'A USER WITH THIS USERNAME ALREADY EXISTS',
        );
      }
    }

    //IF THERE ARE ROLES ON THE DTO PUSH THEM
    const roles: Role[] = [];

    if (dto.roles && dto.roles.length > 0) {
      for (const name of dto.roles) {
        const role = await this.rolesService.findByName(name);
        if (role) roles.push(role);
      }
    } else {
      //IF NO ROLES ARE ON THE DTO, SET IT TO 'USER' ROLE
      const defaultRole = await this.rolesService.findByName('USER');
      if (defaultRole) roles.push(defaultRole);
    }

    //CREATE THE USER
    const user = await this.usersService.createUser(
      dto.username,
      dto.email,
      dto.password,
      roles,
    );

    //GENERATE A VERIFICATION CODE
    const code = await this.emailVerificationService.createCode(user);

    //SEND THE EMAIL WITH THE VERIFICATION CODE
    await this.mailService.sendVerification(user.email, code);

    return { message: 'USER CREATED, CHECK YOUR EMAIL TO VERIFY YOUR ACCOUNT' };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    //FIND THE USER BY THE EMAIL
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new BadRequestException('USER NOT FOUND');

    //VERIFY IF THE CODE SENT MATCHES THE HASHED CODE ON THE DB
    const verified = await this.emailVerificationService.verifyCode(
      user,
      dto.code,
    );
    if (!verified) throw new BadRequestException('INVALID OR EXPIRED CODE');

    //SET THE USER TO VERIFIED
    user.isVerified = true;
    await this.usersService.updateUser(user);

    return { message: 'EMAIL SUCCESFULLY VERIFIED' };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findUserByEmailOrUsername(
      dto.emailOrUsername,
    );

    if (!user) {
      throw new BadRequestException(
        'USER WITH THIS EMAIL OR USERNAME DOES NOT EXIST',
      );
    }

    if (!user.isActive) {
      throw new BadRequestException('THIS USER ACCOUNT IS DEACTIVATED');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new BadRequestException('INCORRECT PASSWORD');
    }

    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
    };
  }

  //GENERATE ACCES AND REFRESH TOKENS
  private async generateTokens(user: User) {
    const accessToken = await this.tokensService.generateAccessToken(user);

    const refreshToken = await this.tokensService.generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('INVALID OR EXPIRED REFRESH TOKEN');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) throw new UnauthorizedException('USER NOT FOUND');

    // 3️⃣ Validar refresh token en DB
    await this.tokensService.validateRefreshToken(refreshToken, user);

    // 4️⃣ Rotar token eliminando los anteriores y creando uno nuevo
    const newRefreshToken = await this.tokensService.rotateRefreshToken(user);

    // 5️⃣ Generar nuevo access token
    const accessToken = await this.tokensService.generateAccessToken(user);

    return { accessToken, refreshToken: newRefreshToken };
  }
}
