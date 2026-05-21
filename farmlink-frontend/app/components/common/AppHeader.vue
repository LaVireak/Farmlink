<template>
  <header class="bg-cream w-full h-auto flex items-center px-8 shadow-sm border-b-2 border-gray-300">
    <div class="container mx-auto flex items-center justify-between">
      
      <div class="flex-shrink-0">
        <NuxtLink to="/">
          <img 
            alt="Farm Link Logo" 
            class="h-20 w-auto object-contain" 
            src="assets\images\logo1.png"
          />
        </NuxtLink>
      </div>

      <nav class="hidden lg:flex items-center space-x-8">
        <NuxtLink to="/" class="nav-link uppercase text-xs">
          Home
        </NuxtLink>

        <div class="relative" id="product-menu">
          <div class="flex items-center space-x-1">
            <button @click.stop="toggleProduct" class="flex items-center gap-1 cursor-pointer group focus:outline-none">
              <div class="nav-link uppercase text-xs"><NuxtLink to="/user/products">Product</NuxtLink></div>
              <!-- <svg :class="{ 'rotate-180': productOpen }" class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg> -->
            </button>
          </div>

          <!-- <div v-show="productOpen" class="absolute left-0 mt-3 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div class="p-3 border-b">
              <div class="text-xs font-bold text-gray-700">Categories:</div>
              <ul class="mt-2">
                <li><NuxtLink to="/user/products" class="block px-2 py-1 hover:bg-gray-100">Vegetables</NuxtLink></li>
                <li><NuxtLink to="/user/products" class="block px-2 py-1 hover:bg-gray-100">Fruits</NuxtLink></li>
                <li><NuxtLink to="/user/products" class="block px-2 py-1 hover:bg-gray-100">Seeds & Seedlings</NuxtLink></li>
                <li><NuxtLink to="/user/products" class="block px-2 py-1 hover:bg-gray-100">Tools & Equipment</NuxtLink></li>
              </ul>
            </div>
            <div class="p-3">
              <div class="text-xs font-bold text-gray-700">Popular:</div>
              <ul class="mt-2">
                <li><NuxtLink to="#" class="block px-2 py-1 hover:bg-gray-100">Best Sellers</NuxtLink></li>
                <li><NuxtLink to="#" class="block px-2 py-1 hover:bg-gray-100">New Arrivals</NuxtLink></li>
                <li><NuxtLink to="#" class="block px-2 py-1 hover:bg-gray-100">Discounted</NuxtLink></li>
              </ul>
            </div>
          </div> -->
        </div>

        <div class="relative" id="farm-menu">
          <button @click.stop="toggleFarm" class="flex items-center space-x-1 cursor-pointer group focus:outline-none">
            <span class="nav-link uppercase text-xs"><NuxtLink to="/user/farm">Farm</NuxtLink></span>
            <svg :class="{ 'rotate-180': farmOpen }" class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>

          <div v-show="farmOpen" class="absolute left-0 mt-3 w-[780px] bg-white border border-gray-200 rounded-md shadow-lg z-50 p-6">
            <div class="text-xs font-bold text-gray-700 mb-2">Featured Farms</div>
            <div class="flex gap-4">
              <NuxtLink to="#" class="relative block w-[250px] h-[400px] rounded overflow-hidden border group">
                <img src="/assets/images/farm1.png" alt="Farm 1" class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
                <div class="absolute left-0 right-0 bottom-0 p-3 text-white">
                  <div class="font-semibold">Farm 1</div>
                  <div class="text-xs">Organic vegetables & seasonal produce.</div>
                </div>
              </NuxtLink>

              <NuxtLink to="#" class="relative block w-[250px] h-[400px] rounded overflow-hidden border group">
                <img src="/assets/images/farm2.png" alt="Farm 2" class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
                <div class="absolute left-0 right-0 bottom-0 p-3 text-white">
                  <div class="font-semibold">Farm 2</div>
                  <div class="text-xs">Family-run orchard and beekeeping.</div>
                </div>
              </NuxtLink>

              <NuxtLink to="#" class="relative block w-[250px] h-[400px] rounded overflow-hidden border group">
                <img src="/assets/images/farm3.png" alt="Farm 3" class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
                <div class="absolute left-0 right-0 bottom-0 p-3 text-white">
                  <div class="font-semibold">Farm 3</div>
                  <div class="text-xs">Hydroponics and greenhouse-grown greens.</div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <NuxtLink to="/about" class="nav-link uppercase text-xs">About</NuxtLink>
        <NuxtLink to="/contacts" class="nav-link uppercase text-xs">Contacts</NuxtLink>
      </nav>

      <div class="flex items-center space-x-6">
        <div class="relative search-container mr-4">
          <input 
            type="text"
            class="w-full bg-transparent border-[1px] border-black rounded-full py-1 px-4 focus:outline-none focus:ring-0 search-input" 
            placeholder="Search..." 
          />
          <button class="absolute right-4 top-1/2 -translate-y-1/2">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>
        </div>

        <div class="flex items-center space-x-5 text-black gap-3">
          <NuxtLink to="/user/favorites" aria-label="Favorites" class="flex items-center">
            <Heart class="w-6 h-6 text-black" />
          </NuxtLink>
          <button aria-label="Shopping Cart" class="flex items-center">
            <NuxtLink to="/user/checkout/cart" class="flex items-center">
              <ShoppingCart class="w-6 h-6 text-black" />
            </NuxtLink>
          </button>
          <div id="notifications-menu" class="relative inline-block ">
            <button @click.stop="toggleNotifications" aria-label="Notifications" class="relative flex items-center">
              <Bell class="w-6 h-6 text-black" />
              <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">{{ unreadCount }}</span>
            </button>

            <div v-show="notificationsOpen" class="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div class="p-2">
                <div class="flex items-center justify-between mb-2">
                  <div class="font-semibold text-sm">Notifications</div>
                  <button @click="markAllRead" class="text-xs text-blue-600">Mark all read</button>
                </div>

                <ul>
                  <li v-for="note in notifications" :key="note.id" class="border-b last:border-b-0">
                    <button @click="showNotification(note)" class="w-full text-left px-2 py-2 hover:bg-gray-50 flex">
                      <div class="flex-1">
                        <div class="text-sm font-medium">{{ note.title }}</div>
                        <div class="text-xs text-gray-500">{{ note.time }}</div>
                      </div>
                      <div v-if="!note.read" class="ml-2 w-2 h-2 bg-green-500 rounded-full self-center"></div>
                    </button>
                    <div v-if="selectedNotification && selectedNotification.id === note.id" class="p-2 text-sm text-gray-700 bg-gray-50">
                      {{ selectedNotification.body }}
                    </div>
                  </li>
                </ul>

                <div v-if="notifications.length === 0" class="p-2 text-sm text-gray-500">No notifications</div>
              </div>
            </div>
          </div>
        </div>

        

        <!-- User Menu -->
        <div class="relative" id="user-menu">
          <button @click.stop="toggleUserMenu" class="bg-[#1f7a2e] text-white px-[6px] py-[6px] ml-4 mr-8 rounded-full border-2 border-black nav-link uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1 transition-all">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
            </svg>
          </button>
          <div v-show="userMenuOpen" class="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div class="p-2 border-b">
              <ul>
                <li>
                  <NuxtLink to="/user/settings/profile" class="flex items-center gap-2 px-2 py-1 hover:bg-gray-100">
                    <Settings class="w-4 h-4 text-gray-600" />
                    <span>Settings</span>
                  </NuxtLink>
                </li>

                <li>
                  <button class="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100">
                    <Globe class="w-4 h-4 text-gray-600" />
                    <span>Language</span>
                  </button>
                </li>

                <li>
                  <button @click="toggleDarkMode" class="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100">
                    <Moon class="w-4 h-4 text-gray- 600" />
                    <span>Dark Mode</span>
                  </button>
                </li>

                <li>
                  <NuxtLink to="/auth/signin" class="flex items-center gap-2 px-2 py-1 hover:bg-gray-100">
                    <Users class="w-4 h-4 text-gray-600" />
                    <span>Sign In</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>



      </div>
    </div>
  </header>
</template>

<script setup>

import {
  Users,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  Globe,
  Bell,
  Heart,
  ShoppingCart
} from 'lucide-vue-next'


import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '../../stores/auth.store'
import { useRouter } from 'vue-router'

const farmOpen = ref(false)
const productOpen = ref(false)
const userMenuOpen = ref(false)

const toggleFarm = () => {
  farmOpen.value = !farmOpen.value
  if (farmOpen.value) {
    productOpen.value = false
    userMenuOpen.value = false
  }
}

const toggleProduct = () => {
  productOpen.value = !productOpen.value
  if (productOpen.value) {
    farmOpen.value = false
    userMenuOpen.value = false
  }
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
  if (userMenuOpen.value) {
    farmOpen.value = false
    productOpen.value = false
  }
}

// Notifications (local UI, no routing)
const notificationsOpen = ref(false)
const notifications = ref([
  { id: 1, title: 'New order received', body: 'Order #123 has been placed.', time: '2h ago', read: false },
  { id: 2, title: 'Message from Farmer John', body: 'Can you deliver extra potatoes?', time: '1d ago', read: false }
])
const selectedNotification = ref(null)
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const toggleNotifications = () => {
  notificationsOpen.value = !notificationsOpen.value
  if (notificationsOpen.value) {
    farmOpen.value = false
    productOpen.value = false
    userMenuOpen.value = false
  }
}

function showNotification(note) {
  selectedNotification.value = note
  note.read = true
}

function markAllRead() {
  notifications.value.forEach(n => (n.read = true))
}

function toggleDarkMode() {
  // simple toggle: add/remove 'dark' class on html element; replace with your theme logic
  document.documentElement.classList.toggle('dark')
}

const onClickOutside = (e) => {
  const farmEl = document.getElementById('farm-menu')
  const productEl = document.getElementById('product-menu')
  const userMenuEl = document.getElementById('user-menu')
  const notificationsEl = document.getElementById('notifications-menu')
  if (farmEl && !farmEl.contains(e.target)) farmOpen.value = false
  if (productEl && !productEl.contains(e.target)) productOpen.value = false
  if (userMenuEl && !userMenuEl.contains(e.target)) userMenuOpen.value = false
  if (notificationsEl && !notificationsEl.contains(e.target)) notificationsOpen.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))

// Auth integration
const auth = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => auth.isAuthenticated)
const user = computed(() => auth.user)

const userInitials = computed(() => {
  if (!user.value) return ''
  const f = user.value.firstName ?? ''
  const l = user.value.lastName ?? ''
  if (f || l) return `${(f[0] ?? '').toUpperCase()}${(l[0] ?? '').toUpperCase()}`
  return user.value.email?.slice(0, 2).toUpperCase() ?? ''
})

const userAvatar = computed(() => {
  // If you store avatar URLs in user metadata, return it here. Fallback to null.
  return null
})

const avatarClass = computed(() => {
  return 'bg-[#1f7a2e] text-white'
})

const goToDashboard = () => {
  if (!user.value) return
  userMenuOpen.value = false
  if (user.value.role === 'farmer') return router.push('/farmer/dashboard')
  if (user.value.role === 'admin') return router.push('/admin/dashboard')
  return router.push('/')
}

const handleSignOut = async () => {
  userMenuOpen.value = false
  await auth.signOut()
  router.push('/auth/signin')
}
</script>

<style scoped>
/* Scoped ensures these styles don't leak to other components */
.bg-cream {
  background-color: #FFF7DA;
}
.search-container {
  width: 320px;
}
.nav-link {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.search-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
  font-style: italic;
}
</style>
