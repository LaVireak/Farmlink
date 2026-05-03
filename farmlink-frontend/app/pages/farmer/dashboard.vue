<template>
  <div class="dashboard-layout">
    <FarmerSideBar />
    <div class="main-wrapper">

      <!-- Top Nav Bar -->
      <header class="flex items-center justify-between px-8 py-4 bg-[#f5f7f3] sticky top-0 z-10">
        <div class="flex-1 max-w-xl">
          <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search harvests, orders, or data..."
              class="bg-transparent outline-none text-sm text-gray-500 w-full placeholder-gray-400"
            />
          </div>
        </div>

        <div class="flex items-center gap-4 ml-6">
          <button class="relative p-2 hover:bg-gray-100 rounded-full transition">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-5A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button class="p-2 hover:bg-gray-100 rounded-full transition">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <!-- User -->
          <div class="flex items-center gap-3 ml-2">
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-800 leading-tight">Farmer Approved</p>
              <p class="text-xs text-gray-500">Organic Valley Farm</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-amber-700 overflow-hidden border-2 border-white shadow">
              <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Silas" alt="Avatar" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 px-8 py-6">

        <!-- Greeting Row -->
        <div class="flex items-start justify-between mb-6">
          <div>
            <h1 class="text-4xl font-bold text-gray-900 tracking-tight">Morning, Silas.</h1>
            <p class="text-gray-500 mt-1 text-sm">
              Your farm is performing
              <span class="text-[#2d6a4f] font-semibold">12% above</span>
              seasonal average.
            </p>
          </div>

          <!-- Weather Card -->
          <div class="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3 min-w-[200px]">
            <svg class="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            <div>
              <p class="text-xs uppercase tracking-widest text-gray-400 font-medium">Field Weather</p>
              <p class="text-xl font-bold text-gray-800">24°C <span class="text-sm font-normal text-gray-500">Clear Skies</span></p>
            </div>
          </div>
        </div>

        <!-- Stat Cards + Account Status -->
        <div class="grid grid-cols-4 gap-4 mb-6">
          <!-- Total Sales -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p class="text-xs uppercase tracking-widest text-gray-400 font-medium mb-2">Total Sales</p>
            <p class="text-3xl font-bold text-gray-900">$14,290</p>
            <div class="flex items-center gap-1 mt-3">
              <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span class="text-sm font-semibold text-emerald-600">+8.4%</span>
            </div>
          </div>

          <!-- Active Listings -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p class="text-xs uppercase tracking-widest text-gray-400 font-medium mb-2">Active Listings</p>
            <p class="text-3xl font-bold text-gray-900">24</p>
            <p class="text-sm text-gray-400 mt-3">4 Ending soon</p>
          </div>

          <!-- Pending Orders -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p class="text-xs uppercase tracking-widest text-gray-400 font-medium mb-2">Pending Orders</p>
            <p class="text-3xl font-bold text-gray-900">12</p>
            <div class="flex items-center gap-1 mt-3">
              <span class="text-orange-500 font-bold">!</span>
              <span class="text-sm font-semibold text-orange-500">Urgent</span>
            </div>
          </div>

          <!-- Account Status -->
          <div class="bg-[#2d5a3d] rounded-2xl shadow-sm p-5 text-white">
            <p class="text-xs uppercase tracking-widest text-green-300 font-medium mb-4">Account Status</p>
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-green-100">Profile Verification</span>
              <span class="text-xs font-semibold bg-green-400 text-green-900 px-2 py-0.5 rounded-full">APPROVED</span>
            </div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-green-100">Inventory Expansion<br/>Request</span>
              <span class="text-xs font-semibold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">PENDING REVIEW</span>
            </div>
            <button class="text-sm text-green-300 hover:text-white underline underline-offset-2 transition mt-1">
              View Detail History
            </button>
          </div>
        </div>

        <!-- Recent Transactions + Alerts Feed -->
        <div class="grid grid-cols-[1fr_380px] gap-4 mb-4">

          <!-- Recent Transactions -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-gray-900">Recent Transactions</h2>
              <button class="text-xs uppercase tracking-widest text-gray-400 font-semibold hover:text-[#2d6a4f] transition">
                View All Sales
              </button>
            </div>

            <!-- Table Header -->
            <div class="grid grid-cols-[120px_1fr_1fr_1fr_80px] gap-2 mb-3">
              <span class="text-[10px] uppercase tracking-widest text-gray-400 font-medium leading-tight">Transaction<br/>ID</span>
              <span class="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Customer</span>
              <span class="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Product</span>
              <span class="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Amount</span>
              <span class="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Status</span>
            </div>

            <div class="divide-y divide-gray-50">
              <div
                v-for="tx in transactions"
                :key="tx.id"
                class="grid grid-cols-[120px_1fr_1fr_1fr_80px] gap-2 items-center py-4"
              >
                <span class="text-xs text-gray-400 font-mono">{{ tx.id }}</span>
                <span class="text-sm font-bold text-gray-800 leading-tight">{{ tx.customer }}</span>
                <span class="text-sm text-gray-600">{{ tx.product }}</span>
                <span class="text-sm font-bold text-gray-900">{{ tx.amount }}</span>
                <span
                  class="text-xs font-semibold px-2 py-0.5 rounded-full w-fit"
                  :class="tx.status === 'Fulfilled'
                    ? 'bg-green-100 text-green-700'
                    : tx.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-500'"
                >
                  {{ tx.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Alerts Feed -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
            <h2 class="text-lg font-bold text-gray-900 mb-5">Alerts Feed</h2>

            <div class="flex-1 space-y-5">
              <div
                v-for="alert in alerts"
                :key="alert.id"
                class="flex gap-3"
              >
                <div class="mt-1 flex-shrink-0">
                  <span
                    class="block w-2.5 h-2.5 rounded-full"
                    :class="{
                      'bg-emerald-500': alert.type === 'success',
                      'bg-red-500':     alert.type === 'warning',
                      'bg-gray-300':    alert.type === 'info',
                    }"
                  ></span>
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-800 leading-snug">{{ alert.title }}</p>
                  <p class="text-sm text-gray-500 mt-0.5 leading-snug">{{ alert.body }}</p>
                  <p class="text-xs text-gray-400 mt-1.5">{{ alert.time }}</p>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-4 mt-5">
              <button
                @click="clearAlerts"
                class="w-full text-xs font-semibold uppercase tracking-widest border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 py-2.5 rounded-xl transition"
              >
                Clear All Notifications
              </button>
            </div>
          </div>

        </div>

        <!-- Incoming Orders + Right Column -->
        <div class="grid grid-cols-[1fr_380px] gap-4">

          <!-- Incoming Orders -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div class="flex items-center justify-between mb-5">
              <h2 class="text-lg font-bold text-gray-900">Incoming Orders</h2>
              <button class="text-sm text-[#2d6a4f] font-medium flex items-center gap-1 hover:opacity-70 transition">
                Manage All
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="order in incomingOrders"
                :key="order.id"
                class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition"
              >
                <div class="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-[#2d6a4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-800">{{ order.product }}</p>
                  <p class="text-xs text-gray-400">Ordered by <span class="text-gray-500">{{ order.buyer }}</span></p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="acceptOrder(order.id)"
                    class="bg-[#2d6a4f] hover:bg-[#245a41] text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                  >
                    Accept
                  </button>
                  <button
                    @click="rejectOrder(order.id)"
                    class="border border-gray-200 hover:border-gray-300 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="flex flex-col gap-4">

            <!-- Stock Warning -->
            <div class="bg-red-50 border border-red-100 rounded-2xl p-5">
              <div class="flex items-start gap-3 mb-3">
                <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <h3 class="text-base font-bold text-gray-800">Stock Warning</h3>
              </div>
              <p class="text-sm text-gray-500 mb-4">Baby Spinach and Kale are below the 10kg threshold.</p>
              <button class="text-xs font-semibold tracking-wider uppercase border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition">
                Refill Inventory
              </button>
            </div>

            <!-- Top Selling Crops -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-1">
              <p class="text-xs uppercase tracking-widest text-gray-400 font-medium mb-4">Top Selling Crops</p>
              <div class="space-y-4">
                <div v-for="crop in topCrops" :key="crop.name">
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-sm font-medium text-gray-700">{{ crop.name }}</span>
                    <span class="text-sm font-bold text-gray-800">{{ crop.value }}</span>
                  </div>
                  <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-[#2d6a4f] rounded-full"
                      :style="{ width: crop.pct + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import FarmerSideBar from './FarmerSideBar.vue'

const incomingOrders = ref([
  { id: 1, product: 'Heirloom Carrots (20kg)', buyer: 'GreenGrocer Central' },
  { id: 2, product: 'Russet Potatoes (50kg)', buyer: 'Harbor Market' },
])

const transactions = ref([
  { id: '#TRX-9021', customer: 'Whole Foods Hub',  product: 'Mixed Squash',  amount: '$1,250.00', status: 'Fulfilled' },
  { id: '#TRX-8842', customer: 'City Organics',    product: 'Baby Beets',    amount: '$420.50',   status: 'Fulfilled' },
  { id: '#TRX-8711', customer: 'Local Bistro',     product: 'Microgreens',   amount: '$85.00',    status: 'Pending'   },
])

const alerts = ref([
  {
    id: 1,
    type: 'success',
    title: 'New Bulk Order Received',
    body: 'Central Distribution has requested 500kg of Russet Potatoes for Friday delivery.',
    time: '12 minutes ago',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Soil Moisture Low: Sector D',
    body: 'Sensor 12b reports < 15% moisture in the corn fields. Check irrigation.',
    time: '2 hours ago',
  },
  {
    id: 3,
    type: 'info',
    title: 'Payout Processed',
    body: '$3,420.00 has been transferred to your connected bank account.',
    time: 'Yesterday',
  },
])

function clearAlerts() {
  alerts.value = []
}

const topCrops = ref([
  { name: 'Heirloom Carrots', value: '$4,200', pct: 88 },
  { name: 'Russet Potatoes',  value: '$3,800', pct: 78 },
  { name: 'Spring Onions',    value: '$1,900', pct: 42 },
])

function acceptOrder(id) {
  incomingOrders.value = incomingOrders.value.filter(o => o.id !== id)
}

function rejectOrder(id) {
  incomingOrders.value = incomingOrders.value.filter(o => o.id !== id)
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7f3;
  font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
}

.main-wrapper {
  flex: 1;
  margin-left: 180px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f7f3;
}
</style>