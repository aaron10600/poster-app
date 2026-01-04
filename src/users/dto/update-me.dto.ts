
import { IsOptional, IsString } from 'class-validator';

export class UpdateMeDto {
  //USERNAME IS PATCHABLE BY DEFAULT
  @IsOptional()
  @IsString()
  username?: string;

  //ADD HERE THE FIELDS YOU WANT TO BE ABLE TO PATCH
  //DONT ADD PASSWORD, EMAIL, ISVERIFIED AND ROLES
}
