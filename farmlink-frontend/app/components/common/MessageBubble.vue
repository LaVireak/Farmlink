<template>
  <div class="message-row" :class="isSender ? 'from-me' : 'from-them'">
    <div v-if="!isSender && avatar" class="msg-avatar" :style="{ backgroundImage: `url(${avatar})` }">
      <span v-if="!avatar" class="initials">{{ senderName ? senderName.charAt(0).toUpperCase() : 'U' }}</span>
    </div>
    <div class="bubble" :class="isSender ? 'bubble-me' : 'bubble-them'">
      <p>{{ text }}</p>
      <span class="msg-time">
        {{ time }}
        <span v-if="isSender" class="read-tick">✓✓</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  isSender: {
    type: Boolean,
    required: true,
  },
  avatar: {
    type: String,
    default: undefined,
  },
  senderName: {
    type: String,
    default: undefined,
  },
})
</script>

<style scoped>
.message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.message-row.from-me {
  flex-direction: row-reverse;
}

.message-row.from-them {
  flex-direction: row;
}

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
  background-size: cover;
  background-position: center;
  background-color: #15803d;
}

.msg-avatar .initials {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;;
}

.bubble {
  max-width: 60%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

.bubble p {
  margin: 0 0 4px;
}

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

.read-tick {
  margin-left: 2px;
}
</style>
