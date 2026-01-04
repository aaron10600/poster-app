import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly telegramService: TelegramService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user || null;
    const ip = req.ip;
    const path = req.route?.path || req.url;
    const method = req.method;
    const timestamp = new Date().toISOString();

    return next.handle().pipe(
      tap(() => {
        //SENSIBLE ROUTES TO LOG
        const sensitiveRoutes = [
          '/auth/login',
          '/auth/register',
          '/auth/forgot-password',
          '/auth/reset-password',
          '/users/me',
          '/users/me/deactivate'
        ];

        if (!sensitiveRoutes.includes(path)) return;

        //LOG THEM ON TELEGRAM FOR NOW, CHANGE THIS TO AN ACTUAL LOGGER LATER
        let eventTitle = 'ACTION';
        switch (path) {
          case '/auth/login':
            eventTitle = 'LOGIN';
            break;
          case '/auth/register':
            eventTitle = 'USER REGISTRATION';
            break;
          case '/auth/forgot-password':
            eventTitle = 'FORGOT PASSWORD';
            break;
          case '/auth/reset-password':
            eventTitle = 'RESET PASSWORD';
            break;
          case '/users/me':
            eventTitle = 'GET OWN PROFILE';
            break
          case 'users/deactivate':
            eventTitle = 'DEACTIVATE OWN ACCOUNT'
        }

        
        const message = `
    🔔 ${eventTitle} EVENT
    User: ${user?.sub || 'GUEST'}
    Path: ${path}
    Method: ${method}
    IP: ${ip}
    Timestamp: ${timestamp}
        `;

        this.telegramService.sendMessage(message.trim());
      }),
    );
  }
}
