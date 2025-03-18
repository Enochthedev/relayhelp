import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '../config/config.service';

@Injectable()
export class QueueService implements OnModuleInit {
  private client: ClientProxy;

  constructor(private readonly configService: ConfigService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get('RABBITMQ_URL')],
        queue: 'ticketQueue',
        queueOptions: { durable: true },
      },
    });
  }

  async onModuleInit() {
    console.log('QueueService connected to RabbitMQ');
  }

  async addTicketToQueue(ticketId: string) {
    console.log(`Adding ticket ${ticketId} to RabbitMQ queue`);
    await this.client.emit('ticket.created', { ticketId });
  }

  async updateTicketInQueue(ticketId: string, status: string) {
    console.log(`Updating ticket ${ticketId} in queue with status ${status}`);
    await this.client.emit('ticket.updated', { ticketId, status });
  }

  async notifyAgentAssignment(ticketId: string, assignedAgents: string[]) {
    console.log(`Assigning agents ${assignedAgents.join(', ')} to ticket ${ticketId}`);
    await this.client.emit('ticket.agent.assigned', { ticketId, assignedAgents });
  }

  async closeTicketInQueue(ticketId: string, closedBy: string) {
    console.log(`Closing ticket ${ticketId} by ${closedBy}`);
    await this.client.emit('ticket.closed', { ticketId, closedBy });
  }
}