import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private botToken?: string;
  private chatId?: string;

  constructor(private configService: ConfigService) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
  }

async sendMessage(payload: string | object) {
  if (!this.botToken || !this.chatId) {
    Logger.warn('TELEGRAM NOT CONFIGURED');
    return;
  }

  const text =
    typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);

  try {
    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    await axios.post(url, {
      chat_id: this.chatId,
      text,
    });
  } catch (err) {
    Logger.error('Error enviando mensaje a Telegram', err);
  }
}

}
