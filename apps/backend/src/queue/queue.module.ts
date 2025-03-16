import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}