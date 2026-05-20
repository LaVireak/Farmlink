<template>
  <header class="bg-cream w-full h-auto flex items-center px-8 shadow-sm border-b-2 border-gray-300">
    <div class="container mx-auto flex items-center justify-between">
      
      <!-- Logo Section -->
      <div class="flex-shrink-0">
        <NuxtLink to="/">
          <img 
            alt="Farm Link Logo" 
            class="h-20 w-auto object-contain" 
            src="assets\images\logo1.png"
          />
        </NuxtLink>
      </div>

      <!-- Navigation Section -->
      <nav class="hidden lg:flex items-center space-x-8">
        <NuxtLink to="/" class="nav-link uppercase text-xs">
          Home
        </NuxtLink>

        <!-- PRODUCT MEGA MENU (Hover Triggered) -->
        <div 
          class="relative" 
          id="product-menu"
          @mouseenter="handleProductHover(true)"
          @mouseleave="handleProductHover(false)"
        >
          <!-- Trigger Area with Padding Bridge -->
          <div class="flex items-center space-x-1 py-6 cursor-pointer">
            <NuxtLink to="/user/products" class="nav-link uppercase text-xs">Product</NuxtLink>
            <button class="flex items-center focus:outline-none" aria-label="Toggle Products">
              <svg :class="{ 'rotate-180': productOpen }" class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </button>
          </div>

          <div 
            v-show="productOpen" 
            class="absolute left-0 mt-0 w-[740px] bg-white rounded-md shadow-xl z-50 p-8 grid grid-cols-4 gap-4"
          >
            <div class="flex flex-col justify-between h-full">
              <div>
                <div class="text-xs font-bold text-gray-800 uppercase tracking-wider pb-1 mb-3">Vegetables</div>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li><NuxtLink to="/user/products?category=leafy" class="hover:text-[#1f7a2e] transition-colors">Leafy Greens</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=root" class="hover:text-[#1f7a2e] transition-colors">Root Crops</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=cruciferous" class="hover:text-[#1f7a2e] transition-colors">Cruciferous</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=all-organic" class="hover:text-[#1f7a2e] transition-colors">Organic Fresh</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=tubers" class="hover:text-[#1f7a2e] transition-colors">Tubers & Bulbs</NuxtLink></li>
                </ul>
                <NuxtLink to="/user/products?category=vegetables" class="text-xs font-bold text-[#1f7a2e] underline pt-3 mt-auto block">
                  All Vegetables 
                </NuxtLink>
              </div>
            </div>

            <!-- Column 2: Fruits -->
            <div class="flex flex-col justify-between h-full">
              <div>
                <div class="text-xs font-bold text-gray-800 uppercase tracking-wider pb-1 mb-3">Fruits</div>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li><NuxtLink to="/user/products?category=citrus" class="hover:text-[#1f7a2e] transition-colors">Citrus Fruits</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=berries" class="hover:text-[#1f7a2e] transition-colors">Berries & Melons</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=tropical" class="hover:text-[#1f7a2e] transition-colors">Tropical Fruits</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=orchard" class="hover:text-[#1f7a2e] transition-colors">Orchard Picks</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=seasonal-fruit" class="hover:text-[#1f7a2e] transition-colors">Seasonal Specials</NuxtLink></li>
                </ul>
                <NuxtLink to="/user/products?category=fruits" class="text-xs font-bold text-[#1f7a2e] underline pt-3 mt-auto block">
                  All Fruits 
                </NuxtLink>
              </div>
            </div>

            <!-- Column 3: Farm Essentials -->
            <div class="flex flex-col justify-between h-full">
              <div>
                <div class="text-xs font-bold text-gray-800 uppercase tracking-wider pb-1 mb-3">Supplies & Tools</div>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li><NuxtLink to="/user/products?category=seeds" class="hover:text-[#1f7a2e] transition-colors">Heirloom Seeds</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=seedlings" class="hover:text-[#1f7a2e] transition-colors">Starter Plantlets</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=tools" class="hover:text-[#1f7a2e] transition-colors">Hand Tools</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=fertilizer" class="hover:text-[#1f7a2e] transition-colors">Organic Soils</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=equipment" class="hover:text-[#1f7a2e] transition-colors">Irrigation Gear</NuxtLink></li>
                </ul>
                <NuxtLink to="/user/products?category=supplies" class="text-xs font-bold text-[#1f7a2e] underline pt-3 mt-auto block">
                  All Supplies 
                </NuxtLink>
              </div>
            </div>

            <!-- Column 4 (Right Side Image Banner Link) -->
            <NuxtLink to="/user/products" class="relative block w-full h-[250px] rounded overflow-hidden border border-gray-100 shadow-sm group/banner">
              <img 
                src="/assets/images/farm1.png" 
                alt="Browse All Farm Categories" 
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover/banner:scale-105" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>
              <div class="absolute left-0 right-0 bottom-0 p-3 text-white flex flex-col justify-end">
                <div class="font-bold text-xs uppercase tracking-wider">Complete Collection</div>
                <div class="text-[10px] text-gray-200 mt-0.5 mb-1.5 leading-tight">View all products across all available farm categories.</div>
                <span class="text-[11px] font-bold text-white underline group-hover/banner:text-gray-200 transition-colors">
                  Shop All Categories 
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <div class="relative" id="farm-menu">
          <button @click.stop="toggleFarm" class="flex items-center space-x-1 cursor-pointer group focus:outline-none py-6">
            <span class="nav-link uppercase text-xs">Farm</span>
            <svg :class="{ 'rotate-180': farmOpen }" class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>

          <div v-show="farmOpen" class="absolute left-0 mt-0 w-[780px] bg-white border border-gray-200 rounded-md shadow-lg z-50 p-6">
            <div class="text-xs font-bold text-gray-700 mb-2">Featured Farms</div>
            <div class="flex gap-4">
              <NuxtLink to="#" class="relative block w-[250px] h-[350px] rounded overflow-hidden border group">
                <img src="/assets/images/farm1.png" alt="Farm 1" class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
                <div class="absolute left-0 right-0 bottom-0 p-3 text-white">
                  <div class="font-semibold">Farm 1</div>
                  <div class="text-xs">Organic vegetables & seasonal produce.</div>
                </div>
              </NuxtLink>

              <NuxtLink to="#" class="relative block w-[250px] h-[350px] rounded overflow-hidden border group">
                <img src="/assets/images/farm2.png" alt="Farm 2" class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
                <div class="absolute left-0 right-0 bottom-0 p-3 text-white">
                  <div class="font-semibold">Farm 2</div>
                  <div class="text-xs">Family-run orchard and beekeeping.</div>
                </div>
              </NuxtLink>

              <NuxtLink to="#" class="relative block w-[250px] h-[350px] rounded overflow-hidden border group">
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

        <NuxtLink to="/about" class="nav-link uppercase text-xs py-6">About</NuxtLink>
        <NuxtLink to="/contacts" class="nav-link uppercase text-xs py-6">Contacts</NuxtLink>
      </nav>

      <!-- Right Utility Bar -->
      <div class="flex items-center space-x-6">

        <!-- Search Container with Dropdown -->
        <div class="relative search-container mr-4" ref="searchContainer">
          <input 
            type="text"
            v-model="searchQuery"
            @input="handleSearch"
            @focus="showDropdown = true"
            class="w-full bg-transparent border-[1px] border-black rounded-full py-1 px-4 focus:outline-none focus:ring-0 search-input" 
            placeholder="Search..." 
          />
          <button class="absolute right-4 top-1/2 -translate-y-1/2" aria-label="Search Submit">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>

          <!-- Search Dropdown -->
          <div 
            v-if="showDropdown && searchQuery.trim().length > 0"
            class="absolute top-full mt-2 w-full bg-[#FFF7DA] border border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden"
          >
            <!-- Loading -->
            <div v-if="searchLoading" class="px-4 py-3 text-sm text-gray-500 text-center">
              Searching...
            </div>

            <!-- Results -->
            <template v-else>
              <div
                v-for="item in searchResults"
                :key="item.id + item.type"
                @mousedown.prevent="goToResult(item)"
                class="flex items-center gap-3 px-4 py-3 hover:bg-[#f0e8c8] cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors group"
              >
                <!-- Left: Info -->
                <div class="flex-1 min-w-0">
                  <div class="font-bold text-sm text-gray-800 truncate">{{ item.name }}</div>
                  <div class="text-xs text-gray-500 truncate mt-0.5">{{ item.description }}</div>
                  <div class="text-xs text-gray-400 truncate mt-0.5" v-if="item.category">{{ item.category }}</div>
                </div>

                <!-- Right: Image + Badge -->
                <div class="flex-shrink-0 relative">
                  <img 
                    :src="item.image || '/assets/images/placeholder.png'" 
                    :alt="item.name"
                    class="w-14 h-14 object-cover rounded-lg border border-gray-300"
                  />
                  <!-- Type Badge -->
                  <span 
                    class="absolute -top-2 -right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-black whitespace-nowrap"
                    :class="item.type === 'farm' ? 'bg-[#1f7a2e] text-white' : 'bg-yellow-400 text-black'"
                  >
                    {{ item.type === 'farm' ? '🌿 Farm' : '🥬 Product' }}
                  </span>
                </div>
              </div>

              <!-- No results -->
              <div v-if="searchResults.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
                No results found for "{{ searchQuery }}"
              </div>
            </template>
          </div>
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

          <!-- Notifications Menu -->
          <div id="notifications-menu" class="relative inline-block">
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

        <!-- User Profile Dropdown -->
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
                    <Moon class="w-4 h-4 text-gray-600" />
                    <span>Dark Mode</span>
                  </button>
                </li>
                <li>
                  <NuxtLink to="#" class="flex items-center gap-2 px-2 py-1 hover:bg-gray-100">
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
  Moon,
  Globe,
  Bell,
  Heart,
  ShoppingCart
} from 'lucide-vue-next'

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const farmOpen = ref(false)
const productOpen = ref(false)
const userMenuOpen = ref(false)
const notificationsOpen = ref(false)

// ── Search ──────────────────────────────────────────────
const searchQuery = ref('')
const searchResults = ref([])
const showDropdown = ref(false)
const searchLoading = ref(false)
const searchContainer = ref(null)

// ── STATIC TEST DATA (remove later and replace with API) ──
const staticFarms = [
  { id: 1, name: 'Green Valley Farm', description: 'Organic vegetables & seasonal produce', category: 'Organic', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=100&h=100&fit=crop' },
  { id: 2, name: "Tom's Orchard Farm", description: 'Family-run orchard and beekeeping', category: 'Orchard', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=100&h=100&fit=crop' },
  { id: 3, name: 'Hydroponics Hub', description: 'Greenhouse-grown greens year round', category: 'Hydroponics', image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=100&h=100&fit=crop' },
  { id: 4, name: 'Sunrise Rice Farm', description: 'Traditional rice farming in the highlands', category: 'Rice', image: 'https://images.unsplash.com/photo-1536054985104-7f7d2af54c30?w=100&h=100&fit=crop' },
]

const staticProducts = [
  { id: 1, name: 'Fresh Tomato', description: 'Locally grown red tomatoes', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&h=100&fit=crop' },
  { id: 2, name: 'Cherry Tomato', description: 'Sweet bite-sized cherry tomatoes', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=100&h=100&fit=crop' },
  { id: 3, name: 'Heirloom Seeds Pack', description: 'Mixed vegetable seed collection', category: 'Seeds', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop' },
  { id: 4, name: 'Organic Fertilizer', description: 'Natural compost-based fertilizer', category: 'Supplies', image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=100&h=100&fit=crop' },
  { id: 5, name: 'Mango', description: 'Sweet tropical mangoes from local farms', category: 'Fruits', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=100&h=100&fit=crop' },
  { id: 6, name: 'Baby Spinach', description: 'Fresh tender spinach leaves', category: 'Leafy Greens', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100&h=100&fit=crop' },
]
// ──────────────────────────────────────────────────────────

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  searchLoading.value = true

  try {
    // TODO: replace with real API calls later
    // const [farms, products] = await Promise.all([
    //   $fetch(`/api/farms?q=${searchQuery.value}`),
    //   $fetch(`/api/products?q=${searchQuery.value}`)
    // ])

    const q = searchQuery.value.toLowerCase()

    const farms = staticFarms.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    )

    const products = staticProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )

    searchResults.value = [
      ...farms.map(f => ({ ...f, type: 'farm' })),
      ...products.map(p => ({ ...p, type: 'product' }))
    ]
  } catch (e) {
    searchResults.value = []
  } finally {
    searchLoading.value = false
  }
}

const goToResult = (item) => {
  showDropdown.value = false
  searchQuery.value = ''
  searchResults.value = []
  if (item.type === 'farm') navigateTo(`/user/farmer/${item.id}`)
  else navigateTo(`/user/products/${item.id}`)
}
// ────────────────────────────────────────────────────────

// Smooth Hover handler for mega menu
const handleProductHover = (status) => {
  productOpen.value = status
  if (status) {
    farmOpen.value = false
    userMenuOpen.value = false
    notificationsOpen.value = false
  }
}

const toggleFarm = () => {
  farmOpen.value = !farmOpen.value
  if (farmOpen.value) {
    productOpen.value = false
    userMenuOpen.value = false
    notificationsOpen.value = false
  }
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
  if (userMenuOpen.value) {
    farmOpen.value = false
    productOpen.value = false
    notificationsOpen.value = false
  }
}

// Notifications State
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
  document.documentElement.classList.toggle('dark')
}

const onClickOutside = (e) => {
  const farmEl = document.getElementById('farm-menu')
  const userMenuEl = document.getElementById('user-menu')
  const notificationsEl = document.getElementById('notifications-menu')

  if (farmEl && !farmEl.contains(e.target)) farmOpen.value = false
  if (userMenuEl && !userMenuEl.contains(e.target)) userMenuOpen.value = false
  if (notificationsEl && !notificationsEl.contains(e.target)) notificationsOpen.value = false

  // Close search dropdown when clicking outside
  if (searchContainer.value && !searchContainer.value.contains(e.target)) {
    showDropdown.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
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