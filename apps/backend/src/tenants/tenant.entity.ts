import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Ticket } from '../tickets/ticket.entity';
import { Team } from '../teams/team.entity';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // Business name or identifier

  @Column({ nullable: true })
  discordServerId?: string; // Discord server linked to this tenant

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Ticket, (ticket) => ticket.tenant)
  tickets: Ticket[];
  
  @OneToMany(() => Team, (team) => team.tenant)
  teams: Team[];

  @CreateDateColumn()
  createdAt: Date;
}