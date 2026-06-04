<template>
    <header class="flex justify-between items-center mb-10">
        <h1 class="text-3xl font-black text-secondary">{{ title }}</h1>
        <div class="flex items-center gap-6">
            <div class="relative">
                <input type="text" placeholder="Search" class="bg-surface-container-lowest border border-outline-variant rounded-xl py-3 pl-12 pr-6 w-80 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/10 focus:border-secondary" />
                <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            
            <!-- Notifications Menu -->
            <div id="farmer-notifications-menu" class="relative inline-block mt-2 mr-2">
                <button @click.stop="toggleNotifications" class="relative flex items-center text-on-surface hover:text-secondary transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>
                    <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-error text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{{ unreadCount }}</span>
                </button>

                <div v-show="notificationsOpen" class="absolute right-0 mt-3 w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl z-50 overflow-hidden">
                    <div class="p-3 border-b border-outline-variant flex justify-between items-center bg-surface-container/30">
                        <span class="font-bold text-sm text-on-surface">Notifications</span>
                        <button @click="markAllAsRead" class="text-xs text-secondary hover:underline font-medium">Mark all read</button>
                    </div>
                    <ul class="max-h-[300px] overflow-y-auto">
                        <li v-for="note in notifications" :key="note.id" class="border-b border-outline-variant last:border-b-0">
                            <button @click="markAsRead(note.id)" class="w-full text-left p-3 hover:bg-surface-container transition-colors flex gap-3">
                                <div class="flex-1">
                                    <div class="text-sm font-bold text-on-surface" :class="{'text-on-surface-variant font-medium': note.read}">{{ note.title }}</div>
                                    <div class="text-xs text-on-surface-variant mt-1">{{ note.body }}</div>
                                    <div class="text-[10px] text-outline mt-2">{{ note.time }}</div>
                                </div>
                                <div v-if="!note.read" class="w-2 h-2 bg-secondary rounded-full mt-1.5 flex-shrink-0"></div>
                            </button>
                        </li>
                        <li v-if="notifications.length === 0" class="p-4 text-center text-sm text-on-surface-variant italic">
                            No notifications yet
                        </li>
                    </ul>
                    <div class="p-2 border-t border-outline-variant bg-surface-container/30">
                        <NuxtLink to="/farmer/notifications" class="block w-full text-center text-xs font-bold text-secondary hover:underline p-1">View all notifications</NuxtLink>
                    </div>
                </div>
            </div>
            <div class="relative" id="profile-menu">
                <button @click.stop="toggleProfile" class="flex items-center space-x-1 cursor-pointer group focus:outline-none">
                    <img src="https://i.pravatar.cc/100?img=12" class="w-10 h-10 rounded-full border-2 border-outline-variant shadow-md" />
                    <div class="text-left">
                        <p class="text-sm font-black text-on-surface flex items-center gap-1">
                            {{ fullName }}
                            <svg class="w-4 h-4 text-on-surface-variant group-hover:text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                        </p>
                    </div>
                </button>

                <div v-show="profileOpen" class="absolute right-0 mt-2 w-36 bg-surface-container-lowest border border-outline-variant rounded-md shadow-lg z-50">
                    <div class="p-3 border-b border-outline-variant">
                        <ul>
                            <li><NuxtLink to="/farmer/profile" class="block p-2 rounded-lg hover:bg-surface-container text-on-surface transition-colors">Profile</NuxtLink></li>
                            <li><NuxtLink to="/farmer/notifications" class="block p-2 rounded-lg hover:bg-surface-container text-on-surface transition-colors">Notification</NuxtLink></li>
                            <li><a href="#" @click.prevent="handleLogout" class="block p-2 rounded-lg hover:bg-error-container text-error font-medium transition-colors">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '../../stores/auth.store'
import { useRouter } from 'vue-router'
import { useNotifications } from '~/composables/useNotifications'

const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotifications()

onMounted(() => {
  fetchNotifications()
})

const props = defineProps({
    title: { type: String, default: 'Setting Profile' }
})
const { title } = props

const auth = useAuthStore()
const router = useRouter()

const user = computed(() => auth.user)
const fullName = computed(() => {
  if (!user.value) return 'Channary Sok'
  const first = user.value.firstName || ''
  const last = user.value.lastName || user.value.lastname || ''
  const name = `${first} ${last}`.trim()
  return name || user.value.email || 'Channary Sok'
})

const profileOpen = ref(false)
const notificationsOpen = ref(false)

const toggleProfile = () => {
  profileOpen.value = !profileOpen.value
  if (profileOpen.value) notificationsOpen.value = false
}

const toggleNotifications = () => {
  notificationsOpen.value = !notificationsOpen.value
  if (notificationsOpen.value) profileOpen.value = false
}

const handleLogout = async () => {
  profileOpen.value = false
  await auth.signOut()
  router.push('/auth/signin')
}

const onClickOutside = (e) => {
  const menuEl = document.getElementById('profile-menu')
  const notifEl = document.getElementById('farmer-notifications-menu')
  if (menuEl && !menuEl.contains(e.target)) {
    profileOpen.value = false
  }
  if (notifEl && !notifEl.contains(e.target)) {
    notificationsOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>