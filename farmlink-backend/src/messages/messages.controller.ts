import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { MessagesService } from './messages.service';
import { MessagesSeedService } from './messages.seed.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageResponseDto, ConversationDto, PaginationDto } from './dto/message-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly seedService: MessagesSeedService,
  ) {}
  
  @Post('seed')
  @Public()
  async seedTestData(@Query('farmerId') farmerId?: string, @Query('consumerId') consumerId?: string) {
    return this.seedService.seedTestData(farmerId, consumerId);
  }

  @Post()
  async sendMessage(@Body() createMessageDto: CreateMessageDto): Promise<MessageResponseDto> {
    return this.messagesService.sendMessage(createMessageDto);
  }

  @Get('conversations')
  async getConversations(
    @CurrentUser() user: any,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ): Promise<PaginationDto<ConversationDto>> {
    if (!user || !user.id) {
      throw new Error('User ID not found in request');
    }
    return this.messagesService.getConversations(user.id, page, limit);
  }

  @Get('conversations/:otherUserId')
  async getConversation(
    @CurrentUser() user: any,
    @Param('otherUserId') otherUserId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ): Promise<PaginationDto<MessageResponseDto>> {
    if (!user || !user.id) {
      throw new Error('User ID not found in request');
    }
    return this.messagesService.getConversation(user.id, otherUserId, page, limit);
  }

  @Patch('conversations/:otherUserId/mark-read')
  async markConversationAsRead(
    @CurrentUser() user: any,
    @Param('otherUserId') otherUserId: string,
  ): Promise<{ message: string }> {
    if (!user || !user.id) {
      throw new Error('User ID not found in request');
    }
    await this.messagesService.markConversationAsRead(user.id, otherUserId);
    return { message: 'Conversation marked as read' };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string): Promise<MessageResponseDto> {
    return this.messagesService.markAsRead(id);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<MessageResponseDto> {
    return this.messagesService.findById(id);
  }
}
