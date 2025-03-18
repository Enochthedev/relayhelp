import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsService } from './agents.service';
import { Agent } from './agent.entity';
import { AgentsController } from './agents.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agent])
  ],
  providers: [AgentsService],
  controllers: [AgentsController]
})
export class AgentsModule {}
