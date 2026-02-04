import { IsString } from 'class-validator';

export class SearchGameDto {
  @IsString()
  query: string;
}
