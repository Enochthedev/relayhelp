import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { QueueModule } from './queue/queue.module';
import { TicketsModule } from './tickets/tickets.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { TeamsModule } from './teams/teams.module';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import { AgentsModule } from './agents/agents.module';
import { RoleModule } from './roles/roles.module';

@Module({
  imports: [ConfigModule, DatabaseModule, RedisModule, QueueModule, TicketsModule, UsersModule, TenantsModule, TeamsModule, AuthModule, MessagesModule, AgentsModule, RoleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
