import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn, ManyToMany, JoinTable, OneToOne, OneToMany } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { User } from '../users/user.entity';
import { Guest } from '../users/guest.entity';
import { Team } from '../teams/team.entity';
import { TicketMessage } from '../messages/message.entity';


@Entity()
export class Ticket {
  // identifiers 
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Guest, (guest) => guest.ticket, { nullable: true}) // If ticket is deleted, remove the guest reference
  guest?: Guest;

  @ManyToOne(() => User, { nullable: true }) // Stores the requester's user ID if registered
  requester?: User | null; // Updated to allow null

  @Column({ nullable: true }) // Stores the requester's email if unregistered
  requesterEmail?: string;

  @Column({ nullable: true }) // Stores the requester's name if available
  requesterName?: string;

  @Column({ type: 'enum', enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' })
  status: 'open' | 'in_progress' | 'resolved' | 'closed';

  // associations

  @ManyToOne(() => Tenant, (tenant) => tenant.tickets, { nullable: false })
  tenant: Tenant;

  @ManyToOne(() => Team, (team) => team.tickets, { nullable: false })
  team: Team; 

  @ManyToMany(() => User) // Allows multiple agents to be associated with a ticket
  @JoinTable()
  assignedAgents: User[];

  // ticket body
  @Column()
  title: string;

  @Column('text')
  description: string;

  @OneToMany(() => TicketMessage, (message) => message.ticket, { cascade: true, onDelete: 'CASCADE' }) 
  messages: TicketMessage[];

  // timestamps
  @ManyToOne(() => User, { nullable: true }) // Tracks who closed the ticket (agent or user)
  closedBy?: User;

  @Column({ type: 'boolean', default: false }) // Determines if ticket auto-closes after time
  autoClose: boolean;

  @Column({ type: 'enum', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' })
  priority: 'low' | 'medium' | 'high' | 'critical';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Tracking fields
  @Column({ type: 'enum', enum: ['email', 'web_form', 'chatbot', 'api', 'discord'], default: 'web_form' })
  source: 'email' | 'web_form' | 'chatbot' | 'api' | 'discord';

}