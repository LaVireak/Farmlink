<template>
  <main class="flex-1 bg-[#F5F7F3] px-6 py-8 md:px-10 min-h-screen font-sans antialiased">
    <div class="mb-8 pb-5 border-b border-gray-200/50">
      <FarmerHeader title="Business Analytics" />
    </div>

    <!-- Controls Row -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-xl font-black text-gray-900 tracking-tight">Performance Analytics</h2>
        <p class="text-xs text-gray-500 mt-1">Real-time metrics, transaction trends, and crop yield forecasts.</p>
      </div>
      
      <div class="flex items-center gap-3">
        <div class="bg-white rounded-xl p-1 border border-gray-200/60 shadow-xs flex items-center gap-1">
          <button 
            v-for="range in ['Week', 'Month', 'Year']" 
            :key="range"
            @click="activeRange = range"
            :class="[
              'px-4 py-1.5 rounded-lg text-xs font-bold transition-all',
              activeRange === range ? 'bg-[#2d6a4f] text-white shadow-xs' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            ]"
          >
            {{ range }}
          </button>
        </div>

        <button 
          @click="exportReport"
          class="flex items-center gap-2 px-4 py-2.5 bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-extrabold rounded-xl transition-all shadow-sm active:scale-95"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Export CSV
        </button>
      </div>
    </div>

    <!-- 4-Card Statistics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <!-- Card 1: Gross Sales -->
      <div class="bg-white rounded-2xl border border-gray-200/50 p-6 flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all duration-300 relative overflow-hidden group">
        <div class="absolute -right-3 -top-3 text-emerald-100/30 group-hover:scale-110 transition-transform">
          <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wider text-gray-400 font-extrabold mb-1">Gross Sales</p>
          <p class="text-3xl font-black text-gray-950 tracking-tight">${{ currentData.sales.toLocaleString() }}</p>
        </div>
        <div class="flex items-center gap-1 mt-4 text-emerald-700 bg-emerald-50 border border-emerald-100/50 w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold">
          <span>+{{ currentData.growth }}% vs prev</span>
        </div>
      </div>

      <!-- Card 2: Crop Yield -->
      <div class="bg-white rounded-2xl border border-gray-200/50 p-6 flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all duration-300 relative overflow-hidden group">
        <div class="absolute -right-3 -top-3 text-sky-100/30 group-hover:scale-110 transition-transform">
          <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M17 9h-4V5H9v4H5v4h4v4h4v-4h4V9zm-5 12A9 9 0 1121 12a9 9 0 01-9 9z"/></svg>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wider text-gray-400 font-extrabold mb-1">Total Harvest Yield</p>
          <p class="text-3xl font-black text-gray-950 tracking-tight">{{ currentData.yield.toLocaleString() }} <span class="text-xs font-bold text-gray-500">kg</span></p>
        </div>
        <div class="flex items-center gap-1 mt-4 text-sky-700 bg-sky-50 border border-sky-100/50 w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold">
          <span>Target Achieved</span>
        </div>
      </div>

      <!-- Card 3: Inbound Orders -->
      <div class="bg-white rounded-2xl border border-gray-200/50 p-6 flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all duration-300 relative overflow-hidden group">
        <div class="absolute -right-3 -top-3 text-indigo-100/30 group-hover:scale-110 transition-transform">
          <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/></svg>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wider text-gray-400 font-extrabold mb-1">Transactions Logged</p>
          <p class="text-3xl font-black text-gray-950 tracking-tight">{{ currentData.transactions }}</p>
        </div>
        <div class="flex items-center gap-1 mt-4 text-indigo-700 bg-indigo-50 border border-indigo-100/50 w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold">
          <span>99.2% Fulfillment</span>
        </div>
      </div>

      <!-- Card 4: Global Rating -->
      <div class="bg-white rounded-2xl border border-gray-200/50 p-6 flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all duration-300 relative overflow-hidden group">
        <div class="absolute -right-3 -top-3 text-amber-100/30 group-hover:scale-110 transition-transform">
          <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        </div>
        <div>
          <p class="text-xs uppercase tracking-wider text-gray-400 font-extrabold mb-1">Client Satisfaction</p>
          <p class="text-3xl font-black text-gray-950 tracking-tight">{{ currentData.satisfaction }} <span class="text-xs font-bold text-gray-500">/ 5.0</span></p>
        </div>
        <div class="flex items-center gap-1 mt-4 text-amber-700 bg-amber-50 border border-amber-100/50 w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold">
          <span>★ Top Rated Partner</span>
        </div>
      </div>
    </div>

    <!-- Main Chart Section & Categories -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
      <!-- Premium SVG Performance Chart -->
      <div class="bg-white rounded-2xl border border-gray-200/50 shadow-xs p-6 lg:col-span-2">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-base font-black text-gray-900 tracking-tight">Sales Over Time</h3>
          <span class="text-xs font-semibold text-gray-400">Total Settlement Path</span>
        </div>

        <div class="relative w-full h-72">
          <!-- Custom SVG Dashboard Chart -->
          <svg viewBox="0 0 500 200" class="w-full h-full overflow-visible">
            <!-- Grid Lines -->
            <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" stroke-width="1.5" stroke-dasharray="4" />
            <line x1="40" y1="70" x2="480" y2="70" stroke="#f1f5f9" stroke-width="1.5" stroke-dasharray="4" />
            <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" stroke-width="1.5" stroke-dasharray="4" />
            <line x1="40" y1="170" x2="480" y2="170" stroke="#f1f5f9" stroke-width="1.5" />

            <!-- Glow Filter -->
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#2d6a4f" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#2d6a4f" stop-opacity="0.0" />
              </linearGradient>
            </defs>

            <!-- Line Path Area -->
            <path :d="chartPathArea" fill="url(#chartGradient)" />

            <!-- Line Path -->
            <path 
              :d="chartLinePath" 
              fill="none" 
              stroke="#2d6a4f" 
              stroke-width="3" 
              stroke-linecap="round"
              stroke-linejoin="round"
              class="transition-all duration-700 ease-in-out"
            />

            <!-- Interactive Points -->
            <circle 
              v-for="(point, i) in currentData.points" 
              :key="i"
              :cx="40 + (i * 440) / (currentData.points.length - 1)"
              :cy="170 - (point * 150) / 100"
              r="5"
              fill="#2d6a4f"
              stroke="#ffffff"
              stroke-width="2.5"
              class="cursor-pointer hover:r-7 transition-all duration-150"
            />

            <!-- X Axis Labels -->
            <text 
              v-for="(label, i) in currentData.labels" 
              :key="'lbl-'+i"
              :x="40 + (i * 440) / (currentData.points.length - 1)"
              y="192"
              fill="#94a3b8"
              font-size="9"
              font-weight="bold"
              text-anchor="middle"
            >
              {{ label }}
            </text>
          </svg>
        </div>
      </div>

      <!-- Categories & Product Allocation Card -->
      <div class="bg-white rounded-2xl border border-gray-200/50 shadow-xs p-6 flex flex-col justify-between">
        <div>
          <h3 class="text-base font-black text-gray-900 tracking-tight mb-5">Product Category Mix</h3>
          
          <div class="space-y-4">
            <div 
              v-for="cat in currentData.categories" 
              :key="cat.name"
              class="space-y-1.5"
            >
              <div class="flex justify-between text-xs font-bold text-gray-700">
                <span class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: cat.color }"></span>
                  {{ cat.name }}
                </span>
                <span>{{ cat.percentage }}%</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500" :style="{ width: cat.percentage + '%', backgroundColor: cat.color }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-5 border-t border-gray-100 mt-6 text-xs text-gray-400 font-medium">
          Mix calculated via live harvest allocation ledger.
        </div>
      </div>
    </div>

    <!-- Bottom Matrix Row: Yield Performance & Logs -->
    <div class="bg-white rounded-2xl border border-gray-200/50 shadow-xs p-6">
      <h3 class="text-base font-black text-gray-900 tracking-tight mb-6">Top Yield & Harvest Metrics</h3>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="pb-3 text-[10px] uppercase tracking-wider text-gray-400 font-bold">Crop / Produce</th>
              <th class="pb-3 text-[10px] uppercase tracking-wider text-gray-400 font-bold">Est. Yield (kg)</th>
              <th class="pb-3 text-[10px] uppercase tracking-wider text-gray-400 font-bold">Status</th>
              <th class="pb-3 text-[10px] uppercase tracking-wider text-gray-400 font-bold text-right">Settlement Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr 
              v-for="item in currentData.crops" 
              :key="item.name"
              class="group hover:bg-gray-50/50 transition-all duration-150"
            >
              <td class="py-4 text-sm font-bold text-gray-900">{{ item.name }}</td>
              <td class="py-4 text-sm font-black text-gray-950">{{ item.yield }} kg</td>
              <td class="py-4">
                <span 
                  class="inline-flex items-center text-[10px] font-extrabold px-2.5 py-0.5 rounded-full"
                  :class="[
                    item.status === 'High Demand' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/30' :
                    item.status === 'Stable' ? 'bg-sky-50 text-sky-700 border border-sky-200/30' :
                    'bg-amber-50 text-amber-700 border border-amber-200/30'
                  ]"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="py-4 text-right">
                <button class="px-3.5 py-1.5 bg-[#F5F7F3] hover:bg-[#2d6a4f] hover:text-white border border-gray-200/80 hover:border-[#2d6a4f] rounded-xl text-xs font-bold text-gray-600 transition-all active:scale-95">
                  Invoice Ledger
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  middleware: 'farmer',
  layout: 'farmer'
})

const activeRange = ref('Month')

// High-fidelity structured metrics based on the active dynamic time ranges
const dataStore = {
  Week: {
    sales: 3420,
    yield: 1850,
    transactions: 24,
    satisfaction: 4.9,
    growth: 6.2,
    points: [20, 35, 42, 60, 55, 78, 88],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    categories: [
      { name: 'Root Vegetables', percentage: 45, color: '#2d6a4f' },
      { name: 'Leafy Greens', percentage: 35, color: '#52b788' },
      { name: 'Herbs & Alliums', percentage: 20, color: '#95d5b2' }
    ],
    crops: [
      { name: 'Organic Heirloom Carrots', yield: 850, status: 'High Demand' },
      { name: 'Fresh Sweet Bananas', yield: 620, status: 'Stable' },
      { name: 'Organic Bell Peppers', yield: 380, status: 'High Demand' }
    ]
  },
  Month: {
    sales: 14290,
    yield: 8240,
    transactions: 142,
    satisfaction: 4.8,
    growth: 12.4,
    points: [15, 30, 45, 38, 55, 75, 84],
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
    categories: [
      { name: 'Root Vegetables', percentage: 50, color: '#2d6a4f' },
      { name: 'Leafy Greens', percentage: 30, color: '#52b788' },
      { name: 'Herbs & Alliums', percentage: 20, color: '#95d5b2' }
    ],
    crops: [
      { name: 'Organic Heirloom Carrots', yield: 4200, status: 'High Demand' },
      { name: 'Fresh Sweet Bananas', yield: 3100, status: 'Stable' },
      { name: 'Organic Bell Peppers', yield: 2150, status: 'High Demand' }
    ]
  },
  Year: {
    sales: 171480,
    yield: 98920,
    transactions: 1684,
    satisfaction: 4.9,
    growth: 24.8,
    points: [10, 25, 40, 35, 52, 68, 92],
    labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7'],
    categories: [
      { name: 'Root Vegetables', percentage: 52, color: '#2d6a4f' },
      { name: 'Leafy Greens', percentage: 28, color: '#52b788' },
      { name: 'Herbs & Alliums', percentage: 20, color: '#95d5b2' }
    ],
    crops: [
      { name: 'Organic Heirloom Carrots', yield: 48200, status: 'High Demand' },
      { name: 'Fresh Sweet Bananas', yield: 32900, status: 'Stable' },
      { name: 'Organic Bell Peppers', yield: 27820, status: 'High Demand' }
    ]
  }
}

const currentData = computed(() => dataStore[activeRange.value])

// Dynamically compute the path for the line graph
const chartLinePath = computed(() => {
  const points = currentData.value.points
  const step = 440 / (points.length - 1)
  return points.map((p, i) => {
    const x = 40 + i * step
    const y = 170 - (p * 150) / 100
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
})

// Dynamically compute the path for the linear gradient area
const chartPathArea = computed(() => {
  const points = currentData.value.points
  const step = 440 / (points.length - 1)
  const lineCoords = points.map((p, i) => {
    const x = 40 + i * step
    const y = 170 - (p * 150) / 100
    return `L ${x} ${y}`
  }).join(' ')

  const startX = 40
  const endX = 40 + (points.length - 1) * step
  return `M ${startX} 170 ${lineCoords} L ${endX} 170 Z`
})

function exportReport() {
  alert('Exporting operational ledgers to CSV format.')
}
</script>