// src/users/users-cron.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UsersService } from './users.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersCronService {
  private readonly logger = new Logger(UsersCronService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  //EVERYDAY AT MIDNIGHT
  @Cron('0 0 * * *') 
  async handleDeactivatedUsers() {
    const today = new Date();

    //WARN ACCOUNTS THAT ARE NOT REACTIVATED WITHIN 29 DAYS
    const warningDate = new Date(today);
    warningDate.setDate(today.getDate() - 29);

    const usersToWarn = await this.usersService.findDeactivatedBefore(warningDate);
    for (const user of usersToWarn) {
      this.logger.log(`SENDING DELETION WARNING TO ${user.email}`);
        await this.mailService.sendDeletionWarning(user.email);
    }

    //DELETE ACCOUNTS THAT ARE NOT REACTIVATED WITHIN 30 DAYS
    const deletionDate = new Date(today);
    deletionDate.setDate(today.getDate() - 30);

    const usersToDelete = await this.usersService.findDeactivatedBefore(deletionDate);
    for (const user of usersToDelete) {
      this.logger.log(`DELETING USER ${user.email}`);
      await this.usersService.deleteUserById(user.id);
    }
  }
}
