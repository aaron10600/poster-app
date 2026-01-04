import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { RefreshToken } from './entities/refresh-token.entity';
import { TokensService } from './tokens.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_REFRESH_SECRET'),
        signOptions: { expiresIn: config.get('JWT_REFRESH_EXPIRES') },
      }),
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [TokensService],
  exports: [TokensService], // exportarlo para otros módulos
})
export class TokensModule {}
