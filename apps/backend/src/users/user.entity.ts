import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column()
  password?: string;

  @OneToMany(() => Tenant, (tenant) => tenant.owner) // A user can own multiple tenants
  tenants: Tenant[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  twoFactorSecret?: string;

  @Column({ default: false })
  isTwoFactorEnabled: boolean;

  @Column({ nullable: true })
  discordId?: string; // Added for OAuth

  @Column({ nullable: true })
  githubId?: string; // Added for OAuth

  @Column({ nullable: true })
  appleId?: string; // Added for OAuth

  @Column({ nullable: true })
  microsoftId?: string; // Added for OAuth

  @Column({ nullable: true })
  googleId?: string; // Added for OAuth
}