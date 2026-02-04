import { Module } from '@nestjs/common';
import { RawgService } from './rawg.service';

@Module({
  providers: [RawgService],
  exports: [RawgService], // 👈 importante para usarlo en otros módulos
})
export class RawgModule {}
