import { Injectable, Logger } from '@nestjs/common';
import { HealthCheckService, TypeOrmHealthIndicator, HealthCheck } from '@nestjs/terminus';
import { Cron } from '@nestjs/schedule';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private telegramService: TelegramService,
  ) {}

  // Health check para endpoint
  @HealthCheck()
  async check() {
    return this.health.check([
      async () => this.db.pingCheck('database', { timeout: 300 }),
      //WE CAN ADD MORE CHECKS
    ]);
  }

  //EVERY 15 MIN
  @Cron('*/1440 * * * *')
  async notifyStatus() {
    try {
      const result = await this.check();
      const statusMessage = result.status === 'ok'
        ? '✅ API OK'
        : '⚠️ API PROBLEMS';

      const message = `
🩺 Health Check
Status: ${statusMessage}
Timestamp: ${new Date().toLocaleString()}
Details: ${JSON.stringify(result, null, 2)}
      `;

      await this.telegramService.sendMessage(message);
    } catch (err) {
      const message = `
🛑 Health Check FAILED
Timestamp: ${new Date().toLocaleString()}
Error: ${err.message || err}
      `;
      await this.telegramService.sendMessage(message);
    }
  }
}
