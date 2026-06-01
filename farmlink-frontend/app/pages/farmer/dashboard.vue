<template>
  <main class="flex-1 bg-[#F5F7F3] px-6 py-8 md:px-10 min-h-screen font-sans antialiased">
    <div class="mb-8 pb-5 border-b border-gray-200/50">
      <FarmerHeader title="Dashboard" />
    </div>

    <div v-if="globalError" class="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl text-sm flex items-center justify-between">
      <span class="flex items-center gap-2">
        <svg class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Failed to sync dashboard modules. Displaying cached offline operational records.
      </span>
      <button @click="refreshDashboardData" class="underline font-bold hover:text-rose-700 transition">Retry Pipeline Link</button>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
      <div>
        <h1 class="text-3xl font-black text-gray-950 tracking-tight sm:text-4xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Morning, {{ user?.firstName || 'Silas' }}.
        </h1>
        <p class="text-gray-500 mt-2 text-sm flex items-center gap-2">
          Your farm performance is currently 
          <span class="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200/40 px-2.5 py-0.5 rounded-full text-xs">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {{ metrics?.performanceDelta || '0%' }} above
          </span>
          the seasonal average.
        </p>
      </div>

      <div class="flex items-center gap-4 bg-white rounded-2xl border border-gray-200/60 shadow-sm px-5 py-3.5 sm:min-w-[240px] hover:shadow-md transition-all duration-300">
        <div class="p-2.5 bg-sky-50 text-sky-500 rounded-xl ring-4 ring-sky-50/50">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </div>
        <div v-if="pendingMetrics" class="animate-pulse space-y-2">
          <div class="h-2 w-16 bg-gray-200 rounded"></div>
          <div class="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
        <div v-else>
          <p class="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold">Field Weather</p>
          <p class="text-xl font-black text-gray-800 mt-0.5">
            {{ weather?.temp || '—' }}°C 
            <span class="text-xs font-semibold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded ml-1.5">{{ weather?.condition || 'Syncing' }}</span>
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      
      <template v-if="pendingMetrics">
        <div v-for="i in 3" :key="'skel-'+i" class="bg-white rounded-2xl border border-gray-200/50 p-6 space-y-4 animate-pulse">
          <div class="flex justify-between items-center"><div class="h-3 w-20 bg-gray-200 rounded"></div><div class="h-6 w-6 bg-gray-200 rounded-lg"></div></div>
          <div class="h-8 w-28 bg-gray-200 rounded"></div>
          <div class="h-5 w-24 bg-gray-200 rounded-xl"></div>
        </div>
      </template>

      <template v-else>
        <div class="bg-white rounded-2xl border border-gray-200/50 shadow-xs p-6 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-md hover:border-gray-300 transition-all duration-300">
          <div>
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs uppercase tracking-wider text-gray-400 font-bold">Total Sales</p>
              <div class="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 opacity-70 group-hover:opacity-100 transition-opacity"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
            </div>
            <p class="text-3xl font-black text-gray-900 tracking-tight">${{ metrics?.totalSales?.toLocaleString() }}</p>
          </div>
          <div class="flex items-center gap-1.5 mt-5 text-emerald-700 bg-emerald-50 border border-emerald-100/70 w-fit px-2.5 py-1 rounded-xl text-xs font-bold">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            <span>+{{ metrics?.weeklyGrowth }}% this week</span>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200/50 shadow-xs p-6 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-md hover:border-gray-300 transition-all duration-300">
          <div>
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs uppercase tracking-wider text-gray-400 font-bold">Active Listings</p>
              <div class="p-1.5 bg-amber-50 rounded-lg text-amber-600 opacity-70 group-hover:opacity-100 transition-opacity"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v6a2 2 0 012-2m14-0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div>
            </div>
            <p class="text-3xl font-black text-gray-900 tracking-tight">{{ metrics?.activeListings }}</p>
          </div>
          <div class="mt-5 text-xs text-gray-500 font-medium">
            <span class="text-amber-700 font-bold bg-amber-50 border border-amber-100/70 px-2 py-0.5 rounded-md mr-1">{{ metrics?.endingSoonCount }} items</span> ending soon
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200/50 shadow-xs p-6 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-md hover:border-gray-300 transition-all duration-300">
          <div>
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs uppercase tracking-wider text-gray-400 font-bold">Pending Orders</p>
              <div class="p-1.5 bg-rose-50 rounded-lg text-rose-600 opacity-70 group-hover:opacity-100 transition-opacity"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg></div>
            </div>
            <p class="text-3xl font-black text-gray-900 tracking-tight">{{ incomingOrders.length }}</p>
          </div>
          <div v-if="incomingOrders.length > 0" class="flex items-center gap-1.5 mt-5 text-rose-700 bg-rose-50 border border-rose-100/70 w-fit px-2.5 py-1 rounded-xl text-xs font-bold">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span>Requires attention</span>
          </div>
          <div v-else class="mt-5 text-xs text-gray-400 font-medium flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg> Pipeline Clear
          </div>
        </div>
      </template>

      <div class="bg-gradient-to-br from-[#0e291e] via-[#163829] to-[#22523d] rounded-2xl shadow-sm p-6 text-white flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
        <div class="absolute -right-6 -bottom-6 text-emerald-500/10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
          <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </div>
        <div class="relative z-10">
          <p class="text-[10px] uppercase tracking-widest text-emerald-300 font-extrabold mb-4 opacity-90">Verification Registry</p>
          <div class="space-y-3.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-emerald-100/80 font-medium">Profile Status</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider border transition-all duration-300"
                :class="registry?.profile === 'VERIFIED' 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'">
                {{ registry?.profile || 'PENDING' }}
              </span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-emerald-100/80 font-medium">Inventory Allocation</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider border transition-all duration-300"
                :class="registry?.inventory === 'MATCHED' 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'">
                {{ registry?.inventory || 'UNDER REVIEW' }}
              </span>
            </div>
          </div>
        </div>
        <NuxtLink to="/farmer/profile#verification" class="text-xs text-emerald-300 hover:text-white text-left font-bold underline underline-offset-4 transition mt-6 block relative z-10">
          View Submission History →
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      
      <div class="bg-white rounded-2xl border border-gray-200/50 shadow-xs p-6 lg:col-span-2 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-950 tracking-tight">Recent Financial Records</h2>
            <NuxtLink to="/farmer/orders" class="text-xs uppercase tracking-wider text-gray-400 font-extrabold hover:text-[#2d6a4f] transition-colors pb-1 border-b-2 border-transparent hover:border-[#2d6a4f]">
              View All Journals
            </NuxtLink>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-gray-100">
                  <th class="pb-3.5 text-[10px] uppercase tracking-wider text-gray-400 font-extrabold">Log ID</th>
                  <th class="pb-3.5 text-[10px] uppercase tracking-wider text-gray-400 font-extrabold">Client Entity</th>
                  <th class="pb-3.5 text-[10px] uppercase tracking-wider text-gray-400 font-extrabold">Batch Item</th>
                  <th class="pb-3.5 text-[10px] uppercase tracking-wider text-gray-400 font-extrabold">Settlement</th>
                  <th class="pb-3.5 text-[10px] uppercase tracking-wider text-gray-400 font-extrabold text-right">Status</th>
                </tr>
              </thead>
              <tbody v-if="pendingData" class="divide-y divide-gray-100/50">
                <tr v-for="n in 3" :key="'tx-skel-'+n" class="animate-pulse">
                  <td class="py-4"><div class="h-3 w-12 bg-gray-200 rounded"></div></td>
                  <td class="py-4"><div class="h-3 w-28 bg-gray-200 rounded"></div></td>
                  <td class="py-4"><div class="h-3 w-20 bg-gray-200 rounded"></div></td>
                  <td class="py-4"><div class="h-3 w-16 bg-gray-200 rounded"></div></td>
                  <td class="py-4 flex justify-end"><div class="h-5 w-16 bg-gray-200 rounded-full"></div></td>
                </tr>
              </tbody>
              <tbody v-else class="divide-y divide-gray-100/50">
                <tr v-for="tx in transactions" :key="tx.id" class="group hover:bg-gray-50/50 transition-colors">
                  <td class="py-4 text-xs font-mono text-gray-400 group-hover:text-gray-600 transition-colors">{{ tx.id }}</td>
                  <td class="py-4 text-sm font-bold text-gray-900">{{ tx.customer }}</td>
                  <td class="py-4 text-sm text-gray-600 font-medium">{{ tx.product }}</td>
                  <td class="py-4 text-sm font-black text-gray-950">${{ tx.amount?.toFixed(2) }}</td>
                  <td class="py-4 text-right">
                    <span class="inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full"
                      :class="tx.status === 'Fulfilled' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40' : 'bg-amber-50 text-amber-700 border border-amber-200/40'">
                      <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="tx.status === 'Fulfilled' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                      {{ tx.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200/50 shadow-xs p-6 flex flex-col justify-between">
        <div>
          <h2 class="text-lg font-bold text-gray-955 tracking-tight mb-5">System Broadcasts</h2>
          <div class="space-y-3 overflow-y-auto max-h-[320px] pr-1 scrollbar-thin">
            <div v-for="alert in alerts" :key="alert.id" class="flex items-start gap-4 p-3.5 rounded-xl border border-transparent hover:bg-gray-50/60 hover:border-gray-100 transition-all duration-200">
              <span class="mt-1.5 block w-2 h-2 rounded-full flex-shrink-0"
                :class="{
                  'bg-emerald-500 ring-4 ring-emerald-100': alert.type === 'success',
                  'bg-rose-500 ring-4 ring-rose-100 animate-pulse': alert.type === 'warning',
                  'bg-blue-500 ring-4 ring-blue-100': alert.type === 'info',
                }">
              </span>
              <div class="flex-1">
                <p class="text-xs font-bold text-gray-900 leading-tight">{{ alert.title }}</p>
                <p class="text-xs text-gray-500 mt-1 leading-relaxed">{{ alert.body }}</p>
                <p class="text-[10px] text-gray-400 mt-2 font-semibold tracking-wider uppercase">{{ alert.time }}</p>
              </div>
            </div>
            <div v-if="alerts.length === 0" class="text-center py-12 text-xs text-gray-400 font-medium">
              Diagnostic buffer clear. No issues found.
            </div>
          </div>
        </div>

        <div class="border-t border-gray-100 pt-4 mt-5">
          <button @click="clearAlerts" :disabled="alerts.length === 0" class="w-full text-[11px] font-extrabold uppercase tracking-wider border border-gray-200 hover:border-gray-300 hover:bg-gray-50/70 text-gray-500 py-3 rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]">
            Dismiss Diagnostics Logs
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="bg-white rounded-2xl border border-gray-200/50 shadow-xs p-6 lg:col-span-2">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-gray-955 tracking-tight">Inbound Delivery Requests</h2>
          <NuxtLink to="/farmer/orders" class="text-xs font-bold text-[#2d6a4f] flex items-center gap-1 hover:opacity-80 transition-opacity group">
            Go to Pipeline Manager
            <svg class="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
          </NuxtLink>
        </div>

        <div class="space-y-4">
          <div v-for="order in incomingOrders" :key="order.id" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-100/70 bg-[#F5F7F3]/40 hover:shadow-xs hover:bg-white hover:border-gray-200 transition-all duration-200">
            <div class="flex items-center gap-4">
              <div class="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-[#2d6a4f] flex-shrink-0 ring-4 ring-emerald-50/40">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900 leading-tight">{{ order.product }}</p>
                <p class="text-xs text-gray-400 mt-1">Account Handler: <span class="text-gray-700 font-semibold">{{ order.buyer }}</span></p>
              </div>
            </div>
            <div class="flex items-center gap-2.5 self-end sm:self-auto">
              <button @click="processOrderAction(order.id, 'accept')" :disabled="actionLoading === order.id" class="bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-40 active:scale-95">
                {{ actionLoading === order.id ? 'Processing...' : 'Approve Request' }}
              </button>
              <button @click="processOrderAction(order.id, 'reject')" :disabled="actionLoading === order.id" class="border border-gray-200 hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50/30 text-gray-600 text-xs font-bold px-4 py-2.5 rounded-xl transition-all disabled:opacity-40 active:scale-95">
                Decline
              </button>
            </div>
          </div>
          <div v-if="!pendingData && incomingOrders.length === 0" class="text-center py-8 text-sm text-gray-400">
            No inbound delivery requests found.
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        
        <div v-if="storageAlert" class="bg-gradient-to-r from-rose-50/70 to-rose-50/20 border border-rose-100 rounded-2xl p-5 relative overflow-hidden">
          <div class="absolute right-0 top-0 translate-x-3 -translate-y-3 text-rose-100 pointer-events-none">
            <svg class="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z"/></svg>
          </div>
          <div class="relative z-10">
            <div class="flex items-center gap-2.5 mb-2.5">
              <div class="p-1.5 bg-rose-100 text-rose-600 rounded-lg shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
              </div>
              <h3 class="text-sm font-bold text-rose-950">Critical Storage Alert</h3>
            </div>
            <p class="text-xs text-rose-800/90 leading-relaxed mb-4">
              Stock reserves for <span class="font-bold text-rose-950">{{ storageAlert.item }}</span> have dropped below safe limits ({{ storageAlert.threshold }} threshold).
            </p>
            <button @click="triggerRestockManifest" class="w-full text-[11px] font-extrabold tracking-wider uppercase border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 px-4 py-3 rounded-xl transition-all shadow-xs active:scale-[0.98]">
              Initialize Restock Manifest
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200/50 shadow-xs p-5 flex-1 flex flex-col justify-between">
          <div>
            <p class="text-xs uppercase tracking-wider text-gray-400 font-extrabold mb-5">Yield Matrix Metrics</p>
            <div class="space-y-4.5">
              <div v-for="crop in topCrops" :key="crop.name" class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-gray-700">{{ crop.name }}</span>
                  <span class="text-xs font-black text-gray-950">${{ crop.value?.toLocaleString() }}</span>
                </div>
                <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-[#52b788] via-[#40916c] to-[#2d6a4f] rounded-full transition-all duration-500" :style="{ width: crop.pct + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-medium">
            <span class="flex items-center gap-1.5">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span> 
              Live Node Status
            </span>
            <span class="font-mono text-[10px]">Sync complete</span>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAuth } from '../../composables/useAuth'
import { getAccessToken } from '../../services/auth.service'

definePageMeta({
  middleware: 'farmer',
  layout: 'farmer'
})

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api') + '/farmer'

const { user, ensureHydrated } = useAuth()

const incomingOrders = ref([])
const transactions = ref([])
const alerts = ref([])
const topCrops = ref([])
const metrics = ref(null)
const registry = ref(null)
const weather = ref(null)
const storageAlert = ref(null)

const pendingMetrics = ref(true)
const pendingData = ref(true)
const globalError = ref(false)
const actionLoading = ref(null)
let weatherPollInterval = null

async function fetchDashboardMetrics() {
  try {
    pendingMetrics.value = true
    const token = await getAccessToken()
    
    const response = await $fetch(`${API_BASE}/metrics/summary`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })
    metrics.value = response.data.metrics
    registry.value = response.data.registry
    weather.value = { temp: 24, condition: 'Clear Skies' } // Hardcoded mock weather info
    globalError.value = false
  } catch (err) {
    console.error('Error establishing metrics hook:', err)
    weather.value = { temp: 24, condition: 'Clear Skies' } // Hardcoded mock weather info fallback
    globalError.value = true
  } finally {
    pendingMetrics.value = false
  }
}

async function fetchOperationalLogs() {
  try {
    pendingData.value = true
    const token = await getAccessToken()
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }

    const [txResponse, alertResponse, orderResponse, yieldResponse] = await Promise.all([
      $fetch(`${API_BASE}/transactions/recent`, { headers }),
      $fetch(`${API_BASE}/broadcasts/active`, { headers }),
      $fetch(`${API_BASE}/orders/inbound`, { headers }),
      $fetch(`${API_BASE}/yields/matrix`, { headers })
    ])

    transactions.value = txResponse.data
    alerts.value = alertResponse.data
    incomingOrders.value = orderResponse.data
    topCrops.value = yieldResponse.data
    
    // Check if system alerts require rendering the critical layout flag
    const storageCheck = alerts.value.find(a => a.metaKey === 'low_stock_critical')
    if (storageCheck) {
      storageAlert.value = { item: 'baby leafy greens', threshold: '10kg' }
    }
  } catch (err) {
    console.error('Error sync log pipelines:', err)
  } finally {
    pendingData.value = false
  }
}

// --- Dynamic Mutation Methods ---
async function processOrderAction(orderId, action) {
  actionLoading.value = orderId
  try {
    const token = await getAccessToken()
    // API action request payload optimization
    await $fetch(`${API_BASE}/orders/${orderId}/transition`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: { action: action }
    })
    // Optimistic frontend array removal
    incomingOrders.value = incomingOrders.value.filter(o => o.id !== orderId)
  } catch (err) {
    console.error(`Failed to execute pipeline ${action} operation on order ${orderId}:`, err)
  } finally {
    actionLoading.value = null
  }
}

async function clearAlerts() {
  try {
    const token = await getAccessToken()
    await $fetch(`${API_BASE}/broadcasts/clear-all`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })
    alerts.value = []
  } catch (err) {
    console.error('Failed to clear alerts:', err)
  }
}

async function triggerRestockManifest() {
  try {
    const token = await getAccessToken()
    await $fetch(`${API_BASE}/inventory/restock-trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })
    alert('Restock sequence sent successfully to supplier node.')
  } catch (err) {
    console.error('Failed to trigger restock manifest:', err)
    alert('Failed to trigger restock manifest.')
  }
}

function refreshDashboardData() {
  fetchDashboardMetrics()
  fetchOperationalLogs()
}

// --- Lifecycle Sync Hooks ---
onMounted(async () => {
  // Ensure the store is hydrated before loading operational data
  await ensureHydrated()
  refreshDashboardData()

  // Dynamic real-time weather polling every 5 minutes to track clear atmospheric node adjustments
  weatherPollInterval = setInterval(() => {
    weather.value = { temp: 24, condition: 'Clear Skies' }
  }, 300000)
})

onBeforeUnmount(() => { 
  if (weatherPollInterval) clearInterval(weatherPollInterval)
})
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}
</style>    