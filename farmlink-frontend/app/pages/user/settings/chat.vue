<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';

definePageMeta({ layout: 'user' });
useHead({ title: 'Chat with Farmers | FarmLink Cambodia' });

// ── Contacts ──────────────────────────────────────────────────────
const contacts = ref([
  {
    id: 1,
    name: 'Battambang Organic Collective',
    role: 'Farm Cooperative',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxSIvKIuR2BqsWIsER071js2ywfi7CP5m9mS8WzX1VFEam_p3bKUUBDfpomQgp2Uvp2PjuNwLmT8W3GAfvhbsNLcYqc6fyI5e9wOgdOAWo-FXd6TFHIyp7dsEJbVDxVZRQOeoU9AlMe452vG5o6NtXf3wpWD-UQ0ob3tIb47t1MtHcAajUd-XoMjdUUFMwSW7E6uxB2TKRsqLcsulOKrq5i1J28fVvVP_1NUUNa0izLItmVgu8tAz9A7NNfUr1G7xELqixhRGcsMg',
    lastMessage: 'Your lemongrass bundle has been packed and is ready for pickup.',
    time: '10:42 AM', unread: 2, online: true,
  },
  {
    id: 2,
    name: 'Sovan M.',
    role: 'Delivery Driver',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCue0B4_ZvopNVjR-6-vhcuCHlBeyqg7zLD4Ln8Lzy6pz-pXXbUqyIAKDDWXLfKtGwrnFcCvpSZ1HSIj5FMyjTlFqTB5gTIZYOgJViFeFkjdP8GPGYNmQfd-2t0sPaH3blZFs8euiU8IM6f5SHXLYWeybixRLzRN0nvOFB9wC-RnZZcPwIFw2n8CYmmqEC6vNVz8qH39rxdPEvxhrhaAS6PrEZ3qD4gQY-HpwsWYJBk0jFUpwt4TKjd4G3RVRu1DNXOhu1KzCC-2hU',
    lastMessage: 'I am arriving in 5 minutes.',
    time: 'Yesterday', unread: 0, online: false,
  },
  {
    id: 3,
    name: 'Kampot Pepper Co-op',
    role: 'Farm',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgMohAYMYvy24VC4cbZzvKKFljvShhZMXBZCF4cf4dZGjsUixpeeKru7S3WtXMiwQp2LBQK0vcuiH1JUUVUBl_9dGrGCBHG-R8rP3dp4z7jl3UA7XRLibf577RhpqmtXpnvJPqvLW3hAxcFqCo0dTs9ZByVvaZpW7a7ZYxV4y-VikVogv2x_qn9Hl8ZeMm0zRoretMsuUe9-3O1eRooYUPF0rvlAWl2jg7RfMPORbcJ93HRuvdIpk7xDT-8ndIrS2uX_Gpi1l-M3M',
    lastMessage: 'Thank you for your order! We hope you enjoy the pepper.',
    time: 'Mon', unread: 0, online: true,
  },
]);

const search = ref('');
const activeContactId = ref<number | null>(1);
const newMessage = ref('');
const messagesContainer = ref<HTMLElement | null>(null);
const isTyping = ref(false);

// ── Computed ──────────────────────────────────────────────────────
const filteredContacts = computed(() =>
  contacts.value.filter(c => c.name.toLowerCase().includes(search.value.toLowerCase()))
);

const totalUnread = computed(() =>
  contacts.value.reduce((sum, c) => sum + c.unread, 0)
);

const activeContact = computed(() =>
  contacts.value.find(c => c.id === activeContactId.value) ?? null
);

const allMessages = ref<Record<number, Array<{ id: number; sender: string; text: string; time: string }>>>({
  1: [
    { id: 1, sender: 'farmer', text: 'Hello! Thank you for ordering from our collective. We are preparing your Fresh Lemongrass and Dragon Fruit.', time: '10:30 AM' },
    { id: 2, sender: 'user',   text: 'Hi! Could you make sure the lemongrass is extra fresh? I need it for a soup tonight.', time: '10:35 AM' },
    { id: 3, sender: 'farmer', text: 'Absolutely. We will pick the best stalks for you. Your lemongrass bundle has been packed and is ready for pickup.', time: '10:42 AM' },
  ],
  2: [
    { id: 1, sender: 'farmer', text: 'I am on my way with your delivery!', time: 'Yesterday' },
    { id: 2, sender: 'farmer', text: 'I am arriving in 5 minutes.', time: 'Yesterday' },
  ],
  3: [
    { id: 1, sender: 'farmer', text: 'Thank you for your order! We hope you enjoy the Kampot pepper.', time: 'Mon' },
  ],
});

const messages = computed(() => allMessages.value[activeContactId.value ?? 0] ?? []);

// ── WebSocket ─────────────────────────────────────────────────────
let ws: WebSocket | null = null;

function connectWebSocket() {
  // TODO: ws = new WebSocket('ws://localhost:3001/chat')
  // ws.onmessage = (event) => { ... push incoming message ... }
}

// ── Actions ───────────────────────────────────────────────────────
function selectContact(contact: any) {
  activeContactId.value = contact.id;
  contact.unread = 0;
  nextTick(scrollToBottom);
}

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function sendMessage() {
  const text = newMessage.value.trim();
  if (!text || !activeContactId.value) return;

  const id = activeContactId.value;
  if (!allMessages.value[id]) allMessages.value[id] = [];
  allMessages.value[id].push({ id: Date.now(), sender: 'user', text, time: formatTime() });

  const contact = contacts.value.find(c => c.id === id);
  if (contact) { contact.lastMessage = text; contact.time = 'Just now'; }

  newMessage.value = '';
  nextTick(scrollToBottom);

  // Simulate farmer reply (remove when WebSocket connected)
  simulateReply(id);
}

function simulateReply(contactId: number) {
  isTyping.value = true;
  setTimeout(() => {
    isTyping.value = false;
    allMessages.value[contactId]?.push({
      id: Date.now(),
      sender: 'farmer',
      text: 'Thank you! We will get back to you shortly. 🌿',
      time: formatTime(),
    });
    nextTick(scrollToBottom);
  }, 2200);
}

function scrollToBottom() {
  if (messagesContainer.value)
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
}

onMounted(connectWebSocket);
onUnmounted(() => { if (ws) ws.close(); });
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#f5f7f3]">
    <CommonAppHeader />

    <main class="max-w-7xl mx-auto w-full pt-28 sm:pt-32 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col pb-8">
      <div class="flex flex-col md:flex-row gap-8 md:gap-10 flex-1">
        <CommonAppSidebar active="chat" />

        <!-- Chat panel — identical layout to farmer chat -->
        <div class="flex-1 flex overflow-hidden" style="height: calc(100vh - 180px); min-height: 500px;">
          <div class="chat-container">

            <!-- Conversations List -->
            <aside class="conversations-panel">
              <div class="conv-header">
                <h2>Messages</h2>
                <span v-if="totalUnread > 0" class="unread-total">{{ totalUnread }}</span>
              </div>

              <div class="conv-search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                <input v-model="search" type="text" placeholder="Search farmers..." />
              </div>

              <div class="conv-list">
                <button
                  v-for="contact in filteredContacts"
                  :key="contact.id"
                  class="conv-item"
                  :class="{ active: activeContactId === contact.id }"
                  @click="selectContact(contact)"
                >
                  <div class="conv-avatar-wrap">
                    <img :src="contact.avatar" :alt="contact.name" class="conv-avatar-img" />
                    <span v-if="contact.online" class="online-dot"></span>
                  </div>
                  <div class="conv-info">
                    <div class="conv-top">
                      <span class="conv-name">{{ contact.name }}</span>
                      <span class="conv-time" :class="{ 'green': contact.unread }">{{ contact.time }}</span>
                    </div>
                    <div class="conv-bottom">
                      <span class="conv-preview" :class="{ bold: contact.unread }">{{ contact.lastMessage }}</span>
                      <span v-if="contact.unread > 0" class="conv-badge">{{ contact.unread }}</span>
                    </div>
                  </div>
                </button>

                <div v-if="filteredContacts.length === 0" class="conv-empty">No conversations found</div>
              </div>
            </aside>

            <!-- Chat Thread -->
            <section class="chat-thread" v-if="activeContact">
              <!-- Thread Header -->
              <div class="thread-header">
                <div class="thread-avatar-wrap">
                  <img :src="activeContact.avatar" :alt="activeContact.name" class="thread-avatar-img" />
                </div>
                <div>
                  <p class="thread-name">{{ activeContact.name }}</p>
                  <p class="thread-status">
                    <span class="status-dot" :class="activeContact.online ? 'online' : 'offline'"></span>
                    {{ activeContact.online ? 'Online' : 'Offline' }} · {{ activeContact.role }}
                  </p>
                </div>
                <div class="thread-actions">
                  <button class="thread-action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span>View Profile</span>
                  </button>
                </div>
              </div>

              <!-- Messages -->
              <div class="messages-area" ref="messagesContainer">
                <div
                  v-for="(msg, i) in messages"
                  :key="i"
                  class="message-row"
                  :class="msg.sender === 'user' ? 'from-me' : 'from-them'"
                >
                  <div v-if="msg.sender !== 'user'" class="msg-avatar-wrap">
                    <img :src="activeContact.avatar" :alt="activeContact.name" class="msg-avatar-img" />
                  </div>
                  <div class="bubble" :class="msg.sender === 'user' ? 'bubble-me' : 'bubble-them'">
                    <p>{{ msg.text }}</p>
                    <span class="msg-time">
                      {{ msg.time }}
                      <span v-if="msg.sender === 'user'" class="read-tick">✓✓</span>
                    </span>
                  </div>
                </div>

                <!-- Typing indicator -->
                <div v-if="isTyping" class="message-row from-them">
                  <div class="msg-avatar-wrap">
                    <img :src="activeContact.avatar" :alt="activeContact.name" class="msg-avatar-img" />
                  </div>
                  <div class="bubble bubble-them typing-bubble">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                  </div>
                </div>
              </div>

              <!-- Input Bar -->
              <div class="input-bar">
                <button class="attach-btn" title="Attach image">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </button>
                <input
                  v-model="newMessage"
                  type="text"
                  :placeholder="'Type a message to ' + activeContact.name.split(' ')[0] + '...'"
                  @keydown.enter="sendMessage"
                  class="msg-input"
                />
                <button @click="sendMessage" class="send-btn" :disabled="!newMessage.trim()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </section>

            <!-- Empty placeholder -->
            <section class="chat-empty" v-else>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#c2c9bb" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <p>Select a conversation to start chatting</p>
            </section>

          </div>
        </div>
      </div>
    </main>

    <CommonAppFooter />
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex: 1;
  width: 100%;
  background: white;
  border-radius: 20px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05);
  overflow: hidden;
}

/* ── Conversations ── */
.conversations-panel {
  width: 300px;
  flex-shrink: 0;
  border-right: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.conv-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 18px 12px;
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}
.unread-total {
  background: #15803d;
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  min-width: 22px;
  text-align: center;
}
.conv-search {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 14px 10px;
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 10px;
  color: #9ca3af;
}
.conv-search input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #111827;
}
.conv-list {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #e4e4e7 transparent;
}
.conv-list::-webkit-scrollbar { width: 4px; }
.conv-list::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 20px; }

.conv-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
  border-left: 4px solid transparent;
}
.conv-item:hover  { background: #f9fafb; }
.conv-item.active { background: #f0fdf4; border-left-color: #15803d; }

.conv-avatar-wrap { position: relative; flex-shrink: 0; }
.conv-avatar-img  { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; }
.online-dot {
  position: absolute; bottom: 1px; right: 1px;
  width: 11px; height: 11px;
  background: #22c55e; border: 2px solid white; border-radius: 50%;
}
.conv-info { flex: 1; min-width: 0; }
.conv-top  { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
.conv-name { font-size: 13px; font-weight: 700; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
.conv-time { font-size: 10px; color: #9ca3af; flex-shrink: 0; }
.conv-time.green { color: #15803d; }
.conv-bottom { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
.conv-preview { font-size: 12px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
.conv-preview.bold { font-weight: 600; color: #111827; }
.conv-badge {
  background: #15803d; color: white;
  font-size: 10px; font-weight: 700;
  width: 18px; height: 18px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.conv-empty { text-align: center; padding: 32px 16px; font-size: 13px; color: #9ca3af; }

/* ── Thread ── */
.chat-thread { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.thread-header { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid #f3f4f6; }
.thread-avatar-wrap { flex-shrink: 0; }
.thread-avatar-img  { width: 42px; height: 42px; border-radius: 50%; object-fit: cover; }
.thread-name   { font-size: 15px; font-weight: 700; color: #111827; margin: 0; }
.thread-status {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; color: #6b7280; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.06em; margin: 3px 0 0;
}
.status-dot { width: 8px; height: 8px; border-radius: 50%; }
.status-dot.online  { background: #22c55e; }
.status-dot.offline { background: #d1d5db; }
.thread-actions { margin-left: auto; }
.thread-action-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 10px; border: 1.5px solid #e5e7eb;
  background: transparent; color: #374151;
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
  cursor: pointer; transition: all 0.2s;
}
.thread-action-btn:hover { background: #f3f4f6; border-color: #15803d; color: #15803d; }

/* ── Messages ── */
.messages-area {
  flex: 1; overflow-y: auto;
  padding: 20px; display: flex; flex-direction: column; gap: 14px;
  background: #fafafa;
  scrollbar-width: thin; scrollbar-color: #e4e4e7 transparent;
}
.messages-area::-webkit-scrollbar { width: 4px; }
.messages-area::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 20px; }

.message-row { display: flex; align-items: flex-end; gap: 8px; }
.message-row.from-me   { flex-direction: row-reverse; }
.message-row.from-them { flex-direction: row; }

.msg-avatar-wrap { flex-shrink: 0; }
.msg-avatar-img  { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; }

.bubble { max-width: 62%; padding: 10px 14px; border-radius: 18px; font-size: 14px; line-height: 1.5; }
.bubble p { margin: 0 0 4px; }
.bubble-me   { background: #15803d; color: white; border-bottom-right-radius: 4px; }
.bubble-them { background: white; color: #111827; border: 1px solid #e5e7eb; border-bottom-left-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }

.msg-time {
  font-size: 10px; opacity: 0.65;
  display: flex; align-items: center; justify-content: flex-end; gap: 3px;
}
.read-tick { color: #86efac; font-size: 11px; }

/* Typing dots */
.typing-bubble { display: flex; align-items: center; gap: 4px; padding: 12px 16px; }
.dot { width: 8px; height: 8px; background: #9ca3af; border-radius: 50%; animation: bounce 1.2s infinite; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40%           { transform: translateY(-6px); }
}

/* ── Input Bar ── */
.input-bar { display: flex; align-items: center; gap: 10px; padding: 14px 20px; border-top: 1px solid #f3f4f6; background: white; }
.attach-btn {
  width: 38px; height: 38px; border-radius: 10px; border: 1.5px solid #e5e7eb;
  background: transparent; color: #9ca3af;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; transition: all 0.2s;
}
.attach-btn:hover { color: #15803d; border-color: #15803d; }
.msg-input {
  flex: 1; border: 1.5px solid #e5e7eb; border-radius: 12px;
  padding: 10px 16px; font-size: 14px; outline: none;
  background: #f9fafb; color: #111827; transition: border-color 0.2s;
}
.msg-input:focus { border-color: #15803d; background: white; }
.send-btn {
  width: 42px; height: 42px; border-radius: 12px; border: none;
  background: #15803d; color: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; transition: opacity 0.2s, transform 0.1s;
}
.send-btn:hover:not(:disabled) { opacity: 0.88; transform: scale(1.05); }
.send-btn:disabled { background: #d1d5db; cursor: not-allowed; }

/* ── Empty ── */
.chat-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: #9ca3af; font-size: 14px; }
</style>
