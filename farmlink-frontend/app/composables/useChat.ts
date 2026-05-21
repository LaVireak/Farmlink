import { ref, computed } from 'vue'
import { chatService } from '../services/chat.service'
import { useChatStore } from '../stores/chat.store'
import type { Conversation, Message } from '../types/chat.type'

export const useChat = () => {
  const store = useChatStore()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isTyping = ref(false)

  const fetchConversations = async (page: number = 1, limit: number = 10) => {
    loading.value = true
    error.value = null

    try {
      const data = await chatService.getConversations(page, limit)
      if (data?.data) {
        store.setConversations(data.data)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch conversations'
      console.error('Error fetching conversations:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchMessages = async (
    conversationId: string,
    page: number = 1,
    limit: number = 20
  ) => {
    loading.value = true
    error.value = null

    try {
      const data = await chatService.getMessages(conversationId, page, limit)
      if (data?.data) {
        store.setMessages(conversationId, data.data)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch messages'
      console.error('Error fetching messages:', err)
    } finally {
      loading.value = false
    }
  }

  const sendMessage = async (receiverId: string, content: string, currentUserId: string) => {
    error.value = null

    try {
      const data = await chatService.sendMessage(currentUserId, receiverId, content)
      if (data?.id) {
        const message: Message = data
        store.addMessage(receiverId, message)
        return message
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to send message'
      console.error('Error sending message:', err)
      throw err
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      await chatService.markAsRead(messageId)
    } catch (err) {
      console.error('Error marking message as read:', err)
    }
  }

  const markConversationAsRead = async (conversationId: string) => {
    try {
      await chatService.markConversationAsRead(conversationId)
    } catch (err) {
      console.error('Error marking conversation as read:', err)
    }
  }

  const setActiveConversation = (conversationId: string | null) => {
    store.setActiveConversation(conversationId)
  }

  const activeConversation = computed(
    () => store.activeConversation
  )

  const activeMessages = computed(
    () => store.activeMessages
  )

  const totalUnread = computed(
    () => store.totalUnread
  )

  return {
    // State from store
    conversations: computed(() => store.conversations),
    activeConversationId: computed(() => store.activeConversationId),
    messages: computed(() => store.messages),
    loading,
    error,
    isTyping,
    // Methods
    fetchConversations,
    fetchMessages,
    sendMessage,
    markAsRead,
    markConversationAsRead,
    setActiveConversation,
    // Computed
    activeConversation,
    activeMessages,
    totalUnread,
  }
}
