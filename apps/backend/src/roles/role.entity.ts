import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { Agent } from '../agents/agent.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // ✅ Example: "Tech Support", "Billing Support"

  @Column({ unique: true })
  discordRoleId: string; // ✅ Store Discord role ID created by the bot

  @ManyToOne(() => Tenant, (tenant) => tenant.roles, { nullable: false }) // ✅ Roles belong to a Tenant
  tenant: Tenant;

  @OneToMany(() => Agent, (agent) => agent.roles) // ✅ Multiple agents can share the same role
  agents: Agent[];

  @CreateDateColumn()
  createdAt: Date;
}