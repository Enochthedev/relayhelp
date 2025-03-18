import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinTable, ManyToMany} from 'typeorm';
import { Team } from '../teams/team.entity';
import { Tenant } from '../tenants/tenant.entity';
import { Role } from '../roles/role.entity';

@Entity()
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  discordId: string;

  @Column()
  discordUsername: string;

  @Column({ default: false })
  isActive: boolean; 

  @Column({ nullable: true })
  assignedRole?: string; 

  @ManyToMany(() => Tenant, (tenant) => tenant.agents) // ✅ Many-to-Many: Agents can work for multiple tenants
  @JoinTable()
  tenants: Tenant[];

  @ManyToMany(() => Team, (team) => team.agents, { nullable: false }) // ✅ Agents belong to a team
  team: Team[];

  @ManyToMany(() => Role, (role) => role.agents) // ✅ Many-to-Many: Agents can have different roles per tenant
  @JoinTable()
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;
}
