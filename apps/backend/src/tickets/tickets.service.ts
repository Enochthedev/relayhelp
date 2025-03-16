import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { QueueService } from '../queue/queue.service';
import { CreateTicketDto, UpdateTicketDto, UpdateTicketStatusDto, AssignAgentDto, TicketResponseDto } from './dto/tickets.dto';
import { TicketStatus } from './dto/tickets.dto';
import { User } from '../users/user.entity';
import { Tenant } from '../tenants/tenant.entity';
import { Team } from '../teams/team.entity'; 
import { REQUEST_CONTEXT_KEYS } from '../common/request-context/request.constants';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>, 
    private readonly queueService: QueueService,
  ) {}

  async createTicket(data: CreateTicketDto, request: any): Promise<TicketResponseDto> {
    const tenantId = request.requestContext[REQUEST_CONTEXT_KEYS.TENANT_ID];
    const teamId = request.requestContext[REQUEST_CONTEXT_KEYS.TEAM_ID];

    if (!tenantId || !teamId) {
      throw new Error('Tenant ID and Team ID are required for ticket creation.');
    }

    const tenant = await this.tenantRepository.findOne({ where: { id: tenantId } });
    if (!tenant) {
      throw new Error('Tenant not found.');
    }

    const team = await this.teamRepository.findOne({ where: { id: teamId, tenant: { id: tenantId } } });
    if (!team) {
      throw new Error('Team not found for the specified tenant.');
    }

    const ticket = this.ticketRepository.create({
      ...data,
      tenant,
      team,
      requester: null,
      assignedAgents: [],
      createdAt: new Date(),
    });

    await this.ticketRepository.save(ticket);
    await this.queueService.addTicketToQueue(ticket.id);

    return this.formatTicketResponse(ticket);
  }

  async getAllTickets(request: any): Promise<TicketResponseDto[]> {
    const tenantId = request.requestContext[REQUEST_CONTEXT_KEYS.TENANT_ID];

    const tickets = await this.ticketRepository.find({
      where: { tenant: { id: tenantId } },
      select: ['id', 'title', 'description', 'status', 'createdAt', 'updatedAt'], // ✅ Select only necessary fields
      relations: ['requester', 'assignedAgents', 'closedBy', 'team'],
    });

    return tickets.map(ticket => this.formatTicketResponse(ticket));
  }

  async getTicketById(ticketId: string, request: any): Promise<TicketResponseDto> {
    const tenantId = request.requestContext[REQUEST_CONTEXT_KEYS.TENANT_ID];

    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId, tenant: { id: tenantId } },
      relations: ['requester', 'assignedAgents', 'closedBy', 'team'],
    });

    if (!ticket) throw new Error('Ticket not found');
    
    return this.formatTicketResponse(ticket);
  }

  async updateTicketStatus(ticketId: string, data: UpdateTicketStatusDto, request: any): Promise<TicketResponseDto> {
    const tenantId = request.requestContext[REQUEST_CONTEXT_KEYS.TENANT_ID];

    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId, tenant: { id: tenantId } },
      relations: ['assignedAgents', 'closedBy', 'team'],
    });

    if (!ticket) throw new Error('Ticket not found');

    ticket.status = data.status as TicketStatus; // ✅ Ensure correct type

    if (data.assignedAgents) {
      const agents = await this.userRepository.findByIds(data.assignedAgents);
      ticket.assignedAgents = agents;
    }

    if (data.closedBy) {
      const closer = await this.userRepository.findOne({ where: { id: data.closedBy } });
      if (!closer) throw new Error('User closing ticket not found');
      ticket.closedBy = closer;
    }

    await this.ticketRepository.save(ticket);
    return this.formatTicketResponse(ticket);
  }

  async assignAgentsToTicket(data: AssignAgentDto, request: any): Promise<TicketResponseDto> {
    const ticket = await this.ticketRepository.findOne({ where: { id: data.ticketId }, relations: ['assignedAgents'] });
    if (!ticket) throw new Error('Ticket not found');

    const agents = await this.userRepository.findByIds(data.assignedAgents);
    ticket.assignedAgents = agents;

    await this.ticketRepository.save(ticket);
    return this.formatTicketResponse(ticket);
  }

  private formatTicketResponse(ticket: Ticket): TicketResponseDto {
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status as TicketStatus, // \
      assignedAgents: ticket.assignedAgents?.map(agent => agent.id) || [],
      closedBy: ticket.closedBy?.id || 'system',
      tenantId: ticket.tenant.id,
      autoClose: ticket.autoClose,
      requesterEmail: ticket.requester?.email, // ✅ Added requester email
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }
}