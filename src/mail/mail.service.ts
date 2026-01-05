import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { deletionWarningMail, emailChangeMail, forgotPasswordMail, verificationMail } from './mail-templates';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;
  private logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'), 
      port: this.configService.get<number>('MAIL_PORT'), 
      secure: false, // IMPORTANTE para Brevo
      auth: {
        user: this.configService.get<string>('MAIL_USER'), 
        pass: this.configService.get<string>('MAIL_KEY'), 
      },
    });
  }

  //VERIFY IF SMTP (BREVO, PROBABLY) CONNECTS OR NOT
  async onModuleInit() { 
    if (this.configService.get<string>('NODE_ENV') !== 'development') {
      try {
        await this.transporter.verify();
        this.logger.log('SMTP CONNECTED');
      } catch (error) {
        this.logger.error('ERROR CONNECTING TO SMTP', error);
      }
    }
  }

  //CUSTOM FUNCTION TO SEND MAILS
  async sendMail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string,
  ) {
    const mailOptions = {
      from: `"${this.configService.get<string>('MAIL_FROM_NAME')}" <${this.configService.get<string>('MAIL_FROM')}>`,
      to,
      subject,
      html: htmlContent,
      text: textContent || htmlContent.replace(/<[^>]+>/g, ''),
    };

    //JUST FOR DEV
    if (process.env.NODE_ENV === 'development') {
      this.logger.log(`[DEV] EMAIL MOCK → To: ${to}, Subject: ${subject}`);
      this.logger.debug(htmlContent);
      return;
    }

    const response = await this.transporter.sendMail(mailOptions);

    this.logger.log(`EMAIL SENT TO ${to} (${response.messageId})`);
    return response;
  }

  //FUNCTION TO SEND EMAIL TO VERIFY ACCOUNT
  async sendVerification(to: string, code: string) {
    const appUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';

    //CHANGE THIS TO CUSTOM HTML TEMPLATES
    const html = verificationMail(code, appUrl, to);

    await this.sendMail(to, 'Verify your account', html);
  }


  //FUNCTION TO SEND MAIL TO WARN THE USER ABOUT THEIR ACCOUNT DELETION
  async sendDeletionWarning(to: string) {
    const appUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';

    //CHANGE THIS TO CUSTOM HTML TEMPLATES
    const html = deletionWarningMail(appUrl);

    await this.sendMail(to, 'Your account is about to be deleted', html);
  }


  async sendResetPassword(to: string ,email: string, resetLink: string) {
    const html = forgotPasswordMail(resetLink);

    await this.sendMail(to, 'Your reset password code', html);
  }

  async sendEmailChangeConfirmation(email: string, token: string) {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      'http://localhost:3000';

    const confirmLink = `${frontendUrl}/confirm-email?token=${token}`;

    const html = emailChangeMail(confirmLink, email);

    await this.sendMail(
      email,
      'Confirm your new email address',
      html,
    );
  }



}
