<template>
    <header class="flex justify-between items-center mb-10">
        <h1 class="text-3xl font-black text-secondary">{{ title }}</h1>
        <div class="flex items-center gap-6">
            <div class="relative">
                <input type="text" placeholder="Search" class="bg-surface-container-lowest border border-outline-variant rounded-xl py-3 pl-12 pr-6 w-80 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/10 focus:border-secondary" />
                <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <div class="relative" id="profile-menu">
                <button @click.stop="toggleProfile" class="flex items-center space-x-1 cursor-pointer group focus:outline-none">
                    <img src="https://i.pravatar.cc/100?img=12" class="w-10 h-10 rounded-full border-2 border-outline-variant shadow-md" />
                    <div class="text-left">
                        <p class="text-sm font-black text-on-surface flex items-center gap-1">
                            {{ fullName }}
                            <svg :class="['w-4 h-4 text-on-surface-variant group-hover:text-secondary transition-transform duration-300', profileOpen && 'rotate-180']" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                        </p>
                    </div>
                </button>

                <Transition
                    enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0 scale-95"
                    enter-to-class="opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-150"
                    leave-from-class="opacity-100 scale-100"
                    leave-to-class="opacity-0 scale-95">
                    <div v-show="profileOpen" class="absolute right-0 mt-2 w-36 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-50 origin-top-right">
                        <div class="p-2">
                            <ul class="space-y-1">
                                <li><NuxtLink to="/admin/settings/profile" class="block px-3 py-2 hover:bg-surface-container rounded-xl transition-colors duration-150 text-on-surface">Profile</NuxtLink></li>
                                <li><NuxtLink to="/admin/settings/security" class="block px-3 py-2 hover:bg-surface-container rounded-xl transition-colors duration-150 text-on-surface">Security</NuxtLink></li>
                                <li><NuxtLink to="/admin/settings/appearance" class="block px-3 py-2 hover:bg-surface-container rounded-xl transition-colors duration-150 text-on-surface">Appearance</NuxtLink></li>
                                <li><NuxtLink to="/admin/settings/team" class="block px-3 py-2 hover:bg-surface-container rounded-xl transition-colors duration-150 text-on-surface">Team</NuxtLink></li>
                                <li><a href="#" @click.prevent="handleLogout" class="block px-3 py-2 hover:bg-error-container rounded-xl transition-colors duration-150 text-error font-medium">Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '../../stores/auth.store'
import { useRouter } from 'vue-router'

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

const toggleProfile = () => {
    profileOpen.value = !profileOpen.value
}

const handleLogout = async () => {
  profileOpen.value = false
  await auth.signOut()
  router.push('/auth/signin')
}

const onClickOutside = (e) => {
    const menuEl = document.getElementById('profile-menu')
    if (menuEl && !menuEl.contains(e.target)) {
        profileOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', onClickOutside)
})
</script>