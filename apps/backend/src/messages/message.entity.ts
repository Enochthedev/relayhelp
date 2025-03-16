import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, DeleteDateColumn} from 'typeorm';
import { Ticket } from '../tickets/ticket.entity';
import { User } from '../users/user.entity';
import { Guest } from '../users/guest.entity';

@Entity()
export class TicketMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.messages, { onDelete: 'CASCADE' })
  ticket: Ticket;

  @ManyToOne(() => User, { nullable: true }) // If the sender is a registered user
  sender?: User;

  @ManyToOne(() => Guest, { nullable: true }) // If the sender is a guest
  guestSender?: Guest;

  @Column({ type: 'enum', enum: ['user', 'agent', 'guest', 'system'], default: 'user' })
  senderType: 'user' | 'agent' | 'guest' | 'system'; // Helps categorize message origin

  @Column('text')
  message: string;

  @Column({ nullable: true })
  attachmentUrl?: string; // For file attachments

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ nullable: true }) 
  deletedAt?: Date;

  @Column({ nullable: true })
  systemMessageType?: string; // For system messages
}