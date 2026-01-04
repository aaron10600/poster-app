import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { RATE_LIMIT_CONFIG } from './rate-limit.config';
import { RateLimitStorage } from './rate-limit.storage';
import { TooManyRequestsException } from '../common/exceptions/too-many-requests.exception';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly storage: RateLimitStorage) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const method = req.method;
    const path = req.route?.path || req.url;
    const key = `${method} ${path}`;

    const user = req.user;
    const ip = req.ip;

    // 🔑 IDENTIDAD PARA RATE LIMIT
    const identity = user ? `user:${user.sub}` : `ip:${ip}`;

    // 📌 CONFIG POR RUTA / TIPO DE USUARIO
    const config =
      RATE_LIMIT_CONFIG[key] ||
      (user
        ? RATE_LIMIT_CONFIG.DEFAULT_AUTHENTICATED
        : RATE_LIMIT_CONFIG.DEFAULT_PUBLIC);

    const result = this.storage.increment(
      `${identity}:${key}`,
      config.ttl,
    );

    if (result.count > config.limit) {
      throw new TooManyRequestsException(
        'TOO MANY REQUESTS',
      );
    }

    return true;
  }
}
