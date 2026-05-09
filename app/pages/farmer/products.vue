<template>
  <div class="dashboard-layout">
    <FarmerSideBar />

    <!-- Main content area -->
    <div class="main-wrapper">

      <!-- Top bar -->
      <header class="bg-white border-b border-gray-100 px-8 py-3 flex items-center gap-4 sticky top-0 z-10">
      <div class="flex-1 relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
        </svg>
        <input
          type="text"
          placeholder="Search inventory..."
          class="w-80 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
        />
      </div>
      <button class="relative p-2 text-gray-500 hover:text-gray-700">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
      </button>
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-green-700">Sokha Farmer</span>
        <div class="w-8 h-8 rounded-full bg-amber-200 overflow-hidden">
          <img src="https://i.pravatar.cc/32?img=12" alt="Avatar" class="w-full h-full object-cover" />
        </div>
      </div>
    </header>

    <!-- Page Body -->
    <main class="px-8 py-8">
      <!-- Page Header -->
      <div class="flex items-start justify-between mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 leading-tight">Farmer Dashboard - Phum Garden</h1>
          <p class="text-gray-500 text-sm mt-1.5 max-w-lg">
            Manage your fresh Cambodian harvest, track stock levels, and monitor listing status for your local produce.
          </p>
        </div>
        <div class="flex gap-3 items-center">
          <button class="px-4 py-2.5 bg-amber-100 text-amber-800 font-semibold text-sm rounded-lg hover:bg-amber-200 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            Bulk Upload (CSV)
          </button>
          <button class="px-4 py-2.5 bg-green-800 text-white font-semibold text-sm rounded-lg hover:bg-green-700 transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add New Product
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-4 gap-4 mb-8">
        <div class="p-4 bg-white rounded-lg border border-gray-100">
          <div class="text-xs font-semibold text-gray-500 uppercase">TOTAL LISTINGS</div>
          <div class="text-2xl font-bold text-gray-900 mt-2">42</div>
        </div>
        <div class="p-4 bg-white rounded-lg border border-gray-100">
          <div class="text-xs font-semibold text-gray-500 uppercase">ACTIVE PRODUCTS</div>
          <div class="text-2xl font-bold text-gray-900 mt-2">38</div>
        </div>
        <div class="p-4 bg-white rounded-lg border border-gray-100">
          <div class="text-xs font-semibold text-gray-500 uppercase">LOW STOCK ALERTS</div>
          <div class="text-2xl font-bold text-orange-600 mt-2">4</div>
        </div>
        <div class="p-4 bg-white rounded-lg border border-gray-100">
          <div class="text-xs font-semibold text-gray-500 uppercase">PENDING APPROVAL</div>
          <div class="text-2xl font-bold text-gray-900 mt-2">0</div>
        </div>
      </div>

      <!-- Inventory Table + Side Panel -->
      <div class="grid grid-cols-3 gap-6">
        <!-- Left col: table + form -->
        <div class="col-span-2 space-y-6">

          <!-- Inventory Table -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 class="font-bold text-gray-900 text-base">Product Inventory</h2>
              <div class="flex gap-2 text-gray-400">
                <button class="hover:text-gray-600 transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M7 8h10M10 12h4"/>
                  </svg>
                </button>
                <button class="hover:text-gray-600 transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4M8 15l4 4 4-4"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Table Header -->
            <div class="grid grid-cols-[2fr_1fr_1fr_1.5fr_auto] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
              <span class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Product</span>
              <span class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</span>
              <span class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Price</span>
              <span class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Available Stock</span>
              <span class="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</span>
            </div>

            <!-- Rows -->
            <div class="divide-y divide-gray-50">
              <div v-for="product in products" :key="product.name" class="grid grid-cols-[2fr_1fr_1fr_1.5fr_auto] gap-4 px-6 py-4 hover:bg-gray-50">
                <div class="flex items-center gap-2">
                  <span class="text-lg">{{ product.emoji }}</span>
                  <div>
                    <div class="font-semibold text-gray-900">{{ product.name }}</div>
                    <div class="text-xs text-gray-500">{{ product.location }}</div>
                  </div>
                </div>
                <div>
                  <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                    {{ product.status === 'active' ? 'Active' : 'Out of Stock' }}
                  </span>
                </div>
                <div class="font-semibold text-gray-900">{{ product.price }}</div>
                <div>
                  <div class="font-semibold text-gray-900">{{ product.stock }}</div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div class="bg-green-600 h-1.5 rounded-full" :style="{ width: product.stockPercent + '%' }"></div>
                  </div>
                </div>
                <button class="text-gray-400 hover:text-gray-600">⋮</button>
              </div>
            </div>

            <div class="px-6 py-4 text-center border-t border-gray-100">
              <button class="text-green-700 font-semibold text-sm hover:text-green-900 transition">View All Inventory</button>
            </div>
          </div>

          <!-- Add New Product Batch Form -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 class="font-bold text-gray-900 text-base mb-5 flex items-center gap-2">
              <span class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
                </svg>
              </span>
              Add New Product Batch
            </h2>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Product Name</label>
                <input v-model="form.name" type="text" placeholder="e.g. Purple Dragon Fruit"
                  class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                <select v-model="form.category"
                  class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition appearance-none">
                  <option>Fruits</option>
                  <option>Vegetables</option>
                  <option>Leafy Greens</option>
                  <option>Herbs</option>
                </select>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
              <textarea v-model="form.description" rows="3"
                placeholder="Describe your produce (harvest method, freshness, variety)..."
                class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition resize-none"></textarea>
            </div>

            <div class="mt-4">
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Product Images (Up To 5)</label>
              <div class="flex gap-3">
                <button class="w-16 h-16 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-500 transition">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="text-[10px] font-semibold mt-0.5">ADD</span>
                </button>
                <div v-for="i in 4" :key="i" class="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200"></div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Pricing</label>
                <div class="flex">
                  <input v-model="form.price" type="number" placeholder="0.00"
                    class="flex-1 px-3 py-2.5 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition" />
                  <span class="px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-r-lg text-sm text-gray-500">per kg</span>
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Harvest Location</label>
                <input v-model="form.location" type="text" placeholder="e.g. Takeo Province"
                  class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Stock Quantity</label>
                <input v-model="form.stock" type="number" placeholder="Enter amount"
                  class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Estimated Availability</label>
                <input v-model="form.availability" type="date"
                  class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition" />
              </div>
            </div>

            <div class="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
              <button class="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition">Save Draft</button>
              <button class="px-6 py-2.5 bg-green-800 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition">
                Publish Product Listing
              </button>
            </div>
          </div>
        </div>

        <!-- Right col: side panels -->
        <div class="space-y-4">
          <!-- Market Trends -->
          <div class="bg-green-800 text-white rounded-2xl p-5">
            <h3 class="font-bold text-sm mb-2">Market Trends</h3>
            <p class="text-green-200 text-xs leading-relaxed">
              Organic fruits are currently in high demand in Phnom Penh. Consider highlighting your 'Pesticide Free' certifications to increase sales by up to 25%.
            </p>
            <button class="mt-4 px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition w-full">
              VIEW INSIGHTS
            </button>
          </div>

          <!-- Inventory Health -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 class="font-bold text-gray-900 text-sm mb-4">Inventory Health</h3>
            <div class="space-y-4">
              <div>
                <div class="flex items-center justify-between text-xs mb-1.5">
                  <span class="text-gray-500">Storage Capacity</span>
                  <span class="font-semibold text-gray-700">64% Full</span>
                </div>
                <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-500 rounded-full" style="width: 64%"></div>
                </div>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">Avg. Turnover</span>
                <span class="font-bold text-gray-700">4.2 Days</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500">Spoilage Rate</span>
                <span class="font-bold text-green-600">-12% this month</span>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 class="font-bold text-gray-900 text-sm mb-3">Quick Links</h3>
            <div class="space-y-2.5">
              <a href="#" class="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6m0 0L7 12m6-6l6 6"/>
                </svg>
                <span class="text-sm font-medium">Delivery Partners</span>
              </a>
              <a href="#" class="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span class="text-sm font-medium">Recent Sales Invoices</span>
              </a>
              <a href="#" class="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-sm font-medium">Quality Guidelines</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
    </div>
  </div>
</template>

<script setup>
import FarmerSideBar from '~/components/farmer/FarmerSideBar.vue'
import { ref } from 'vue'

const form = ref({
  name: '',
  category: 'Fruits',
  description: '',
  price: '',
  location: '',
  stock: '',
  availability: '',
})

const products = ref([
  {
    name: 'Keo Chen Mangoes',
    category: 'Fruits',
    location: 'Takeo Province',
    status: 'active',
    price: '$2.50',
    unit: 'kg',
    stock: '1,250 kg',
    stockPercent: 83,
    emoji: '🥭',
  },
  {
    name: 'Angkor Bok Choy',
    category: 'Leafy Greens',
    location: 'Kandal',
    status: 'out-of-stock',
    price: '$0.80',
    unit: 'bunch',
    stock: '0 bunches',
    stockPercent: 0,
    emoji: '🥬',
  },
  {
    name: 'Kampot Durian',
    category: 'Fruits',
    location: 'Kampot',
    status: 'active',
    price: '$12.00',
    unit: 'piece',
    stock: '45 pieces',
    stockPercent: 18,
    emoji: '🌵',
  },
])
</script>

<style scoped>
/* Layout to match orders.vue */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7f3;
}

.main-wrapper {
  flex: 1;
  margin-left: 180px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Topbar styling */
header {
  position: sticky;
  top: 0;
  z-index: 30;
}
</style>