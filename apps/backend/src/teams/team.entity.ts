import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { Ticket } from '../tickets/ticket.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Team name (e.g., "Billing Support", "Technical Support")

  @ManyToOne(() => Tenant, (tenant) => tenant.teams, { nullable: false })
  tenant: Tenant;

  @OneToMany(() => Ticket, (ticket) => ticket.team)
  tickets: Ticket[];

  @CreateDateColumn()
  createdAt: Date;
}