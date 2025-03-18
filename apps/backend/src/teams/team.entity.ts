import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { Agent } from '../agents/agent.entity';
import { Role } from '../roles/role.entity';
import { Ticket } from '../tickets/ticket.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.teams, { nullable: false })
  tenant: Tenant;

  @OneToMany(() => Agent, (agent) => agent.team)
  agents: Agent[];

  @OneToMany(() => Role, (role) => role.tenant) // ✅ Teams can allow specific roles
  allowedRoles: Role[];

  @Column({ nullable: true })
  discordChannelId?: string; // Optional: Discord channel for team communication

  @OneToMany(() => Ticket, (ticket) => ticket.team, { nullable: true }) // Optional: Tickets associated with the team
  tickets: Ticket[]; // Optional: Tickets associated with the team}

  @CreateDateColumn()
  createdAt: Date;
}