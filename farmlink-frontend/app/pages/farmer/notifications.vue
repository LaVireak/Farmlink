<template>
  <main class="flex-1 bg-[#F5F7F3] px-6 py-8 md:px-10 min-h-screen font-sans antialiased">
    <div class="mb-8 pb-5 border-b border-gray-200/50">
      <FarmerHeader title="Platform Notifications" />
    </div>

    <!-- Toolbar Row -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div class="flex items-center gap-3 bg-white rounded-xl p-1 border border-gray-200/60 shadow-xs">
        <button 
          v-for="tab in ['All', 'Deliveries', 'Inventory', 'Platform']" 
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
            activeTab === tab ? 'bg-[#2d6a4f] text-white shadow-xs' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <button 
        v-if="hasUnread"
        @click="markAllAsRead"
        class="text-xs font-extrabold text-[#2d6a4f] hover:text-[#1b4332] transition-colors border-b-2 border-transparent hover:border-[#2d6a4f]"
      >
        Mark all as read
      </button>
    </div>

    <!-- Notification Inbox List -->
    <div class="bg-white rounded-2xl border border-gray-200/50 shadow-xs overflow-hidden">
      <div class="divide-y divide-gray-100">
        <div 
          v-for="noti in filteredNotifications" 
          :key="noti.id"
          :class="[
            'p-5 transition-all duration-200 flex items-start gap-4',
            noti.unread ? 'bg-emerald-50/20' : 'hover:bg-gray-50/50'
          ]"
        >
          <!-- Status Indicator Dot -->
          <span 
            class="mt-2 block w-2.5 h-2.5 rounded-full flex-shrink-0 cursor-pointer"
            :class="noti.unread ? 'bg-[#2d6a4f] ring-4 ring-emerald-100' : 'bg-transparent border border-gray-300'"
            @click="toggleRead(noti.id)"
          ></span>

          <!-- Type Icon Badge -->
          <div 
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="[
              noti.category === 'Deliveries' ? 'bg-emerald-50 text-[#2d6a4f]' :
              noti.category === 'Inventory' ? 'bg-rose-50 text-rose-600' :
              'bg-blue-50 text-blue-600'
            ]"
          >
            <!-- Delivery Icon -->
            <svg v-if="noti.category === 'Deliveries'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <!-- Inventory Icon -->
            <svg v-else-if="noti.category === 'Inventory'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            <!-- Platform Update Icon -->
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>

          <!-- Notification Contents -->
          <div class="flex-1">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h4 class="text-sm font-bold text-gray-900 leading-tight">{{ noti.title }}</h4>
                <p class="text-xs text-gray-500 mt-1 leading-relaxed">{{ noti.body }}</p>
              </div>
              <span class="text-[10px] font-semibold text-gray-400 whitespace-nowrap">{{ noti.time }}</span>
            </div>

            <!-- Contextual Actions -->
            <div class="mt-4 flex items-center gap-3">
              <button 
                v-if="noti.actionText"
                @click="noti.actionText.includes('Restock') ? triggerRestock() : noti.actionText.includes('Approve') ? approveOrder(noti.id) : viewDetails(noti.id)"
                class="px-4 py-1.5 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-[11px] font-bold rounded-lg transition-all active:scale-95 shadow-xs"
              >
                {{ noti.actionText }}
              </button>
              <button 
                @click="deleteNotification(noti.id)"
                class="px-3 py-1.5 border border-gray-200 hover:border-rose-200 hover:text-rose-600 rounded-lg text-[10px] font-bold text-gray-500 transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>

        <div 
          v-if="filteredNotifications.length === 0" 
          class="text-center py-20 text-sm text-gray-400 font-medium bg-gray-50/20"
        >
          Your notification buffer is completely clear.
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  middleware: 'farmer',
  layout: 'farmer'
})

const activeTab = ref('All')

const notifications = ref([
  {
    id: 1,
    category: 'Deliveries',
    title: 'New Bulk Order Inbound',
    body: 'Whole Foods Hub requests immediate processing of Heirloom Carrots (20kg) allocation.',
    time: '12 minutes ago',
    unread: true,
    actionText: 'Approve Order'
  },
  {
    id: 2,
    category: 'Inventory',
    title: 'Baby Leafy Greens Threshold Breached',
    body: 'Stock reserves have fallen below 10kg. Restock required to prevent listing suspension.',
    time: '2 hours ago',
    unread: true,
    actionText: 'Restock Manifest'
  },
  {
    id: 3,
    category: 'Platform',
    title: 'Settlement Ledger Dispatched',
    body: 'Your weekly sales settlement statement has been compiled and is ready for download.',
    time: 'Yesterday',
    unread: false,
    actionText: 'Download Statement'
  },
  {
    id: 4,
    category: 'Platform',
    title: 'Supabase Authentication Node Synced',
    body: 'Global OAuth endpoints hydrated successfully. Zero latency reported.',
    time: '3 days ago',
    unread: false
  }
])

const hasUnread = computed(() => notifications.value.some(n => n.unread))

const filteredNotifications = computed(() => {
  if (activeTab.value === 'All') return notifications.value
  return notifications.value.filter(n => n.category === activeTab.value)
})

function toggleRead(id) {
  const noti = notifications.value.find(n => n.id === id)
  if (noti) noti.unread = !noti.unread
}

function markAllAsRead() {
  notifications.value.forEach(n => n.unread = false)
}

function deleteNotification(id) {
  notifications.value = notifications.value.filter(n => n.id !== id)
}

function approveOrder(id) {
  alert('Order approved and dispatched successfully.')
  deleteNotification(id)
}

function triggerRestock() {
  alert('Restock request initialized successfully.')
}

function viewDetails(id) {
  alert('Document ledger loading...')
}
</script>