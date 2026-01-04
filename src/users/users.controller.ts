import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';

import { UpdateMeDto } from './dto/update-me.dto';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VerifiedGuard } from '../auth/guards/verified.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { ChangePasswordDto } from './dto/change-password-dto';
import { DeactivateMeDto } from './dto/deactivate-me.dto';
import { ChangeEmailDto } from './dto/change-email.dto';
import { ConfirmEmailChangeDto } from './dto/confirm-email-change.dto';


//ALL THE ENDPOINTS REQUIRE JWT AND A USER THAT IS ACTIVE, SO WE USE JWTAUTHGUARD HERE
@Controller('users')
@UseGuards(JwtAuthGuard) 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //GET THE USER ON THE JWT
  @Get('me')
  getMe(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  //PATCH THE USER ON THE JWT
  @Patch('me')
  @UseGuards(VerifiedGuard)
  updateMe(@Request() req, @Body() body: UpdateMeDto) {
    return this.usersService.updateMe(req.user.id, body);
  }

  //CHANGE OWN PASSWORD
  @Patch('me/password')
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  changeMyPassword(
    @Request() req,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      req.user.id,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @Post('me/email')
  @UseGuards(VerifiedGuard)
  requestEmailChange(
    @Request() req,
    @Body() dto: ChangeEmailDto,
  ) {
    return this.usersService.requestEmailChange(req.user, dto);
  }

  @Post('me/email/confirm')
  confirmEmailChange(@Body() dto: ConfirmEmailChangeDto) {
    return this.usersService.confirmEmailChange(dto.token);
  }



  @Patch('me/deactivate')
  @UseGuards(JwtAuthGuard, VerifiedGuard)
  async deactivateMe(@Request() req, @Body() dto: DeactivateMeDto) {
    return this.usersService.deactivateUser(req.user.id, dto.password)
  }

  //ONLY SUPERADMIN CAN GET ALL USERS
  @Get()
  @UseGuards(RolesGuard)
  @Roles('WAITER')
  findAll() {
    return this.usersService.findAll();
  }

  //SUPERADMIN CAN EDIT ISVERIFIED AND ROLES OF ANY OTHER USER
  @Patch(':id/admin')
  @UseGuards(JwtAuthGuard, VerifiedGuard, RolesGuard)
  @Roles('SUPERADMIN')
  updateUserAsAdmin(
    @Param('id') userId: string,
    @Body() dto: UpdateUserAdminDto,
  ) {
    return this.usersService.updateUserAsAdmin(userId, dto);
  }


  //IMPLEMENT REACTIVATE ACCOUNT


}
