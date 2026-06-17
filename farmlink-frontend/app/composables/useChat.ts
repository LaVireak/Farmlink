import { ref, computed } from 'vue'
import { chatService } from '../services/chat.service'
import { useChatStore } from '../stores/chat.store'
import { useAuthStore } from '../stores/auth.store'
import { supabase } from '../services/auth.service'
import type { Conversation, Message } from '../types/chat.type'

// ── Module-level singletons ───────────────────────────────────────────────────
let chatChannel: any = null
let subscribedUserId: string | null = null
// ─────────────────────────────────────────────────────────────────────────────

export const useChat = () => {
  const store = useChatStore()
  const authStore = useAuthStore()
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
    limit: number = 20,
    isPolling: boolean = false
  ) => {
    if (!isPolling) {
      loading.value = true
    }
    error.value = null

    try {
      const data = await chatService.getMessages(conversationId, page, limit)
      if (data?.data) {
        const currentMessages = store.messages[conversationId] ?? []
        const newMessages = data.data

        // Only update if messages have actually changed
        if (currentMessages.length !== newMessages.length ||
            currentMessages[currentMessages.length - 1]?.id !== newMessages[newMessages.length - 1]?.id) {
          store.setMessages(conversationId, newMessages)
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch messages'
      console.error('Error fetching messages:', err)
    } finally {
      if (!isPolling) {
        loading.value = false
      }
    }
  }

  const startPolling = (conversationId?: string) => {
    const currentUserId = authStore.user?.id
    if (!currentUserId) return

    // If user changed, clean up previous channel
    if (chatChannel && subscribedUserId !== currentUserId) {
      supabase.removeChannel(chatChannel)
      chatChannel = null
      subscribedUserId = null
    }

    if (!chatChannel) {
      subscribedUserId = currentUserId
      chatChannel = supabase.channel(`chat_realtime_${currentUserId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
          },
          (payload) => {
            const msg = payload.new
            const activeId = store.activeConversationId

            if (msg.sender_id === currentUserId || msg.receiver_id === currentUserId) {
              if (msg.sender_id !== currentUserId) {
                if (activeId && (msg.sender_id === activeId || msg.receiver_id === activeId)) {
                  fetchMessages(activeId, 1, 20, true)
                }
              }
              fetchConversations()
            }
          }
        )
        .subscribe()
    }
  }

  const stopPolling = () => {
    // Keep subscription active so that we receive unread message updates/badges globally.
  }

  const sendMessage = async (receiverId: string, content: string, currentUserId: string) => {
    error.value = null

    try {
      const data = await chatService.sendMessage(currentUserId, receiverId, content)
      if (data?.id) {
        const message: Message = data
        store.addMessage(receiverId, message)
        store.updateConversation(receiverId, message.content, message.createdAt)
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

    if (conversationId) {
      startPolling(conversationId)
    } else {
      stopPolling()
    }
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
    startPolling,
    stopPolling,
    // Computed
    activeConversation,
    activeMessages,
    totalUnread,
  }
}
