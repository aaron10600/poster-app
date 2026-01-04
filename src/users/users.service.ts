import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LessThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/roles/entities/role.entity';
import { UpdateMeDto } from './dto/update-me.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { EmailChangeToken } from './entities/email-change-token.entity';
import { ChangeEmailDto } from './dto/change-email.dto';
import { MailService } from 'src/mail/mail.service';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(EmailChangeToken)
    private readonly emailTokenRepository: Repository<EmailChangeToken>,

    private readonly mailService: MailService,
    private readonly tokensService: TokensService
  ) {}


  async findAll(): Promise<User[]> {
    return this.userRepository.find()
  }


  async findById(id: string): Promise<User| null> {
    return this.userRepository.findOne({
      where: {id},
      relations: ['roles']
    })
  }

  async updateMe(
    userId: string,
    updateUserDto: UpdateMeDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    //MERGE ONLY FIELDS ALLOWED BY THE DTO
    const updatedUser = this.userRepository.merge(user, updateUserDto);

    return this.userRepository.save(updatedUser);
  }


  //FUNCTION TO FIND A USER BY EITHER THE EMAIL OR THE USERNAME, THIS IS USED WHEN REGISTERING TO SEE IF EITHER OF THOSE IS ALREADY IN USE
  async checkAvailability(email: string, username: string) {
    return this.userRepository.findOne({
      where: [{ email }, { username }],
      relations: ['roles']
    });
  }

  //FIND USER BY USERNAME OR EMAIL
  async findUserByEmailOrUsername(emailOrUsername: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .addSelect('user.password') // 👈 FORZAMOS password
      .where('user.email = :value', { value: emailOrUsername })
      .orWhere('user.username = :value', { value: emailOrUsername })
      .getOne();
  }


  async createUser(username:string ,email: string, plainPassword: string, roles: Role[]){
    const hashed = await bcrypt.hash(plainPassword, 12);
    const user = this.userRepository.create({
        username,
        email,
        password: hashed,
        roles
    });
    return this.userRepository.save(user);
  }

  async updateUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }


  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateUserAsAdmin(
    userId: string,
    dto: UpdateUserAdminDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('USER NOT FOUND');
    }

    if (dto.isVerified !== undefined) {
      user.isVerified = dto.isVerified;
    }

    if (dto.roles) {
      const roles = await this.roleRepository.find({
        where: dto.roles.map(name => ({ name })),
      });

      user.roles = roles;
    }

    return this.userRepository.save(user);
  }

  //CHANGE PASSWORD IF YOU KNOW THE CURRENT PASSWORD
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password']
    });

    if (!user){
      throw new BadRequestException('USER NOT FOUND TO CHANGE PASSWORD')
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid){
      throw new BadRequestException('CURRENT PASSWORD IS INCORRECT')
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      throw new BadRequestException('NEW PASSWORD MUST BE DIFFERENT')
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    user.password = hashed;

    await this.userRepository.save(user);

    return {
      message: 'PASSWORD UPDATED SUCCESSFULLY'
    }
  }

  //CHANGE PASSWORD IF USER FORGOT IT
  async updateUserPassword(user: User, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    return this.userRepository.save(user);
  }


  async deactivateUser(userId: string, plainPassword: string):Promise<{ message: string }>{
    console.log(plainPassword)
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password', 'isActive', 'email'] 
    });


    if (!user) {
    throw new NotFoundException('User not found');
  }

    const passwordValid = await bcrypt.compare(plainPassword, user.password);
    if (!passwordValid) {
      throw new BadRequestException('PASSWORD IS INCORRECT');
    }

    user.isActive = false;
    user.deactivatedAt = new Date()
    await this.userRepository.save(user);

    return { message: 'USER ACCOUNT HAS BEEN DEACTIVATED'}
  }

  //CHECK IF AN ACCOUNT SHOULD BE DELETED ON THE CRONJOB
  async findDeactivatedBefore(date: Date) {
    return this.userRepository.find({
      where: {
        isActive: false,
        deactivatedAt: LessThanOrEqual(date),
      },
    });
  }

  async deleteUserById(userId: string) {
    return this.userRepository.delete({ id: userId });
  }

async requestEmailChange(user: User, dto: ChangeEmailDto) {
  // Traer el usuario con password
  const userWithPassword = await this.userRepository.findOne({
    where: { id: user.id },
    select: ['id', 'password', 'email', 'isVerified'],
  });

  if (!userWithPassword) {
    throw new NotFoundException('User not found');
  }

  const passwordValid = await bcrypt.compare(dto.password, userWithPassword.password);

  if (!passwordValid) {
    throw new UnauthorizedException('INVALID PASSWORD');
  }

  const emailInUse = await this.userRepository.findOne({
    where: { email: dto.newEmail },
  });

  if (emailInUse) {
    throw new BadRequestException('EMAIL ALREADY IN USE');
  }

  await this.emailTokenRepository.delete({ user: { id: user.id } });

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = await bcrypt.hash(token, 10);

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 30);

  const entity = this.emailTokenRepository.create({
    tokenHash,
    newEmail: dto.newEmail,
    expiresAt,
    user: userWithPassword,
  });

  await this.emailTokenRepository.save(entity);

  await this.mailService.sendEmailChangeConfirmation(dto.newEmail, token);

  return {
    message: 'CONFIRMATION EMAIL SENT TO NEW ADDRESS',
  };
}


async confirmEmailChange(token: string) {
    const tokens = await this.emailTokenRepository.find({
      relations: ['user'],
    });

    const validToken = await this.findValidToken(tokens, token);

    if (!validToken) {
      throw new BadRequestException('INVALID OR EXPIRED TOKEN');
    }

    const user = validToken.user;

    user.email = validToken.newEmail;
    user.isVerified = true;

    await this.userRepository.save(user);
    await this.emailTokenRepository.remove(validToken);

    // 🔒 SECURITY: revoke sessions
    await this.tokensService.revokeAllUserTokens(user);

    return { message: 'EMAIL UPDATED SUCCESSFULLY' };
  }

  private async findValidToken(
    tokens: EmailChangeToken[],
    rawToken: string,
  ) {
    for (const token of tokens) {
      const match = await bcrypt.compare(rawToken, token.tokenHash);
      if (match && token.expiresAt > new Date()) {
        return token;
      }
    }
    return null;
  }
}
