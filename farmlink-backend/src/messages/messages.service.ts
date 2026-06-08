import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageResponseDto, ConversationDto, PaginationDto, UserPreviewDto } from './dto/message-response.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../common/enums/notification-type.enum';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async sendMessage(createMessageDto: CreateMessageDto): Promise<MessageResponseDto> {
    if (createMessageDto.senderId === createMessageDto.receiverId) {
      throw new BadRequestException('Cannot send message to yourself');
    }

    const [sender, receiver] = await Promise.all([
      this.userRepository.findOne({ where: { id: createMessageDto.senderId } }),
      this.userRepository.findOne({ where: { id: createMessageDto.receiverId } }),
    ]);

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or receiver not found');
    }

    const message = this.messageRepository.create({
      senderId: createMessageDto.senderId,
      receiverId: createMessageDto.receiverId,
      content: createMessageDto.content,
      productId: createMessageDto.productId,
      orderId: createMessageDto.orderId,
      sender,
      receiver,
    });

    const savedMessage = await this.messageRepository.save(message);
    
    // Trigger notification
    const senderName = [sender.firstName, sender.lastName].filter(Boolean).join(' ') || sender.email || 'Someone';
    await this.notificationsService.createNotification(
      createMessageDto.receiverId,
      NotificationType.NEW_MESSAGE,
      'New Message',
      `New message from ${senderName}`,
      { messageId: savedMessage.id }
    );

    return this.toMessageResponseDto(savedMessage, sender, receiver);
  }

  async getConversation(
    userId: string,
    otherUserId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginationDto<MessageResponseDto>> {
    if (userId === otherUserId) {
      throw new BadRequestException('Cannot get conversation with yourself');
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await this.messageRepository
      .createQueryBuilder('message')
      .where(
        '(message.senderId = :userId AND message.receiverId = :otherUserId) OR (message.senderId = :otherUserId AND message.receiverId = :userId)',
        { userId, otherUserId },
      )
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .orderBy('message.createdAt', 'DESC')
      .take(limit)
      .skip(skip)
      .getManyAndCount();

    const data = messages.reverse().map(msg =>
      this.toMessageResponseDto(msg, msg.sender, msg.receiver),
    );

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getConversations(userId: string, page: number = 1, limit: number = 10): Promise<PaginationDto<ConversationDto>> {
    const skip = (page - 1) * limit;

    const subquery = this.messageRepository
      .createQueryBuilder('m')
      .select('CASE WHEN m.sender_id = :userId THEN m.receiver_id ELSE m.sender_id END', 'participant_id')
      .addSelect('MAX(m.created_at)', 'last_message_time')
      .where('m.sender_id = :userId OR m.receiver_id = :userId', { userId })
      .groupBy('participant_id')
      .orderBy('last_message_time', 'DESC');

    const conversations = await this.messageRepository
      .query(
        `
        SELECT DISTINCT
          CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END as participant_id,
          MAX(m.created_at) as last_message_time,
          COUNT(CASE WHEN m.is_read = false AND m.receiver_id = $1 THEN 1 END) as unread_count
        FROM messages m
        WHERE m.sender_id = $1 OR m.receiver_id = $1
        GROUP BY participant_id
        ORDER BY last_message_time DESC
        LIMIT $2 OFFSET $3
      `,
        [userId, limit, skip],
      );

    const total = await this.messageRepository
      .query(
        `
        SELECT COUNT(DISTINCT
          CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END
        ) as count
        FROM messages m
        WHERE m.sender_id = $1 OR m.receiver_id = $1
      `,
        [userId],
      );

    const conversationDtos: ConversationDto[] = [];

    for (const conv of conversations) {
      const participant = await this.userRepository.findOne({
        where: { id: conv.participant_id },
      });

      if (participant) {
        const lastMessage = await this.messageRepository.findOne({
          where: [
            { senderId: userId, receiverId: conv.participant_id },
            { senderId: conv.participant_id, receiverId: userId },
          ],
          order: { createdAt: 'DESC' },
        });

        conversationDtos.push({
          id: conv.participant_id,
          participant: {
            id: participant.id,
            firstName: participant.firstName ?? undefined,
            lastName: participant.lastName ?? undefined,
            avatarUrl: participant.avatarUrl ?? undefined,
          },
          lastMessage: lastMessage?.content,
          lastMessageTime: lastMessage?.createdAt,
          unreadCount: parseInt(conv.unread_count) || 0,
          createdAt: new Date(conv.last_message_time),
        });
      }
    }

    return {
      data: conversationDtos,
      total: parseInt(total[0]?.count) || 0,
      page,
      limit,
      totalPages: Math.ceil((parseInt(total[0]?.count) || 0) / limit),
    };
  }

  async markAsRead(messageId: string): Promise<MessageResponseDto> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId },
      relations: ['sender', 'receiver'],
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`);
    }

    message.isRead = true;
    const saved = await this.messageRepository.save(message);
    return this.toMessageResponseDto(saved, message.sender, message.receiver);
  }

  async markConversationAsRead(userId: string, otherUserId: string): Promise<void> {
    await this.messageRepository.update(
      {
        receiverId: userId,
        senderId: otherUserId,
        isRead: false,
      },
      { isRead: true },
    );
  }

  async findById(id: string): Promise<MessageResponseDto> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return this.toMessageResponseDto(message, message.sender, message.receiver);
  }

  private toMessageResponseDto(
    message: Message,
    sender: User,
    receiver: User,
  ): MessageResponseDto {
    return {
      id: message.id,
      sender: {
        id: sender.id,
        firstName: sender.firstName ?? undefined,
        lastName: sender.lastName ?? undefined,
        avatarUrl: sender.avatarUrl ?? undefined,
      },
      receiver: {
        id: receiver.id,
        firstName: receiver.firstName ?? undefined,
        lastName: receiver.lastName ?? undefined,
        avatarUrl: receiver.avatarUrl ?? undefined,
      },
      content: message.content,
      isRead: message.isRead,
      createdAt: message.createdAt,
      productId: message.productId,
      orderId: message.orderId,
    };
  }
}