<template>
  <div class="dashboard-layout">
    <FarmerSideBar />

    <main class="chat-main">
      <FarmerHeader title="Customer Chat" />

      <div class="chat-container">
        <!-- Conversations List -->
        <aside class="conversations-panel">
          <div class="conv-header">
            <h2>Conversations</h2>
            <span class="unread-total">{{ totalUnread }}</span>
          </div>

          <div class="conv-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input v-model="search" type="text" placeholder="Search customers..." />
          </div>

          <div class="conv-list">
            <button
              v-for="conv in filteredConversations"
              :key="conv.id"
              class="conv-item"
              :class="{ active: activeConvId === conv.id }"
              @click="selectConversation(conv)"
            >
              <div class="conv-avatar" :style="{ background: conv.color }">
                {{ conv.name[0].toUpperCase() }}
              </div>
              <div class="conv-info">
                <div class="conv-top">
                  <span class="conv-name">{{ conv.name }}</span>
                  <span class="conv-time">{{ conv.lastTime }}</span>
                </div>
                <div class="conv-bottom">
                  <span class="conv-preview">{{ conv.lastMessage }}</span>
                  <span v-if="conv.unread > 0" class="conv-badge">{{ conv.unread }}</span>
                </div>
              </div>
            </button>

            <div v-if="filteredConversations.length === 0" class="conv-empty">
              No conversations found
            </div>
          </div>
        </aside>

        <!-- Chat Thread -->
        <section class="chat-thread" v-if="activeConv">
          <!-- Thread Header -->
          <div class="thread-header">
            <div class="thread-avatar" :style="{ background: activeConv.color }">
              {{ activeConv.name[0].toUpperCase() }}
            </div>
            <div>
              <p class="thread-name">{{ activeConv.name }}</p>
              <p class="thread-status">
                <span class="status-dot" :class="activeConv.online ? 'online' : 'offline'"></span>
                {{ activeConv.online ? 'Online' : 'Offline' }}
              </p>
            </div>
            <div class="thread-actions">
              <button title="View Order" class="thread-action-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div class="messages-area" ref="messagesArea">
            <div v-for="(msg, i) in activeMessages" :key="i" class="message-row" :class="msg.sender === 'farmer' ? 'from-me' : 'from-them'">
              <div v-if="msg.sender !== 'farmer'" class="msg-avatar" :style="{ background: activeConv.color }">
                {{ activeConv.name[0].toUpperCase() }}
              </div>
              <div class="bubble" :class="msg.sender === 'farmer' ? 'bubble-me' : 'bubble-them'">
                <p>{{ msg.text }}</p>
                <span class="msg-time">{{ msg.time }}</span>
              </div>
            </div>

            <!-- Typing indicator -->
            <div v-if="isTyping" class="message-row from-them">
              <div class="msg-avatar" :style="{ background: activeConv.color }">{{ activeConv.name[0] }}</div>
              <div class="bubble bubble-them typing-bubble">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              </div>
            </div>
          </div>

          <!-- Input Bar -->
          <div class="input-bar">
            <button class="attach-btn" title="Attach file">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>
            <input
              v-model="newMessage"
              type="text"
              placeholder="Type a message..."
              @keydown.enter="sendMessage"
              class="msg-input"
            />
            <button
              @click="sendMessage"
              class="send-btn"
              :disabled="!newMessage.trim()"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </section>

        <!-- Empty Thread Placeholder -->
        <section class="chat-empty" v-else>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#c2c9bb" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <p>Select a conversation to start chatting</p>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

useHead({ title: 'Chat | FarmLink Farmer' })

// ── Mock conversations (replace with API later) ──────────────────
const conversations = ref([
  {
    id: 1, name: 'Sokha Meas', color: '#2d6a4f', online: true,
    lastMessage: 'Can I get 5kg delivered?', lastTime: '2m ago', unread: 2,
    messages: [
      { sender: 'user',   text: 'Hello! Are the heirloom tomatoes available?', time: '10:30 AM' },
      { sender: 'farmer', text: 'Yes, we have fresh stock harvested this morning!', time: '10:32 AM' },
      { sender: 'user',   text: 'Can I get 5kg delivered?', time: '10:35 AM' },
    ],
  },
  {
    id: 2, name: 'Rathana Chea', color: '#b45309', online: false,
    lastMessage: 'Thank you so much!', lastTime: '1h ago', unread: 0,
    messages: [
      { sender: 'user',   text: 'Is the Kampot pepper still in stock?', time: '9:00 AM' },
      { sender: 'farmer', text: 'Yes! Premium batch just packed.', time: '9:05 AM' },
      { sender: 'user',   text: 'Thank you so much!', time: '9:06 AM' },
    ],
  },
  {
    id: 3, name: 'Piseth Keo', color: '#1e40af', online: true,
    lastMessage: 'When will it be ready?', lastTime: '3h ago', unread: 1,
    messages: [
      { sender: 'user', text: 'I placed order #FL-9021 yesterday.', time: '8:00 AM' },
      { sender: 'user', text: 'When will it be ready?', time: '8:01 AM' },
    ],
  },
])

const search = ref('')
const activeConvId = ref<number | null>(null)
const newMessage = ref('')
const messagesArea = ref<HTMLElement | null>(null)
const isTyping = ref(false)

// ── WebSocket (connect to backend when ready) ─────────────────────
let ws: WebSocket | null = null;

function connectWebSocket() {
  // TODO: Replace with your backend WS URL e.g. ws://localhost:3001/chat
  // ws = new WebSocket('ws://localhost:3001/chat')
  // ws.onmessage = (event) => {
  //   const data = JSON.parse(event.data)
  //   if (data.conversationId === activeConvId.value) {
  //     activeMessages.value.push({ sender: 'user', text: data.text, time: formatTime() })
  //     scrollToBottom()
  //   }
  // }
}

// ── Computed ──────────────────────────────────────────────────────
const filteredConversations = computed(() =>
  conversations.value.filter(c =>
    c.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

const totalUnread = computed(() =>
  conversations.value.reduce((sum, c) => sum + c.unread, 0)
)

const activeConv = computed(() =>
  conversations.value.find(c => c.id === activeConvId.value) ?? null
)

const activeMessages = computed(() => activeConv.value?.messages ?? [])

// ── Actions ───────────────────────────────────────────────────────
function selectConversation(conv: any) {
  activeConvId.value = conv.id
  conv.unread = 0
  nextTick(scrollToBottom)
}

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function sendMessage() {
  const text = newMessage.value.trim()
  if (!text || !activeConv.value) return

  activeConv.value.messages.push({ sender: 'farmer', text, time: formatTime() })
  activeConv.value.lastMessage = text
  activeConv.value.lastTime = 'Just now'
  newMessage.value = ''

  // TODO: send via WebSocket
  // ws?.send(JSON.stringify({ conversationId: activeConvId.value, text, sender: 'farmer' }))

  // Simulate user typing reply (remove when WS is connected)
  simulateReply()
  nextTick(scrollToBottom)
}

function simulateReply() {
  isTyping.value = true
  setTimeout(() => {
    isTyping.value = false
    activeConv.value?.messages.push({
      sender: 'user',
      text: 'Got it, thanks! 🙏',
      time: formatTime(),
    })
    nextTick(scrollToBottom)
  }, 2000)
}

function scrollToBottom() {
  if (messagesArea.value) {
    messagesArea.value.scrollTop = messagesArea.value.scrollHeight
  }
}

onMounted(connectWebSocket)
onUnmounted(() => { if (ws) ws.close() })
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7f3;
  font-family: 'DM Sans', 'Inter', sans-serif;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Chat Container ── */
.chat-container {
  display: flex;
  flex: 1;
  gap: 0;
  height: calc(100vh - 72px);
  overflow: hidden;
  margin: 0 24px 24px;
  background: white;
  border-radius: 20px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05);
}

/* ── Conversations Panel ── */
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
}

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
}

.conv-item:hover { background: #f9fafb; }
.conv-item.active { background: #f0fdf4; }

.conv-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: white;
  font-weight: 700;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.conv-info { flex: 1; min-width: 0; }

.conv-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.conv-name { font-size: 14px; font-weight: 600; color: #111827; }
.conv-time { font-size: 11px; color: #9ca3af; }

.conv-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conv-preview {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.conv-badge {
  background: #15803d;
  color: white;
  font-size: 10px;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.conv-empty {
  text-align: center;
  padding: 32px 16px;
  font-size: 13px;
  color: #9ca3af;
}

/* ── Chat Thread ── */
.chat-thread {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.thread-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.thread-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: white;
  font-weight: 700;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.thread-name { font-size: 15px; font-weight: 700; color: #111827; margin: 0; }

.thread-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #6b7280;
  margin: 2px 0 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.status-dot.online  { background: #22c55e; }
.status-dot.offline { background: #d1d5db; }

.thread-actions { margin-left: auto; }

.thread-action-btn {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  border: 1.5px solid #e5e7eb;
  background: transparent;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.thread-action-btn:hover { background: #f3f4f6; color: #111827; }

/* ── Messages ── */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #fafafa;
}

.message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.message-row.from-me  { flex-direction: row-reverse; }
.message-row.from-them { flex-direction: row; }

.msg-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: white;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bubble {
  max-width: 60%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.5;
  position: relative;
}

.bubble p { margin: 0 0 4px; }

.bubble-me {
  background: #15803d;
  color: white;
  border-bottom-right-radius: 4px;
}

.bubble-them {
  background: white;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 4px;
}

.msg-time {
  font-size: 10px;
  opacity: 0.6;
  display: block;
  text-align: right;
}

/* Typing indicator */
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  animation: bounce 1.2s infinite;
}
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40%           { transform: translateY(-6px); }
}

/* ── Input Bar ── */
.input-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid #f3f4f6;
  background: white;
}

.attach-btn {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1.5px solid #e5e7eb;
  background: transparent;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
}
.attach-btn:hover { color: #2d6a4f; border-color: #2d6a4f; }

.msg-input {
  flex: 1;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 14px;
  outline: none;
  background: #f9fafb;
  color: #111827;
  transition: border-color 0.2s;
}
.msg-input:focus { border-color: #15803d; background: white; }

.send-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: none;
  background: #15803d;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.2s, transform 0.1s;
}
.send-btn:hover:not(:disabled) { opacity: 0.88; transform: scale(1.05); }
.send-btn:disabled { background: #d1d5db; cursor: not-allowed; }

/* ── Empty Thread ── */
.chat-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #9ca3af;
  font-size: 14px;
}
</style>
