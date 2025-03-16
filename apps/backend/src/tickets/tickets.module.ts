import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { QueueModule } from '../queue/queue.module';
import { UsersModule } from '../users/users.module'; // ✅ Import UsersModule
import { Tenant } from '../tenants/tenant.entity';
import { Team } from '../teams/team.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, User, Tenant, Team]), // ✅ Add User, Tenant, and Team entities
    QueueModule,
    UsersModule, // ✅ Ensure UsersModule is imported
  ],
  providers: [TicketsService],
  controllers: [TicketsController],
  exports: [TicketsService],
})
export class TicketsModule {}