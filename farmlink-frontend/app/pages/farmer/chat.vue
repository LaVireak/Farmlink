<template>
  <main class="flex-1 flex flex-col bg-surface min-h-screen">
    <div class="px-6 md:px-10 pt-8 pb-5 border-b border-outline-variant/50 mb-6">
      <FarmerHeader title="Customer Chat" />
    </div>

    <!-- Chat panel wrapper -->
    <div class="flex overflow-hidden bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm mx-6 md:mx-10 mb-8" style="height: calc(100vh - 180px); max-height: calc(100vh - 180px); min-height: 500px;">
      
      <!-- Chat Container -->
      <div class="flex flex-1 w-full h-full bg-surface-container-lowest overflow-hidden min-h-0">

        <!-- Conversations Panel -->
        <aside class="w-80 flex-shrink-0 border-r border-outline-variant flex flex-col overflow-hidden bg-surface-container-lowest">
          <div class="flex items-center justify-between p-5 pb-3">
            <h2 class="text-lg font-bold text-on-surface">Conversations</h2>
            <span v-if="chat.totalUnread.value > 0" class="bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">{{ chat.totalUnread.value }}</span>
          </div>

          <div class="flex items-center gap-2 mx-4 mb-3 px-3 py-2 bg-surface-container border border-outline-variant rounded-xl text-on-surface-variant focus-within:border-secondary transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input v-model="search" type="text" placeholder="Search customers..." class="flex-1 bg-transparent border-none outline-none text-sm text-on-surface placeholder-on-surface-variant w-full" />
          </div>

          <div class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">
            <button
              v-for="conv in filteredConversations"
              :key="conv.id"
              class="w-full flex items-center gap-3 p-3 border-l-4 transition-colors text-left"
              :class="chat.activeConversationId.value === conv.id ? 'bg-secondary-container/30 border-secondary' : 'border-transparent hover:bg-surface-container/50'"
              @click="selectConversation(conv)"
            >
              <div class="relative flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-white font-bold flex items-center justify-center border border-outline-variant">
                <img v-if="conv.participant.avatarUrl" :src="conv.participant.avatarUrl" :alt="conv.participant.firstName" class="w-10 h-10 rounded-full object-cover" />
                <span v-else>{{ getParticipantInitial(conv) }}</span>
                <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface-container-lowest rounded-full"></div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm font-bold text-on-surface truncate pr-2">{{ getParticipantName(conv) }}</span>
                  <span class="text-[10px] flex-shrink-0" :class="conv.unreadCount > 0 ? 'text-secondary font-bold' : 'text-on-surface-variant'">{{ conv.lastMessageTime ? formatLastTime(conv.lastMessageTime) : 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-center gap-2">
                  <span class="text-xs truncate flex-1" :class="conv.unreadCount > 0 ? 'text-on-surface font-semibold' : 'text-on-surface-variant'">{{ conv.lastMessage || 'No messages yet' }}</span>
                  <span v-if="conv.unreadCount > 0" class="bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">{{ conv.unreadCount }}</span>
                </div>
              </div>
            </button>

            <div v-if="filteredConversations.length === 0" class="text-center p-8 text-sm text-on-surface-variant">No conversations found</div>
          </div>
        </aside>

        <!-- Chat Thread -->
        <section class="flex-1 flex flex-col overflow-hidden bg-surface min-h-0" v-if="activeConv">
          <!-- Thread Header -->
          <div class="flex items-center gap-3 px-5 py-4 border-b border-outline-variant bg-surface-container-lowest">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-white font-bold flex items-center justify-center border border-outline-variant">
              <img v-if="activeConv.participant.avatarUrl" :src="activeConv.participant.avatarUrl" :alt="activeConv.participant.firstName" class="w-10 h-10 rounded-full object-cover" />
              <span v-else>{{ getParticipantInitial(activeConv) }}</span>
            </div>
            <div>
              <p class="text-sm font-bold text-on-surface m-0">{{ getParticipantName(activeConv) }}</p>
              <p class="flex items-center gap-1.5 text-[11px] text-on-surface-variant font-medium mt-0.5">
                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                Active Now
              </p>
            </div>
            <div class="ml-auto">
              <button title="View Order" class="w-9 h-9 rounded-xl border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-surface scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent" ref="messagesArea">
            <div
              v-for="msg in chat.activeMessages.value"
              :key="msg.id"
              class="flex items-end gap-2"
              :class="msg.sender.id === currentUserId ? 'flex-row-reverse' : 'flex-row'"
            >
              <div v-if="msg.sender.id !== currentUserId" class="flex-shrink-0 w-7 h-7 rounded-full bg-surface-container text-on-surface-variant font-bold text-xs flex items-center justify-center border border-outline-variant">
                <img v-if="msg.sender.avatarUrl" :src="msg.sender.avatarUrl" :alt="msg.sender.firstName" class="w-7 h-7 rounded-full object-cover" />
                <span v-else>{{ msg.sender.firstName?.[0]?.toUpperCase() || 'U' }}</span>
              </div>
              <div 
                class="max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                :class="msg.sender.id === currentUserId ? 'bg-secondary text-white rounded-br-sm' : 'bg-surface-container-lowest text-on-surface border border-outline-variant shadow-sm rounded-bl-sm'"
              >
                <p class="m-0">{{ msg.content }}</p>
                <div class="text-[10px] opacity-70 flex items-center justify-end gap-1 mt-1">
                  {{ formatTime(msg.createdAt) }}
                  <span v-if="msg.sender.id === currentUserId && msg.isRead" class="text-green-300 text-[11px] font-bold">✓✓</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Input Bar -->
          <div class="flex items-center gap-3 px-5 py-4 border-t border-outline-variant bg-surface-container-lowest">
            <button class="w-10 h-10 rounded-xl border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-secondary hover:border-secondary transition-colors flex-shrink-0" disabled>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type a message..."
              @keydown.enter="sendMessage"
              class="flex-1 border border-outline-variant rounded-xl px-4 py-2.5 text-sm bg-surface text-on-surface focus:outline-none focus:border-secondary transition-colors w-full"
              :disabled="chat.loading.value"
            />
            <button 
              @click="sendMessage" 
              class="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center flex-shrink-0 transition-all hover:opacity-90 disabled:bg-surface-container disabled:text-on-surface-variant disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              :disabled="!newMessage.trim() || chat.loading.value"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </section>

        <!-- Empty placeholder -->
        <section class="flex-1 flex flex-col items-center justify-center gap-3 text-on-surface-variant text-sm bg-surface" v-else>
          <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <p class="font-bold text-base text-on-surface">Conversations</p>
          <p class="text-xs">Select a conversation to start chatting</p>
        </section>

      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'farmer',
  layout: 'farmer'
})

import { ref, computed, nextTick, onMounted } from 'vue'
import { useChat } from '~/composables/useChat'
import { useAuthStore } from '~/stores/auth.store'

useHead({ title: 'Chat | FarmLink Farmer' })

const chat = useChat()
const authStore = useAuthStore()

const search = ref('')
const newMessage = ref('')
const messagesArea = ref<HTMLElement | null>(null)

const currentUserId = computed(() => authStore.user?.id ?? null)

const filteredConversations = computed(() =>
  chat.conversations.value.filter(c =>
    (c.participant.firstName || c.participant.lastName || 'User')
      .toLowerCase()
      .includes(search.value.toLowerCase())
  )
)

const activeConv = computed(() =>
  chat.conversations.value.find(c => c.id === chat.activeConversationId.value) ?? null
)

const getParticipantName = (conv: any) =>
  `${conv.participant.firstName || ''} ${conv.participant.lastName || ''}`.trim() || 'User'

const getParticipantInitial = (conv: any) =>
  (conv.participant.firstName?.[0] || conv.participant.lastName?.[0] || 'U').toUpperCase()

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatLastTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

async function selectConversation(conv: any) {
  chat.setActiveConversation(conv.id)
  await chat.fetchMessages(conv.id, 1, 20)
  if (conv.unreadCount > 0) {
    await chat.markConversationAsRead(conv.id)
  }
  nextTick(scrollToBottom)
}

async function sendMessage() {
  const text = newMessage.value.trim()
  if (!text || !activeConv.value || !currentUserId.value) return

  try {
    await chat.sendMessage(activeConv.value.id, text, currentUserId.value)
    newMessage.value = ''
    nextTick(scrollToBottom)
  } catch (err) {
    console.error('Failed to send message:', err)
  }
}

function scrollToBottom() {
  if (messagesArea.value) {
    messagesArea.value.scrollTop = messagesArea.value.scrollHeight
  }
}

onMounted(async () => {
  await chat.fetchConversations(1, 10)
})
</script>

<style scoped>
/* Optional tiny fix for the inputs taking full width smoothly */
input::placeholder {
  color: #9ca3af;
}
</style>
