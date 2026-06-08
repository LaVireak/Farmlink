<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useChat } from '~/composables/useChat';
import { useChatStore } from '~/stores/chat.store';
import { useAuth } from '~/composables/useAuth';

definePageMeta({ layout: 'user', middleware: 'user' });
useHead({ title: 'Chat with Farmers | FarmLink Cambodia' });

const chat = useChat();
const chatStore = useChatStore();
const { user } = useAuth();
const route = useRoute();
const search = ref('');
const newMessage = ref('');
const messagesContainer = ref<HTMLElement | null>(null);

const currentUserId = computed(() => {
  if (user?.id) return user.id;
  const sessionStr = localStorage.getItem('farmlink.auth.session');
  if (!sessionStr) return null;
  try {
    const session = JSON.parse(sessionStr);
    return session?.user?.id;
  } catch {
    return null;
  }
});

onMounted(async () => {
  await chat.fetchConversations(1, 10);

  const targetUserId = route.query.userId as string;
  if (targetUserId) {
    const existing = chatStore.conversations.find(c => c.participant?.id === targetUserId || c.id === targetUserId);
    if (existing) {
      await selectContact(existing);
    } else {
      const name = (route.query.name as string) || 'Farmer';
      const avatarUrl = (route.query.avatar as string) || '';
      
      const newConv = {
        id: targetUserId,
        participant: {
          id: targetUserId,
          firstName: name.split(' ')[0],
          lastName: name.split(' ').slice(1).join(' ') || '',
          avatarUrl: avatarUrl
        },
        lastMessage: 'No messages yet',
        lastMessageTime: new Date(),
        unreadCount: 0,
        createdAt: new Date()
      };
      
      // Add to beginning of conversations list
      chatStore.conversations.unshift(newConv);
      await selectContact(newConv);
    }
  }
});

const filteredContacts = computed(() => {
  const name = search.value.toLowerCase();
  return chat.conversations.value.filter(c =>
    (c.participant.firstName || c.participant.lastName || 'User')
      .toLowerCase()
      .includes(name)
  );
});

const totalUnread = computed(() =>
  chat.conversations.value.reduce((sum, c) => sum + c.unreadCount, 0)
);

const activeContact = computed(() => {
  if (!chat.activeConversationId.value) return null;
  return chat.conversations.value.find(c => c.id === chat.activeConversationId.value) ?? null;
});

const messages = computed(() => chat.messages.value);

const getInitial = (name?: string, fallback = 'U') => name?.[0]?.toUpperCase() || fallback;

async function selectContact(conversation: any) {
  chat.setActiveConversation(conversation.id);
  await chat.fetchMessages(conversation.id, 1, 20);
  if (conversation.unreadCount > 0) {
    await chat.markConversationAsRead(conversation.id);
  }
  nextTick(scrollToBottom);
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function sendMessage() {
  const text = newMessage.value.trim();
  if (!text || !activeContact.value || !currentUserId.value) return;

  try {
    await chat.sendMessage(activeContact.value.id, text, currentUserId.value);
    newMessage.value = '';
    nextTick(scrollToBottom);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

function scrollToBottom() {
  if (messagesContainer.value)
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
}

</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <CommonAppHeader />

    <main class="max-w-[1550px] mx-auto w-full pt-16 sm:pt-16 px-4 sm:px-16 lg:px-8 flex-1 flex flex-col pb-8">
      <div class="flex flex-col md:flex-row gap-8 md:gap-10 flex-1">
        <CommonAppSidebar active="chat" />

        <!-- Chat panel wrapper -->
        <div class="flex-1 flex overflow-hidden bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm" style="height: calc(100vh - 180px); min-height: 500px;">
          
          <!-- Chat Container -->
          <div class="flex flex-1 w-full bg-surface-container-lowest overflow-hidden">

            <!-- Conversations Panel -->
            <aside class="w-80 flex-shrink-0 border-r border-outline-variant flex flex-col overflow-hidden bg-surface-container-lowest">
              <div class="flex items-center justify-between p-5 pb-3">
                <h2 class="text-lg font-bold text-on-surface">Messages</h2>
                <span v-if="totalUnread > 0" class="bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">{{ totalUnread }}</span>
              </div>

              <div class="flex items-center gap-2 mx-4 mb-3 px-3 py-2 bg-surface-container border border-outline-variant rounded-xl text-on-surface-variant focus-within:border-secondary transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input v-model="search" type="text" placeholder="Search farmers..." class="flex-1 bg-transparent border-none outline-none text-sm text-on-surface placeholder-on-surface-variant w-full" />
              </div>

              <div class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">
                <button
                  v-for="contact in filteredContacts"
                  :key="contact.id"
                  class="w-full flex items-center gap-3 p-3 border-l-4 transition-colors text-left"
                  :class="chat.activeConversationId.value === contact.id ? 'bg-secondary-container/30 border-secondary' : 'border-transparent hover:bg-surface-container/50'"
                  @click="selectContact(contact)"
                >
                  <div class="relative flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-white font-bold flex items-center justify-center border border-outline-variant">
                    <img v-if="contact.participant.avatarUrl" :src="contact.participant.avatarUrl" :alt="contact.participant.firstName" class="w-10 h-10 rounded-full object-cover" />
                    <span v-else>{{ getInitial(contact.participant.firstName) }}</span>
                    <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface-container-lowest rounded-full"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-sm font-bold text-on-surface truncate pr-2">{{ contact.participant.firstName }} {{ contact.participant.lastName }}</span>
                      <span class="text-[10px] flex-shrink-0" :class="contact.unreadCount > 0 ? 'text-secondary font-bold' : 'text-on-surface-variant'">{{ new Date(contact.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
                    </div>
                    <div class="flex justify-between items-center gap-2">
                      <span class="text-xs truncate flex-1" :class="contact.unreadCount > 0 ? 'text-on-surface font-semibold' : 'text-on-surface-variant'">{{ contact.lastMessage || 'No messages yet' }}</span>
                      <span v-if="contact.unreadCount > 0" class="bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">{{ contact.unreadCount }}</span>
                    </div>
                  </div>
                </button>

                <div v-if="filteredContacts.length === 0" class="text-center p-8 text-sm text-on-surface-variant">No conversations found</div>
              </div>
            </aside>

            <!-- Chat Thread -->
            <section class="flex-1 flex flex-col overflow-hidden bg-surface" v-if="activeContact">
              <!-- Thread Header -->
              <div class="flex items-center gap-3 px-5 py-4 border-b border-outline-variant bg-surface-container-lowest">
                <div class="flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-white font-bold flex items-center justify-center border border-outline-variant">
                  <img v-if="activeContact.participant.avatarUrl" :src="activeContact.participant.avatarUrl" :alt="activeContact.participant.firstName" class="w-10 h-10 rounded-full object-cover" />
                  <span v-else>{{ getInitial(activeContact.participant.firstName) }}</span>
                </div>
                <div>
                  <p class="text-sm font-bold text-on-surface m-0">{{ activeContact.participant.firstName }} {{ activeContact.participant.lastName }}</p>
                  <p class="flex items-center gap-1.5 text-[11px] text-on-surface-variant font-medium mt-0.5">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                    Online
                  </p>
                </div>
              </div>

              <!-- Messages -->
              <div class="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-surface scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent" ref="messagesContainer">
                <div
                  v-for="msg in chat.activeMessages.value"
                  :key="msg.id"
                  class="flex items-end gap-2"
                  :class="msg.sender.id === currentUserId ? 'flex-row-reverse' : 'flex-row'"
                >
                  <div v-if="msg.sender.id !== currentUserId" class="flex-shrink-0 w-7 h-7 rounded-full bg-surface-container text-on-surface-variant font-bold text-xs flex items-center justify-center border border-outline-variant">
                    <img v-if="msg.sender.avatarUrl" :src="msg.sender.avatarUrl" :alt="msg.sender.firstName" class="w-7 h-7 rounded-full object-cover" />
                    <span v-else>{{ getInitial(msg.sender.firstName) }}</span>
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
                <button class="w-10 h-10 rounded-xl border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-secondary hover:border-secondary transition-colors flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </button>
                <input
                  v-model="newMessage"
                  type="text"
                  :placeholder="'Message ' + activeContact.participant.firstName + '...'"
                  @keydown.enter="sendMessage"
                  class="flex-1 border border-outline-variant rounded-xl px-4 py-2.5 text-sm bg-surface text-on-surface focus:outline-none focus:border-secondary transition-colors w-full"
                />
                <button 
                  @click="sendMessage" 
                  class="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center flex-shrink-0 transition-all hover:opacity-90 disabled:bg-surface-container disabled:text-on-surface-variant disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  :disabled="!newMessage.trim()"
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
              <p class="font-bold text-base text-on-surface">Your Messages</p>
              <p class="text-xs">Select a conversation from the left to start chatting</p>
            </section>

          </div>

        </div>
      </div>
    </main>

    <CommonAppFooter />
  </div>
</template>

<style scoped>
/* Optional tiny fix for the inputs taking full width smoothly */
input::placeholder {
  color: #9ca3af;
}
</style>
