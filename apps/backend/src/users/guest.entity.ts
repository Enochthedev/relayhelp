import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';
import { Ticket } from '../tickets/ticket.entity';

@Entity()
export class Guest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) // Ensures each guest is tied to a unique email
  email: string;

  @Column({ nullable: true }) // Optional name tracking
  name?: string;

  @Column({ nullable: true }) // Optional: Can be used for tracking guest sessions
  sessionId?: string;

  @OneToOne(() => Ticket, (ticket) => ticket.guest, { onDelete: 'CASCADE' }) 
  ticket?: Ticket; // One-to-one: Each guest can only have ONE open ticket

  @CreateDateColumn()
  createdAt: Date;
}