import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TicketMessage } from './message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketMessage])],
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService, TypeOrmModule],
})
export class MessagesModule {}
