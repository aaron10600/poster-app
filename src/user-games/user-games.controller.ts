import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UserGamesService } from './user-games.service';
import { AddUserGameDto } from './dto/add-user-game.dto';
import { UpdateUserGameDto } from './dto/update-user-game.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


@Controller('user-games')
@UseGuards(JwtAuthGuard)
export class UserGamesController {
  constructor(private readonly userGamesService: UserGamesService) {}

  @Post()
  add(@Req() req, @Body() dto: AddUserGameDto) {
    return this.userGamesService.addGame(req.user.id, dto);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateUserGameDto) {
    return this.userGamesService.update(req.user.id, id, dto);
  }

  @Get()
  list(@Req() req) {
    return this.userGamesService.list(req.user.id);
  }
}
