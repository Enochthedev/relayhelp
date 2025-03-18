import { Controller, Post, Delete, Body, Param, Req, Patch } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/message.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({ summary: 'Send a new message' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @Post()
  async sendMessage(@Body() body: CreateMessageDto) {
    return await this.messagesService.sendMessage(body);
  }

  @ApiOperation({ summary: 'Soft delete a message' })
  @ApiResponse({ status: 200, description: 'Message soft deleted' })
  @Delete(':messageId')
  async deleteMessage(@Param('messageId') messageId: string) {
    return await this.messagesService.deleteMessage(messageId);
  }

  @ApiOperation({ summary: 'Reference a message and respond' })
  @ApiResponse({ status: 201, description: 'Referenced message responded to' })
  @Patch(':messageId/respond')
  async referenceMessageAndRespond(
    @Param('messageId') messageId: string,
    @Body() body: CreateMessageDto,
  ) {
    return await this.messagesService.referenceMessageAndRespond(messageId, body);
  }
}