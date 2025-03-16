import { Controller, Post, Get, Patch, Body, Param, Req } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketStatusDto, AssignAgentDto, TicketResponseDto } from './dto/tickets.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully.', type: TicketResponseDto })
  @Post()
  async createTicket(@Body() body: CreateTicketDto, @Req() request): Promise<TicketResponseDto> {
    return await this.ticketsService.createTicket(body, request);
  }

  @ApiOperation({ summary: 'Get all tickets for a tenant' })
  @ApiResponse({ status: 200, description: 'List of tickets.', type: [TicketResponseDto] })
  @Get()
  async getAllTickets(@Req() request): Promise<TicketResponseDto[]> {
    return await this.ticketsService.getAllTickets(request);
  }

  @ApiOperation({ summary: 'Get a specific ticket by ID' })
  @ApiResponse({ status: 200, description: 'Ticket details.', type: TicketResponseDto })
  @Get(':ticketId')
  async getTicketById(@Param('ticketId') ticketId: string, @Req() request): Promise<TicketResponseDto> {
    return await this.ticketsService.getTicketById(ticketId, request);
  }

  @ApiOperation({ summary: 'Update ticket status' })
  @ApiResponse({ status: 200, description: 'Ticket status updated.', type: TicketResponseDto })
  @Patch(':ticketId/status')
  async updateTicketStatus(
    @Param('ticketId') ticketId: string,
    @Body() body: UpdateTicketStatusDto,
    @Req() request
  ): Promise<TicketResponseDto> {
    return await this.ticketsService.updateTicketStatus(ticketId, body, request);
  }

  @ApiOperation({ summary: 'Assign agents to a ticket' })
  @ApiResponse({ status: 200, description: 'Agents assigned successfully.', type: TicketResponseDto })
  @Patch(':ticketId/assign')
  async assignAgentsToTicket(
    @Body() body: AssignAgentDto,
    @Req() request
  ): Promise<TicketResponseDto> {
    return await this.ticketsService.assignAgentsToTicket(body, request);
  }
}