<template>
	<div class="min-h-screen flex flex-col bg-[#fbf9f6] text-zinc-900">
		<CommonAppHeader />

		<main class="max-w-[1550px] mx-auto w-full pt-16 sm:pt-16 pb-16 px-4 sm:px-16 lg:px-8 flex-1">
			<div class="flex flex-col md:flex-row gap-8 md:gap-10">
				<CommonAppSidebar active="notifications" />

				<div class="flex-1 min-w-0">
					<header class="mb-8 sm:mb-10">
						<p class="text-[#006e1c] font-extrabold text-[10px] uppercase tracking-[0.2em] mb-3">Account Management</p>
						<h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#154212] font-[Manrope,sans-serif] tracking-tight">Notifications</h1>
					</header>

					<!-- Toolbar Row -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
						<div class="flex items-center gap-3 bg-white rounded-xl p-1 border border-zinc-200 shadow-sm">
							<button 
								v-for="tab in ['All', 'Orders', 'Messages', 'System']" 
								:key="tab"
								@click="activeTab = tab"
								:class="[
									'px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
									activeTab === tab ? 'bg-[#154212] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
								]"
							>
								{{ tab }}
							</button>
						</div>

						<button 
							v-if="hasUnread"
							@click="markAllAsRead"
							class="text-xs font-extrabold text-[#006e1c] hover:text-[#154212] transition-colors border-b-2 border-transparent hover:border-[#006e1c]"
						>
							Mark all as read
						</button>
					</div>

					<!-- Notification Inbox List -->
					<div class="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
						<div class="divide-y divide-zinc-100">
							<div 
								v-for="noti in filteredNotifications" 
								:key="noti.id"
								:class="[
									'p-5 transition-all duration-200 flex items-start gap-4',
									noti.unread ? 'bg-[#f0fdf4]/50' : 'hover:bg-zinc-50/50'
								]"
							>
								<!-- Status Indicator Dot -->
								<span 
									class="mt-2 block w-2.5 h-2.5 rounded-full flex-shrink-0 cursor-pointer"
									:class="noti.unread ? 'bg-[#006e1c] ring-4 ring-green-100' : 'bg-transparent border border-zinc-300'"
									@click="toggleRead(noti.id)"
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
								<div class="flex-1">
									<div class="flex items-start justify-between gap-4">
										<div>
											<h4 class="text-sm font-bold text-zinc-900 leading-tight">{{ noti.title }}</h4>
											<p class="text-xs text-zinc-500 mt-1 leading-relaxed">{{ noti.body }}</p>
										</div>
										<span class="text-[10px] font-semibold text-zinc-400 whitespace-nowrap">{{ noti.time }}</span>
									</div>

									<!-- Contextual Actions -->
									<div class="mt-4 flex items-center gap-3">
										<button 
											v-if="noti.actionText"
											@click="performAction(noti)"
											class="px-4 py-1.5 bg-[#006e1c] hover:bg-[#154212] text-white text-[11px] font-bold rounded-lg transition-all active:scale-95 shadow-sm"
										>
											{{ noti.actionText }}
										</button>
										<button 
											@click="deleteNotification(noti.id)"
											class="px-3 py-1.5 border border-zinc-200 hover:border-red-200 hover:text-red-600 rounded-lg text-[10px] font-bold text-zinc-500 transition-all"
										>
											Dismiss
										</button>
									</div>
								</div>
							</div>

							<div 
								v-if="filteredNotifications.length === 0" 
								class="text-center py-20 text-sm text-zinc-400 font-medium bg-zinc-50/20"
							>
								Your notification buffer is completely clear.
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>

		<CommonAppFooter />
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '~/composables/useNotifications'
import CommonAppHeader from '~/components/common/AppHeader.vue'
import CommonAppSidebar from '~/components/common/AppSidebar.vue'
import CommonAppFooter from '~/components/common/AppFooter.vue'

definePageMeta({
	middleware: 'user',
	layout: 'user'
})

const router = useRouter()
const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead: markAllAsReadApi } = useNotifications()

const activeTab = ref('All')

onMounted(() => {
	fetchNotifications()
})

const mappedNotifications = computed(() => {
	return notifications.value.map(n => {
		let category = 'System';
		let actionText = null;

		// The backend types are typically NEW_MESSAGE, ORDER_CONFIRMED, ORDER_PLACED, etc.
		if (n.type === 'NEW_MESSAGE' || n.type === 'new_message') {
			category = 'Messages';
			actionText = 'View Message';
		} else if (n.type === 'ORDER_CONFIRMED' || n.type?.toLowerCase().includes('order')) {
			category = 'Orders';
			actionText = 'View Order';
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

function toggleRead(id) {
	markAsRead(id)
}

function markAllAsRead() {
	markAllAsReadApi()
}

function deleteNotification(id) {
	// Temporarily hide locally. If backend has delete API, call it here.
	notifications.value = notifications.value.filter(n => n.id !== id)
}

function performAction(noti) {
	if (noti.category === 'Orders') {
		if (noti.refId) {
			router.push(`/user/settings/orders/${noti.refId}`);
		} else {
			router.push(`/user/settings/orders`);
		}
	} else if (noti.category === 'Messages') {
		router.push('/user/settings/chat');
	}
	toggleRead(noti.id);
}
</script>

<style scoped>
.material-symbols-outlined {
	font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20;
}
</style>