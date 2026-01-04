import { Injectable } from '@nestjs/common';

interface RateLimitEntry {
  count: number;
  expiresAt: number;
}

@Injectable()
export class RateLimitStorage {
  private store = new Map<string, RateLimitEntry>();

  increment(key: string, ttl: number): { count: number; remaining: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || entry.expiresAt < now) {
      this.store.set(key, {
        count: 1,
        expiresAt: now + ttl * 1000,
      });
      return { count: 1, remaining: 0 };
    }

    entry.count += 1;
    return {
      count: entry.count,
      remaining: Math.max(0, entry.expiresAt - now),
    };
  }
}
