import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum SenderType {
  USER = 'user',
  AGENT = 'agent',
  GUEST = 'guest',
  SYSTEM = 'system',
}

export class CreateMessageDto {
  @ApiProperty({ example: 'ticket-id-123' })
  @IsUUID()
  @IsNotEmpty()
  ticketId: string;

  @ApiProperty({ example: 'user-id-456' })
  @IsUUID()
  @IsNotEmpty()
  senderId: string;

  @ApiProperty({ example: 'user', enum: SenderType })
  @IsEnum(SenderType)
  @IsNotEmpty()
  senderType: SenderType;

  @ApiProperty({ example: 'This is a message' })
  @IsString()
  @IsNotEmpty()
  content: string; // Changed from `message` to `content`

  @ApiProperty({ example: 'https://example.com/attachment.jpg', required: false })
  @IsString()
  @IsOptional()
  attachmentUrl?: string;

  @ApiProperty({ example: 'message-id-789', required: false, description: 'ID of the message being referenced' })
  @IsUUID()
  @IsOptional()
  referenceMessageId?: string;

  @ApiProperty({ example: 'system-update', required: false })
  @IsString()
  @IsOptional()
  systemMessageType?: string;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'message-id-789' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'ticket-id-123' })
  @IsUUID()
  ticketId: string;

  @ApiProperty({ example: 'user-id-456' })
  @IsUUID()
  senderId: string;

  @ApiProperty({ example: 'user', enum: SenderType })
  @IsEnum(SenderType)
  senderType: SenderType;

  @ApiProperty({ example: 'This is a message' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'https://example.com/attachment.jpg', required: false })
  @IsString()
  @IsOptional()
  attachmentUrl?: string;

  @ApiProperty({ example: 'message-id-789', required: false, description: 'ID of the referenced message' })
  @IsUUID()
  @IsOptional()
  referenceMessageId?: string;

  @ApiProperty({ example: 'system-update', required: false })
  @IsString()
  @IsOptional()
  systemMessageType?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date;
}
