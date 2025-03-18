import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketMessage } from '../../messages/message.entity'; 
import { MessageResponseDto } from '../../messages/dto/message.dto';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export class CreateTicketDto {
  @ApiProperty({ example: 'Payment issue' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'My payment is stuck at processing.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'john.doe@example.com', required: false })
  @IsString()
  @IsOptional()
  requesterEmail?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  requesterName?: string;

  @ApiProperty({ example: 'tenant-id-123' })
  @IsUUID()
  @IsNotEmpty()
  UserId : string;
}

export class UpdateTicketDto {
  @ApiProperty({ example: 'New title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: TicketStatus.RESOLVED, enum: TicketStatus, required: false })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;
}

export class UpdateTicketStatusDto {
  @ApiProperty({ example: TicketStatus.RESOLVED, enum: TicketStatus })
  @IsEnum(TicketStatus)
  @IsNotEmpty()
  status: TicketStatus;

  @ApiProperty({ example: ['agent-id-123', 'agent-id-456'], required: false })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  assignedAgents?: string[];

  @ApiProperty({ example: 'user-id-789', required: false })
  @IsUUID()
  @IsOptional()
  closedBy?: string;
}

export class AssignAgentDto {
  @ApiProperty({ example: 'ticket-id-789' })
  @IsUUID()
  @IsNotEmpty()
  ticketId: string;

  @ApiProperty({ example: ['agent-id-123', 'agent-id-456'] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  assignedAgents: string[];
}/// change soon @Enochthedev migrate to JoinTicketDto

export class JoinTicketDto {
    @ApiProperty({ example: 'ticket-id-789' })
    @IsUUID()
    @IsNotEmpty()
    ticketId: string;


    @ApiProperty({ example: 'agent-id-123' })
    @IsUUID()
    @IsNotEmpty()
    agentId: string;
}

export class LeaveTicketDto {
    @ApiProperty({ example: 'ticket-id-789' })
    @IsUUID()
    @IsNotEmpty()
    ticketId: string;

    @ApiProperty({ example: 'agent-id-123' })
    @IsUUID()
    @IsNotEmpty()
    agentId: string;
}

export class RemoveFromTicketDto {
    @ApiProperty({ example: 'ticket-id-789' })
    @IsUUID()
    @IsNotEmpty()
    ticketId: string;

    @ApiProperty({ example: 'agent-id-123' })
    @IsUUID()
    @IsNotEmpty()
    agentId: string;
}


export class TicketResponseDto {
  @ApiProperty({ example: 'ticket-id-789' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'Payment issue' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'My payment is stuck at processing.' })
  @IsString()
  description: string;

  @ApiProperty({ example: TicketStatus.OPEN, enum: TicketStatus })
  @IsEnum(TicketStatus)
  status: TicketStatus;

  @ApiProperty({ example: ['agent-id-123', 'agent-id-456'] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  assignedAgents: string[];

  @ApiProperty({ example: 'user-id-789', required: false })
  @IsUUID()
  @IsOptional()
  closedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ example: 'tenant-id-123' })
  @IsUUID()
  tenantId: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  autoClose: boolean;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ example: 'john.doe@example.com', required: false }) // Added requester email
  @IsString()
  @IsOptional()
  requesterEmail?: string; // Added requester email

  @ApiProperty({ type: () => MessageResponseDto, isArray: true })
  @IsOptional()
  messages?: {
    data: TicketMessage[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalMessages: number;
    };
};
}