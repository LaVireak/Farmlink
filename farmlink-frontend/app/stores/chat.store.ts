import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Conversation, Message } from '../types/chat.type'

export const useChatStore = defineStore('chat', () => {
  const conversations = ref<Conversation[]>([])
  const messages = ref<Record<string, Message[]>>({})
  const activeConversationId = ref<string | null>(null)
  const loading = ref(false)

  const setConversations = (data: Conversation[]) => {
    conversations.value = data
  }

  const setMessages = (conversationId: string, data: Message[]) => {
    messages.value[conversationId] = data
  }

  const addMessage = (conversationId: string, message: Message) => {
    if (!messages.value[conversationId]) {
      messages.value[conversationId] = []
    }
    messages.value[conversationId].push(message)
  }

  const updateConversation = (conversationId: string, lastMessage: string, lastMessageTime: Date) => {
    const conv = conversations.value.find(c => c.id === conversationId)
    if (conv) {
      conv.lastMessage = lastMessage
      conv.lastMessageTime = lastMessageTime
      conv.unreadCount = 0
    }
  }

  const setActiveConversation = (id: string | null) => {
    activeConversationId.value = id
  }

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const activeConversation = computed(() =>
    conversations.value.find(c => c.id === activeConversationId.value)
  )

  const activeMessages = computed(() =>
    messages.value[activeConversationId.value ?? ''] ?? []
  )

  const totalUnread = computed(() =>
    conversations.value.reduce((sum, c) => sum + (c.unreadCount || 0), 0)
  )

  return {
    conversations,
    messages,
    activeConversationId,
    loading,
    setConversations,
    setMessages,
    addMessage,
    updateConversation,
    setActiveConversation,
    setLoading,
    activeConversation,
    activeMessages,
    totalUnread,
  }
})
