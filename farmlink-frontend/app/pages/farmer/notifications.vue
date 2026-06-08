<template>
	<main class="flex-1 bg-surface px-6 py-8 md:px-10 min-h-screen font-sans antialiased">

		<!-- Page Header via FarmerHeader -->
		<div class="mb-8 pb-5 border-b border-outline-variant/50">
			<FarmerHeader title="Notifications" />
		</div>

		<!-- Toolbar Row -->
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
			<div class="flex items-center gap-2 bg-surface-container-lowest rounded-xl p-1 border border-outline-variant shadow-sm">
				<button
					v-for="tab in ['All', 'Orders', 'Messages', 'Platform']"
					:key="tab"
					@click="activeTab = tab"
					:class="[
						'px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
						activeTab === tab
							? 'bg-secondary text-white shadow-sm'
							: 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
					]"
				>
					{{ tab }}
					<span
						v-if="tabCounts[tab] > 0 && activeTab !== tab"
						class="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-error text-white text-[9px] font-black rounded-full"
					>{{ tabCounts[tab] }}</span>
				</button>
			</div>

			<button
				v-if="hasUnread"
				@click="markAllAsRead"
				class="text-xs font-extrabold text-secondary hover:text-secondary/70 transition-colors border-b-2 border-transparent hover:border-secondary"
			>
				Mark all as read
			</button>
		</div>

		<!-- Empty State -->
		<div
			v-if="filteredNotifications.length === 0"
			class="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm py-24 flex flex-col items-center justify-center gap-4"
		>
			<div class="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center">
				<svg class="w-8 h-8 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
				</svg>
			</div>
			<p class="text-sm font-semibold text-on-surface-variant">No notifications here</p>
			<p class="text-xs text-outline">You're all caught up!</p>
		</div>

		<!-- Notification Inbox List -->
		<div v-else class="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
			<div class="divide-y divide-outline-variant/50">
				<div
					v-for="noti in filteredNotifications"
					:key="noti.id"
					:class="[
						'p-5 transition-all duration-200 flex items-start gap-4',
						noti.unread ? 'bg-secondary-container/20' : 'hover:bg-surface-container/50'
					]"
				>
					<!-- Status Indicator Dot -->
					<span
						class="mt-2 block w-2.5 h-2.5 rounded-full flex-shrink-0 cursor-pointer transition-all"
						:class="noti.unread ? 'bg-secondary ring-4 ring-secondary/10' : 'bg-transparent border border-outline'"
						@click="toggleRead(noti.id)"
						:title="noti.unread ? 'Mark as read' : 'Already read'"
					></span>

					<!-- Type Icon Badge -->
          <div 
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="[
              noti.category === 'Orders' ? 'bg-green-50 text-[#006e1c]' :
              noti.category === 'Messages' ? 'bg-blue-50 text-blue-600' :
              'bg-zinc-100 text-zinc-600'
            ]"
          >
            <!-- Order Icon -->
            <span v-if="noti.category === 'Orders'" class="material-symbols-outlined text-[20px]">local_shipping</span>
            <!-- Message Icon -->
            <span v-else-if="noti.category === 'Messages'" class="material-symbols-outlined text-[20px]">chat</span>
            <!-- System Update Icon -->
            <span v-else class="material-symbols-outlined text-[20px]">notifications</span>
          </div>

					<!-- Notification Contents -->
					<div class="flex-1 min-w-0">
						<div class="flex items-start justify-between gap-4">
							<div class="min-w-0">
								<h4
									class="text-sm leading-tight"
									:class="noti.unread ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'"
								>{{ noti.title }}</h4>
								<p class="text-xs text-on-surface-variant mt-1 leading-relaxed">{{ noti.body }}</p>
							</div>
							<span class="text-[10px] font-semibold text-outline whitespace-nowrap flex-shrink-0">{{ noti.time }}</span>
						</div>

						<!-- Contextual Actions -->
						<div class="mt-4 flex items-center gap-3">
							<button
								v-if="noti.actionText"
								@click="performAction(noti)"
								class="px-4 py-1.5 bg-secondary hover:bg-secondary/80 text-white text-[11px] font-bold rounded-lg transition-all active:scale-95 shadow-sm"
							>
								{{ noti.actionText }}
							</button>
							<button
								@click="deleteNotification(noti.id)"
								class="px-3 py-1.5 border border-outline-variant hover:border-error/40 hover:text-error rounded-lg text-[10px] font-bold text-on-surface-variant transition-all"
							>
								Dismiss
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '~/composables/useNotifications'

definePageMeta({
	middleware: 'farmer',
	layout: 'farmer'
})

useHead({
	title: 'Notifications | FarmLink Farmer'
})

const router = useRouter()
const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead: markAllAsReadApi } = useNotifications()

const activeTab = ref('All')

onMounted(() => {
	fetchNotifications()
})

const mappedNotifications = computed(() => {
	return notifications.value.map(n => {
		let category = 'Platform'
		let actionText = null

		if (n.type === 'NEW_MESSAGE' || n.type === 'new_message') {
			category = 'Messages'
			actionText = 'View Message'
		} else if (n.type === 'ORDER_PLACED' || n.type === 'order_placed') {
			category = 'Orders'
			actionText = 'View Order'
		} else if (n.type === 'ORDER_CONFIRMED' || n.type?.toLowerCase().includes('order')) {
			category = 'Orders'
			actionText = 'View Order'
		}

		return {
			...n,
			category,
			unread: !n.read,
			actionText
		}
	})
})

const hasUnread = computed(() => unreadCount.value > 0)

const filteredNotifications = computed(() => {
	if (activeTab.value === 'All') return mappedNotifications.value
	return mappedNotifications.value.filter(n => n.category === activeTab.value)
})

const tabCounts = computed(() => {
	const counts = { All: 0, Orders: 0, Messages: 0, Platform: 0 }
	mappedNotifications.value.forEach(n => {
		if (n.unread) {
			counts.All++
			if (counts[n.category] !== undefined) counts[n.category]++
		}
	})
	return counts
})

function toggleRead(id) {
	markAsRead(id)
}

function markAllAsRead() {
	markAllAsReadApi()
}

function deleteNotification(id) {
	notifications.value = notifications.value.filter(n => n.id !== id)
}

function performAction(noti) {
	if (noti.category === 'Orders') {
		router.push(noti.refId ? `/farmer/orders?id=${noti.refId}` : '/farmer/orders')
	} else if (noti.category === 'Messages') {
		router.push('/farmer/chat')
	}
	toggleRead(noti.id)
}
</script>

<style scoped>
.material-symbols-outlined {
	font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20;
}
</style>