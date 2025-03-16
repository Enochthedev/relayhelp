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
}