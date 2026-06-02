<template>
  <header class="bg-cream w-full h-auto flex items-center px-8 shadow-sm border-b-2 border-outline">
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
          {{ t('common.home') }}
        </NuxtLink>

        <!-- PRODUCT MEGA MENU (Hover Triggered) -->
        <div 
          class="relative" 
          id="product-menu"
          @mouseenter="handleProductHover(true)"
          @mouseleave="handleProductHover(false)"
        >
            <div class="flex items-center space-x-1 py-6 cursor-pointer">
            <NuxtLink to="/user/products" class="nav-link uppercase text-xs">{{ t('common.products') }}</NuxtLink>
            <button class="flex items-center focus:outline-none" aria-label="Toggle Products">
              <svg :class="{ 'rotate-180': productOpen }" class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </button>
          </div>

          <div 
            v-show="productOpen" 
            class="absolute left-0 mt-0 w-[740px] bg-surface-container-lowest rounded-md shadow-xl z-50 p-8 grid grid-cols-4 gap-4"
          >
            <div class="flex flex-col justify-between h-full">
              <div>
                <div class="text-xs font-bold text-gray-800 uppercase tracking-wider pb-1 mb-3">{{ t('common.vegetables') }}</div>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li><NuxtLink to="/user/products?category=leafy" class="hover:text-[#1f7a2e] transition-colors">{{ t('common.leafyGreens') }}</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=root" class="hover:text-[#1f7a2e] transition-colors">{{ t('common.rootCrops') }}</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=cruciferous" class="hover:text-[#1f7a2e] transition-colors">{{ t('common.cruciferous') }}</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=all-organic" class="hover:text-[#1f7a2e] transition-colors">{{ t('common.organicFresh') }}</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=tubers" class="hover:text-[#1f7a2e] transition-colors">{{ t('common.tubersBulbs') }}</NuxtLink></li>
                </ul>
                <NuxtLink to="/user/products?category=vegetables" class="text-xs font-bold text-[#1f7a2e] underline pt-3 mt-auto block">
                  {{ t('common.allVegetables') }}
                </NuxtLink>
              </div>
            </div>

            <div class="flex flex-col justify-between h-full">
              <div>
                <div class="text-xs font-bold text-gray-800 uppercase tracking-wider pb-1 mb-3">{{ t('common.fruits') }}</div>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li><NuxtLink to="/user/products?category=citrus" class="hover:text-[#1f7a2e] transition-colors">{{ t('common.citrusFruits') }}</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=berries" class="hover:text-[#1f7a2e] transition-colors">{{ t('common.berriesMelons') }}</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=tropical" class="hover:text-[#1f7a2e] transition-colors">{{ t('common.tropicalFruits') }}</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=orchard" class="hover:text-[#1f7a2e] transition-colors">{{ t('common.orchardPicks') }}</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=seasonal-fruit" class="hover:text-[#1f7a2e] transition-colors">{{ t('common.seasonalSpecials') }}</NuxtLink></li>
                </ul>
                <NuxtLink to="/user/products?category=fruits" class="text-xs font-bold text-[#1f7a2e] underline pt-3 mt-auto block">
                  {{ t('common.allFruits') }} 
                </NuxtLink>
              </div>
            </div>

            <div class="flex flex-col justify-between h-full">
              <div>
                <div class="text-xs font-bold text-gray-800 uppercase tracking-wider pb-1 mb-3">{{ t('common.toolsEquipment') }}</div>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li><NuxtLink to="/user/products?category=seeds" class="hover:text-[#1f7a2e] transition-colors">{{ t('common.heirloomSeeds') }}</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=seedlings" class="hover:text-[#1f7a2e] transition-colors">{{ t('common.starterPlantlets') }}</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=tools" class="hover:text-[#1f7a2e] transition-colors">{{ t('common.handTools') }}</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=fertilizer" class="hover:text-[#1f7a2e] transition-colors">{{ t('common.organicSoils') }}</NuxtLink></li>
                  <li><NuxtLink to="/user/products?category=equipment" class="hover:text-[#1f7a2e] transition-colors">{{ t('common.irrigationGear') }}</NuxtLink></li>
                </ul>
                <NuxtLink to="/user/products?category=supplies" class="text-xs font-bold text-secondary underline pt-3 mt-auto block">
                  All Supplies 
                </NuxtLink>
              </div>
            </div>

            <NuxtLink to="/user/products" class="relative block w-full h-[250px] rounded overflow-hidden border border-outline-variant shadow-sm group/banner">
              <img 
                src="/assets/images/farm1.png" 
                alt="Browse All Farm Categories" 
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover/banner:scale-105" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>
              <div class="absolute left-0 right-0 bottom-0 p-3 text-white flex flex-col justify-end">
                <div class="font-bold text-xs uppercase tracking-wider">{{ t('home.browseAll') }}</div>
                <div class="text-[10px] text-gray-200 mt-0.5 mb-1.5 leading-tight">{{ t('home.heroLead') }}</div>
                <span class="text-[11px] font-bold text-white underline group-hover/banner:text-gray-200 transition-colors">
                  {{ t('common.shopAllCategories') }}
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>

        <div class="relative" id="farm-menu" @mouseenter="handleFarmHover(true)" @mouseleave="handleFarmHover(false)">
          <div class="flex items-center space-x-1 py-6 cursor-pointer">
            <NuxtLink to="/user/farm" class="nav-link uppercase text-xs">{{ t('common.farm') }}</NuxtLink>
            <button class="flex items-center focus:outline-none" aria-label="Toggle Farm">
              <svg :class="{ 'rotate-180': farmOpen }" class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </button>
          </div>

          <div v-show="farmOpen" class="absolute left-0 mt-0 w-[780px] bg-white border border-gray-200 rounded-md shadow-lg z-50 p-6">
                <div class="text-xs font-bold text-gray-700 mb-2">{{ t('common.featuredFarms') }}</div>
            <div class="flex gap-4">
              <NuxtLink to="#" class="relative block w-[250px] h-[350px] rounded overflow-hidden border group">
                <img src="/assets/images/farm1.png" alt="Farm 1" class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
                <div class="absolute left-0 right-0 bottom-0 p-3 text-white">
                  <div class="font-semibold">{{ t('common.farm1Title') }}</div>
                  <div class="text-xs">{{ t('common.farm1Desc') }}</div>
                </div>
              </NuxtLink>

              <NuxtLink to="#" class="relative block w-[250px] h-[350px] rounded overflow-hidden border group">
                <img src="/assets/images/farm2.png" alt="Farm 2" class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
                <div class="absolute left-0 right-0 bottom-0 p-3 text-white">
                  <div class="font-semibold">{{ t('common.farm2Title') }}</div>
                  <div class="text-xs">{{ t('common.farm2Desc') }}</div>
                </div>
              </NuxtLink>

              <NuxtLink to="#" class="relative block w-[250px] h-[350px] rounded overflow-hidden border group">
                <img src="/assets/images/farm3.png" alt="Farm 3" class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
                <div class="absolute left-0 right-0 bottom-0 p-3 text-white">
                  <div class="font-semibold">{{ t('common.farm3Title') }}</div>
                  <div class="text-xs">{{ t('common.farm3Desc') }}</div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <NuxtLink to="/user/about" class="nav-link uppercase text-xs py-6">{{ t('common.about') }}</NuxtLink>
        <NuxtLink to="/user/contacts" class="nav-link uppercase text-xs py-6">{{ t('common.contacts') }}</NuxtLink>
      </nav>

      <!-- Right Utility Bar -->
      <div class="flex items-center space-x-6">

        <!-- Search Container with Dropdown -->
        <div class="relative search-container mr-4" ref="searchContainer">
          <input 
            type="text"
            v-model="searchQuery"
            @input="handleSearch"
            @focus="handleFocus"
            @keydown.enter="triggerSearch"
            class="w-full bg-transparent border-[1px] border-black rounded-full py-1 px-4 focus:outline-none focus:ring-0 search-input" 
            :placeholder="t('common.search')"
          />
          <button @click="triggerSearch" class="absolute right-4 top-1/2 -translate-y-1/2" aria-label="Search Submit">
            <svg class="w-5 h-5 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>

          <!-- Search Dropdown — only shows when 2+ chars typed -->
          <div 
            v-if="showDropdown && searchQuery.trim().length >= 2"
            class="absolute top-full mt-2 w-full bg-surface-container-lowest border border-on-surface rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden"
          >
            <div v-if="searchLoading" class="px-4 py-3 text-sm text-gray-500 text-center">
              {{ t('common.searching') }}
            </div>

            <template v-else>
              <div
                v-for="item in searchResults"
                :key="item.id + item.type"
                @mousedown.prevent="goToResult(item)"
                class="flex items-center gap-3 px-4 py-3 hover:bg-secondary-container cursor-pointer border-b border-outline-variant last:border-b-0 transition-colors group"
              >
                <div class="flex-1 min-w-0">
                  <div class="font-bold text-sm text-on-surface-variant truncate">{{ item.name }}</div>
                  <div class="text-xs text-on-surface-variant truncate mt-0.5">{{ item.description }}</div>
                  <div class="text-xs text-on-surface-variant truncate mt-0.5" v-if="item.category">{{ item.category }}</div>
                </div>

                <div class="flex-shrink-0 relative">
                  <img 
                    :src="item.image || '/assets/images/placeholder.png'" 
                    :alt="item.name"
                    class="w-14 h-14 object-cover rounded-lg border border-outline"
                  />
                  <span 
                    class="absolute -top-2 -right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-on-surface whitespace-nowrap"
                    :class="item.type === 'farm' ? 'bg-secondary text-white dark:text-on-surface' : 'bg-[#EFCF4F] text-on-surface'"
                  >
                    {{ item.type === 'farm' ? '🌿 Farm' : '🥬 Product' }}
                  </span>
                </div>
              </div>

              <div v-if="searchResults.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
                {{ t('common.noResults', { query: searchQuery }) }}
              </div>
            </template>
          </div>
        </div>

        <div class="flex items-center space-x-5 text-on-surface gap-3">
          <NuxtLink to="/user/favorites" aria-label="Favorites" class="flex items-center">
            <Heart class="w-6 h-6 text-on-surface" />
          </NuxtLink>
          <button aria-label="Shopping Cart" class="flex items-center" id="header-cart-icon">
            <NuxtLink to="/user/checkout/cart" class="flex items-center relative transition-transform duration-300" :class="{ 'badge-bounce': isCartBouncing }">
              <ShoppingCart class="w-6 h-6 text-black transition-colors duration-300" :class="{ 'text-green-600': isCartBouncing }" />
              <span v-if="totalItems > 0" class="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white transition-transform duration-300" :class="{ 'scale-110': isCartBouncing }">
                {{ totalItems }}
              </span>
            </NuxtLink>
          </button>

          <!-- Teleported Container for Fly-to-Cart Particles -->
          <teleport to="body">
            <div
              v-for="p in flyingParticles"
              :key="p.id"
              class="flying-product-particle"
              :style="{
                '--start-x': `${p.startX}px`,
                '--start-y': `${p.startY}px`,
                '--end-x': `${p.endX}px`,
                '--end-y': `${p.endY}px`,
                backgroundImage: `url(${p.image})`
              }"
            ></div>
          </teleport>

          <!-- Notifications Menu -->
          <div id="notifications-menu" class="relative inline-block">
            <button @click.stop="toggleNotifications" aria-label="Notifications" class="relative flex items-center">
              <Bell class="w-6 h-6 text-on-surface" />
              <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-error text-white dark:text-on-surface text-xs rounded-full px-1.5">{{ unreadCount }}</span>
            </button>

            <div v-show="notificationsOpen" class="absolute right-0 mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-md shadow-lg z-50">
              <div class="p-2">
                <div class="flex items-center justify-between mb-2">
                  <div class="font-semibold text-sm">Notifications</div>
                  <button @click="markAllRead" class="text-xs text-secondary">Mark all read</button>
                </div>

                <ul>
                  <li v-for="note in notifications" :key="note.id" class="border-b last:border-b-0">
                    <button @click="showNotification(note)" class="w-full text-left px-2 py-2 hover:bg-surface-container-lowflex">
                      <div class="flex-1">
                        <div class="text-sm font-medium">{{ note.title }}</div>
                        <div class="text-xs text-on-surface-variant">{{ note.time }}</div>
                      </div>
                      <div v-if="!note.read" class="ml-2 w-2 h-2 bg-secondary rounded-full self-center"></div>
                    </button>
                    <div v-if="selectedNotification && selectedNotification.id === note.id" class="p-2 text-sm text-on-surface-variant bg-surface-container-low">
                      {{ selectedNotification.body }}
                    </div>
                  </li>
                </ul>

                <div v-if="notifications.length === 0" class="p-2 text-sm text-on-surface-variant">No notifications</div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Profile Dropdown -->
        <div class="relative" id="user-menu">
          <!-- Avatar button: photo → initials → person icon -->
          <button
            @click.stop="toggleUserMenu"
            class="bg-[#1f7a2e] text-white px-[6px] py-[6px] ml-4 mr-8 rounded-full border-2 border-black nav-link uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1 transition-all overflow-hidden"
          >
            <!-- Social login: real profile photo -->
            <img
              v-if="userAvatar"
              :src="userAvatar"
              alt="Profile"
              class="w-7 h-7 rounded-full object-cover"
              referrerpolicy="no-referrer"
            />
            <!-- Email/password login: initials -->
            <span
              v-else-if="isAuthenticated && userInitials"
              class="w-7 h-7 flex items-center justify-center text-sm font-bold rounded-full"
            >
              {{ userInitials }}
            </span>
            <!-- Not logged in: default person icon -->
            <svg
              v-else
              class="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
            </svg>
          </button>

          <div v-show="userMenuOpen" class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <!-- User info strip when logged in -->
            <div v-if="isAuthenticated" class="px-3 py-2 border-b bg-gray-50">
              <p class="text-xs font-semibold text-gray-800 truncate">
                {{ user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user?.email }}
              </p>
              <p class="text-[10px] text-gray-400 truncate">{{ user?.role }}</p>
            </div>

            <div class="p-2">
              <ul>
                <li>
                  <NuxtLink to="/user/settings/profile" class="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded">
                    <Settings class="w-4 h-4 text-gray-600" />
                    <span class="text-sm">Settings</span>
                  </NuxtLink>
                </li>
                <li>
                  <div class="px-2 py-1">
                    <div class="text-xs font-semibold text-gray-700 mb-1">Language</div>
                    <div class="relative">
                      <button @click="langOpen = !langOpen" class="w-full text-left px-2 py-1 rounded border flex justify-between items-center">
                        <span class="text-sm">{{ locale === 'km' ? 'Khmer' : 'English' }}</span>
                        <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
                      </button>
                      <div v-show="langOpen" class="absolute right-0 mt-1 bg-white border rounded shadow p-1 w-32">
                        <button @click="setLanguage('en'); langOpen = false" class="w-full text-left px-2 py-1 hover:bg-gray-100 rounded">English</button>
                        <button @click="setLanguage('km'); langOpen = false" class="w-full text-left px-2 py-1 hover:bg-gray-100 rounded">Khmer</button>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <button @click="toggleDarkMode" class="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                    <Moon class="w-4 h-4 text-gray-600" />
                    <span class="text-sm">Dark Mode</span>
                  </button>
                </li>
                <li class="border-t mt-1 pt-1">
                  <!-- Logged in → Log Out -->
                  <button
                    v-if="isAuthenticated"
                    @click="handleSignOut"
                    class="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-red-50 text-red-600 rounded"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                    </svg>
                    <span class="text-sm font-medium">Log Out</span>
                  </button>
                  <!-- Not logged in → Sign In -->
                  <NuxtLink
                    v-else
                    to="/auth/signin"
                    class="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded"
                  >
                    <Users class="w-4 h-4 text-gray-600" />
                    <span class="text-sm">Sign In</span>
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
import { useI18n } from '#imports'
import { useAuthStore } from '../../stores/auth.store'
import { useRouter } from 'vue-router'

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

// Only show dropdown if already has 2+ chars when focused
const handleFocus = () => {
  if (searchQuery.value.trim().length >= 2) {
    showDropdown.value = true
  }
}

const handleSearch = async () => {
  const q = searchQuery.value.trim()

  // Hide dropdown and clear results if less than 2 chars
  if (q.length < 2) {
    searchResults.value = []
    showDropdown.value = false
    return
  }

  searchLoading.value = true
  showDropdown.value = true

  try {
    const data = await $fetch(`${config.public.apiUrl}/products`)
    searchResults.value = data
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

const triggerSearch = () => {
  showDropdown.value = false
  searchResults.value = []
  const q = searchQuery.value.trim()
  searchQuery.value = ''
  if (q) {
    navigateTo(`/user/products?search=${encodeURIComponent(q)}`)
  } else {
    navigateTo('/user/products')
  }
}
// ────────────────────────────────────────────────────────

const handleProductHover = (status) => {
  productOpen.value = status
  if (status) {
    farmOpen.value = false
    userMenuOpen.value = false
    notificationsOpen.value = false
  }
}

const handleFarmHover = (status) => {
  farmOpen.value = status
  if (status) {
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

// i18n: language switching
const { t, locale, setLocale } = useI18n()
const langOpen = ref(false)
// const LOCALE_KEY = 'farmlink.locale'

const setLanguage = async (lang) => {
  try {
    // This function handles the switch for the entire Nuxt app properly
    await setLocale(lang) 
    langOpen.value = false
  } catch (e) {
    console.error("Failed to set language:", e)
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
  const colorMode = useColorMode()

  const toggleDarkMode = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
}

const onClickOutside = (e) => {
  const farmEl = document.getElementById('farm-menu')
  const userMenuEl = document.getElementById('user-menu')
  const notificationsEl = document.getElementById('notifications-menu')

  if (farmEl && !farmEl.contains(e.target)) farmOpen.value = false
  if (userMenuEl && !userMenuEl.contains(e.target)) userMenuOpen.value = false
  if (notificationsEl && !notificationsEl.contains(e.target)) notificationsOpen.value = false

  if (searchContainer.value && !searchContainer.value.contains(e.target)) {
    showDropdown.value = false
  }
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
  // avatarUrl is populated by mapSupabaseUser from OAuth user_metadata (Google, Facebook).
  // Returns undefined for email/password logins → header falls back to initials.
  return auth.user?.avatarUrl ?? null
})

const avatarClass = computed(() => {
  return 'bg-secondary text-white dark:text-on-surface'
})

const goToDashboard = () => {
  if (!user.value) return
  userMenuOpen.value = false
  if (user.value.role === 'farmer') return router.push('/farmer/dashboard')
  if (user.value.role === 'admin') return router.push('/admin/dashboard')
  return router.push('/')
}

import { useCart } from '~/composables/useCart'

const handleSignOut = async () => {
  userMenuOpen.value = false
  await auth.signOut()
  router.push('/auth/signin')
}

// ── Cart Flying Animation ──────────────────────────────
const { totalItems, triggerAnimation } = useCart()
const flyingParticles = ref([])
const isCartBouncing = ref(false)

watch(triggerAnimation, (newVal) => {
  if (!newVal) return

  const cartIcon = document.getElementById('header-cart-icon')
  if (!cartIcon) return

  const rect = cartIcon.getBoundingClientRect()
  const endX = rect.left + rect.width / 2
  const endY = rect.top + rect.height / 2

  flyingParticles.value.push({
    id: newVal.id,
    image: newVal.image,
    startX: newVal.x,
    startY: newVal.y,
    endX,
    endY
  })

  // End animation and trigger badge bounce after 800ms
  setTimeout(() => {
    flyingParticles.value = flyingParticles.value.filter(p => p.id !== newVal.id)
    isCartBouncing.value = true
    setTimeout(() => {
      isCartBouncing.value = false
    }, 400)
  }, 800)
})
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

/* ── Cart Animations ────────────────────────────── */
.flying-product-particle {
  position: fixed;
  left: 0;
  top: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 3px solid #1f7a2e;
  box-shadow: 0 8px 24px rgba(31, 122, 46, 0.3);
  pointer-events: none;
  z-index: 99999;
  animation: flyToCart 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.badge-bounce {
  animation: badgeBounce 0.4s ease-out;
}

@keyframes flyToCart {
  0% {
    transform: translate(calc(var(--start-x) - 24px), calc(var(--start-y) - 24px)) scale(1);
    opacity: 1;
  }
  40% {
    opacity: 0.9;
  }
  100% {
    transform: translate(calc(var(--end-x) - 24px), calc(var(--end-y) - 24px)) scale(0.1);
    opacity: 0;
  }
}

@keyframes badgeBounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}
</style>