
import { IsString } from 'class-validator';

export class DeactivateMeDto {
  @IsString()
  password: string;
}
