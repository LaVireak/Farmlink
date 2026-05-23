import { getAccessToken } from './auth.service'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const apiFetch = async <T>(path: string, options: RequestInit): Promise<T> => {
  const token = await getAccessToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.message || 'Request failed')
  }

  return data as T
}

export const chatService = {
  async getConversations(page: number = 1, limit: number = 10) {
    return apiFetch('/api/messages/conversations?page=' + page + '&limit=' + limit, {
      method: 'GET',
    })
  },

  async getMessages(conversationId: string, page: number = 1, limit: number = 20) {
    return apiFetch(`/api/messages/conversations/${conversationId}?page=${page}&limit=${limit}`, {
      method: 'GET',
    })
  },

  async sendMessage(senderId: string, receiverId: string, content: string) {
    return apiFetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ senderId, receiverId, content }),
    })
  },

  async markAsRead(messageId: string) {
    return apiFetch(`/api/messages/${messageId}/read`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    })
  },

  async markConversationAsRead(conversationId: string) {
    return apiFetch(`/api/messages/conversations/${conversationId}/mark-read`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    })
  },
}
