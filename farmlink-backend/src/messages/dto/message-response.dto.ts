export class UserPreviewDto {
  id: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export class MessageResponseDto {
  id: string;
  sender: UserPreviewDto;
  receiver: UserPreviewDto;
  content: string;
  isRead: boolean;
  createdAt: Date;
  productId?: string;
  orderId?: string;
}

export class ConversationDto {
  id: string;
  participant: UserPreviewDto;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  createdAt: Date;
}

export class PaginationDto<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
