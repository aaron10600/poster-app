import { PartialType } from '@nestjs/mapped-types';
import { AddUserGameDto } from './add-user-game.dto';

export class UpdateUserGameDto extends PartialType(AddUserGameDto) {}
