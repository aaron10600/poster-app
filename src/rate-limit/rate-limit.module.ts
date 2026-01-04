import { Module } from '@nestjs/common';
import { RateLimitGuard } from './rate-limit.guard';
import { RateLimitStorage } from './rate-limit.storage';

@Module({
  providers: [RateLimitGuard, RateLimitStorage],
  exports: [RateLimitGuard, RateLimitStorage],
})
export class RateLimitModule {}
