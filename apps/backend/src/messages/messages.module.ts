import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Ticket } from '../tickets/ticket.entity';
import { TicketMessage } from './message.entity';
import { User } from '../users/user.entity';
import { Guest } from '../users/guest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketMessage,Ticket, User, Guest])],
  providers: [MessagesService],
  controllers: [MessagesController],
  exports: [MessagesService, TypeOrmModule],
})
export class MessagesModule {}
