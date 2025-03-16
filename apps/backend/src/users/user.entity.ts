import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { UserRole } from './dto/users.dto'; 

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })  // Ensure the correct enum is used
  role: UserRole;

  @ManyToOne(() => Tenant, (tenant) => tenant.users, { nullable: false })
  tenant: Tenant;

  @CreateDateColumn()
  createdAt: Date;
}