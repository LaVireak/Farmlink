export interface UserPreview {
  id: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
}

export interface Message {
  id: string
  sender: UserPreview
  receiver: UserPreview
  content: string
  isRead: boolean
  createdAt: string
  productId?: string
  orderId?: string
}

export interface Conversation {
  id: string
  participant: UserPreview
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  createdAt: string
}

export interface PaginationMeta {
  data: any[]
  total: number
  page: number
  limit: number
  totalPages: number
}
