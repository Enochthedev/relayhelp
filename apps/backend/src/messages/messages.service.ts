import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketMessage } from './message.entity';
import { CreateMessageDto } from './dto/message.dto';
import { Ticket } from '../tickets/ticket.entity';
import { User } from '../users/user.entity';
import { Guest } from '../users/guest.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(TicketMessage)
    private readonly messageRepository: Repository<TicketMessage>,
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
  ) {}

  // Send a message (supports text, images, voice notes, videos)
  async sendMessage(data: CreateMessageDto): Promise<TicketMessage> {
    const ticket = await this.ticketRepository.findOne({ where: { id: data.ticketId } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    let sender: User | undefined = undefined;
    let guestSender: Guest | undefined = undefined;

    if (data.senderType === 'user' || data.senderType === 'agent') {
      sender = (await this.userRepository.findOne({ where: { id: data.senderId } })) ?? undefined;
      if (!sender) throw new NotFoundException('User not found');
    } else if (data.senderType === 'guest') {
      guestSender = (await this.guestRepository.findOne({ where: { id: data.senderId } })) ?? undefined;
      if (!guestSender) throw new NotFoundException('Guest not found');
    }

    if (!data.content) throw new NotFoundException('Message content is required');

    const message = this.messageRepository.create({
      ticket,
      sender,
      guestSender,
      senderType: data.senderType,
      message: data.content,
      attachmentUrl: data.attachmentUrl,
      systemMessageType: data.systemMessageType,
    });

    return await this.messageRepository.save(message);
  }

  // Reference a message and respond (threaded responses)
  async referenceMessageAndRespond(referenceMessageId: string, data: CreateMessageDto): Promise<TicketMessage> {
    const referencedMessage = await this.messageRepository.findOne({ where: { id: referenceMessageId } });
    if (!referencedMessage) throw new NotFoundException('Referenced message not found');

    const ticket = await this.ticketRepository.findOne({ where: { id: data.ticketId } });
    if (!ticket) throw new NotFoundException('Ticket not found');

    let sender: User | undefined = undefined;
    let guestSender: Guest | undefined = undefined;

    if (data.senderType === 'user' || data.senderType === 'agent') {
      sender = (await this.userRepository.findOne({ where: { id: data.senderId } })) ?? undefined;
      if (!sender) throw new NotFoundException('User not found');
    } else if (data.senderType === 'guest') {
      guestSender = (await this.guestRepository.findOne({ where: { id: data.senderId } })) ?? undefined;
      if (!guestSender) throw new NotFoundException('Guest not found');
    }

    if (!data.content) throw new NotFoundException('Message content is required');

    const message = this.messageRepository.create({
      ticket,
      sender,
      guestSender,
      senderType: data.senderType,
      message: `Re: ${referencedMessage.message}\n\n${data.content}`,
      attachmentUrl: data.attachmentUrl,
      systemMessageType: data.systemMessageType,
    });

    return await this.messageRepository.save(message);
  }

  // Retrieve messages by ticket
  async getMessagesByTicket(ticketId: string): Promise<TicketMessage[]> {
    return await this.messageRepository.find({
      where: { ticket: { id: ticketId } },
      relations: ['ticket', 'sender', 'guestSender'],
    });
  }

  // Delete a message (soft delete)
  async deleteMessage(messageId: string): Promise<void> {
    const message = await this.messageRepository.findOne({ where: { id: messageId } });
    if (!message) throw new NotFoundException('Message not found');

    await this.messageRepository.softRemove(message);
  }
}
