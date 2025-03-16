import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  async createTenant(@Body() body: { name: string; discordServerId?: string }) {
    return await this.tenantsService.createTenant(body.name, body.discordServerId);
  }

  @Get()
  async getAllTenants() {
    return await this.tenantsService.getAllTenants();
  }

  @Get(':tenantId')
  async getTenant(@Param('tenantId') tenantId: string) {
    return await this.tenantsService.findById(tenantId);
  }
}