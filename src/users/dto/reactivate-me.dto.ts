
import { IsString } from 'class-validator';

export class ReactivateMeDto {
  @IsString()
  password: string;
}
