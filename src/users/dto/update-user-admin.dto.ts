import { IsBoolean, IsOptional, IsArray, IsString, ArrayNotEmpty } from 'class-validator';

export class UpdateUserAdminDto {
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  roles?: string[]; 
}
