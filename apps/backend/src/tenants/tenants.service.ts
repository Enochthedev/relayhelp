import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async createTenant(name: string, discordServerId?: string) {
    const tenant = this.tenantRepository.create({ name, discordServerId });
    return await this.tenantRepository.save(tenant);
  }

  async findById(tenantId: string) {
    return await this.tenantRepository.findOne({
      where: { id: tenantId },
      relations: ['users', 'tickets'],
    });
  }

  async getAllTenants() {
    return await this.tenantRepository.find();
  }
}