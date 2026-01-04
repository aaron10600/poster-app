import { IsEmail, IsNotEmpty, IsString, Matches, ArrayNotEmpty, ArrayUnique, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the user',
  })
  username: string;

  @IsEmail()
  @ApiProperty({
    example: 'john_doe@example.com',
    description: 'Email of the user',
  })
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter and a number',
  })
  @ApiProperty({
    example: 'Password123!',
    description: 'Password of the user',
  })
  password: string;

  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  roles?: string[]; // ['USER', 'SUPERADMIN'] etc.
}
