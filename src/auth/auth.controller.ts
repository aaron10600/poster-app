import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly forgotPasswordService: ForgotPasswordService
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }


  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    if (!dto.refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.forgotPasswordService.sendResetPasswordEmail(dto.email);
    return { message: 'IF THE EMAIL EXISTS, A RESET CODE HAS BEEN SENT' };
  }

   @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() dto: ResetPasswordDto) {
      await this.forgotPasswordService.resetPassword(dto.token, dto.newPassword);
      return { message: 'Password successfully updated' };
    }

    //AÑADIR ENDPOINT DE LOGOUT QUE SE CARGE LOS REFRESH TOKEN DEL USUARIO (LOS REGISTROS DEL REFRESH TOKEN REPO)

}
