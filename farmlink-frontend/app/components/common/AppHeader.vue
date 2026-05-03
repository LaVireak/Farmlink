<template>
  <header class="bg-cream w-full header-height flex items-center px-8 shadow-sm">
    <div class="container mx-auto flex items-center justify-between">
      
      <div class="flex-shrink-0">
        <NuxtLink to="/">
          <img 
            alt="Farm Link Logo" 
            class="h-16 w-auto object-contain" 
            src="assets\images\logo1.png"
          />
        </NuxtLink>
      </div>

      <nav class="hidden lg:flex items-center space-x-8">
        <NuxtLink 
          to="/" 
          class="bg-primary-yellow px-6 py-2 rounded-full border-2 border-black nav-link uppercase text-xs"
        >
          Home
        </NuxtLink>

        <div class="relative" id="product-menu">
          <button @click.stop="toggleProduct" class="flex items-center space-x-1 cursor-pointer group focus:outline-none">
            <span class="nav-link uppercase text-xs">Product</span>
            <svg :class="{ 'rotate-180': productOpen }" class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>

          <div v-show="productOpen" class="absolute left-0 mt-3 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div class="p-3 border-b">
              <div class="text-xs font-bold text-gray-700">Categories:</div>
              <ul class="mt-2">
                <li><NuxtLink to="#" class="block px-2 py-1 hover:bg-gray-100">Vegetables</NuxtLink></li>
                <li><NuxtLink to="#" class="block px-2 py-1 hover:bg-gray-100">Fruits</NuxtLink></li>
                <li><NuxtLink to="#" class="block px-2 py-1 hover:bg-gray-100">Seeds & Seedlings</NuxtLink></li>
                <li><NuxtLink to="#" class="block px-2 py-1 hover:bg-gray-100">Tools & Equipment</NuxtLink></li>
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
          </div>
        </div>

        <div class="relative" id="farm-menu">
          <button @click.stop="toggleFarm" class="flex items-center space-x-1 cursor-pointer group focus:outline-none">
            <span class="nav-link uppercase text-xs">Farm</span>
            <svg :class="{ 'rotate-180': farmOpen }" class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>

          <div v-show="farmOpen" class="absolute left-0 mt-3 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div class="p-3 border-b">
              <div class="text-xs font-bold text-gray-700">Farm Near You:</div>
              <ul class="mt-2">
                <li><NuxtLink to="#" class="block px-2 py-1 hover:bg-gray-100">Farm 1</NuxtLink></li>
                <li><NuxtLink to="#" class="block px-2 py-1 hover:bg-gray-100">Farm 2</NuxtLink></li>
                <li><NuxtLink to="#" class="block px-2 py-1 hover:bg-gray-100">Farm 3</NuxtLink></li>
              </ul>
            </div>
            <div class="p-3">
              <div class="text-xs font-bold text-gray-700">Recommending Farm:</div>
              <ul class="mt-2">
                <li><NuxtLink to="#" class="block px-2 py-1 hover:bg-gray-100">Farm 4</NuxtLink></li>
                <li><NuxtLink to="#" class="block px-2 py-1 hover:bg-gray-100">Farm 5</NuxtLink></li>
                <li><NuxtLink to="#" class="block px-2 py-1 hover:bg-gray-100">Farm 6</NuxtLink></li>
              </ul>
            </div>
          </div>
        </div>

        <NuxtLink to="/about" class="nav-link uppercase text-xs">About</NuxtLink>
        <NuxtLink to="/contacts" class="nav-link uppercase text-xs">Contacts</NuxtLink>
      </nav>

      <div class="flex items-center space-x-6">
        <div class="relative search-container">
          <input 
            type="text"
            class="w-full bg-transparent border-2 border-black rounded-full py-2 px-6 focus:outline-none focus:ring-0 search-input" 
            placeholder="Search..." 
          />
          <button class="absolute right-4 top-1/2 -translate-y-1/2">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>
        </div>

        <div class="flex items-center space-x-5 text-black">
          <button aria-label="Bookmarks">
            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" stroke="currentColor" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>
          <button aria-label="Shopping Cart">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>
        </div>

        <button class="bg-primary-yellow px-8 py-3 rounded-full border-2 border-black nav-link uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1 transition-all">
          Shop Now
        </button>

        <button class="w-12 h-12 rounded-full bg-primary-yellow border-2 border-black flex items-center justify-center overflow-hidden">
          <svg class="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const farmOpen = ref(false)
const productOpen = ref(false)

const toggleFarm = () => {
  farmOpen.value = !farmOpen.value
  if (farmOpen.value) productOpen.value = false
}

const toggleProduct = () => {
  productOpen.value = !productOpen.value
  if (productOpen.value) farmOpen.value = false
}

const onClickOutside = (e) => {
  const farmEl = document.getElementById('farm-menu')
  const productEl = document.getElementById('product-menu')
  if (farmEl && !farmEl.contains(e.target)) farmOpen.value = false
  if (productEl && !productEl.contains(e.target)) productOpen.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
/* Scoped ensures these styles don't leak to other components */
.bg-cream {
  background-color: #FFF7DA;
}
.bg-primary-yellow {
  background-color: #EFCF4F;
}
.header-height {
  height: 100px;
}
.search-container {
  width: 320px;
}
.nav-link {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: 0.05em;
}
.search-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
  font-style: italic;
}
</style>