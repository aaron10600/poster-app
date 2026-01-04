import { IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({ example: 'token-sent-via-email' })
    @IsString()
    token: string;  

    @ApiProperty({ example: 'NewPassword123!' })
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
    'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter and a number',
    })
    newPassword: string;
}
