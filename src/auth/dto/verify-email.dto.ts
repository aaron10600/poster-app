import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
      example: 'email-to-verify@example.com',
      description: 'Email of the user that is going to be verified',
    })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'code-sent-via-email',
    description: 'Verification code',
  })
  @IsString()
  @Length(36, 36, { message: 'Código inválido' })
  code: string; 
}
