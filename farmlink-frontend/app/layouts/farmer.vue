<template>
  <div class="farmer-layout">
    <FarmerSideBar />
    <div class="farmer-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotifications } from '~/composables/useNotifications'

const { fetchNotifications } = useNotifications()

// Initialize notifications once when the farmer layout is mounted.
// Because notifications/unreadCount are module-level singletons, this single
// call starts the SSE stream and keeps the bell badge updated across ALL
// farmer pages without each page needing to re-initialize it.
onMounted(() => {
  fetchNotifications()
})
</script>

<style scoped>
.farmer-layout {
  display: flex;
  min-height: 100vh;
}

.farmer-content {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}
</style>