
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'refresh_token',
    description: 'Refresh token of the user',
  })
  refreshToken: string;
}
