import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, ManyToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Team } from '../teams/team.entity';
import { Role } from '../roles/role.entity';
import { Agent } from '../agents/agent.entity';
import { Ticket } from 'src/tickets/ticket.entity';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // Organization name

  @ManyToOne(() => User, (user) => user.tenants, { nullable: false }) // Each tenant has an owner
  owner: User;

  @OneToMany(() => Team, (team) => team.tenant)
  teams: Team[];

  @OneToMany(() => Role, (role) => role.tenant) // ✅ A tenant has multiple roles
  roles: Role[];

  @ManyToMany(() => Agent, (agent) => agent.tenants) // ✅ Many-to-Many: Tenants can have multiple agents
  agents: Agent[];

  @OneToMany(() => Ticket, (ticket) => ticket.tenant) // ✅ A tenant can have multiple tickets
  tickets: Ticket[];

  @Column({ nullable: true })
  discordServerId?: string; // ✅ Single Discord server per tenant

  @CreateDateColumn()
  createdAt: Date;
}