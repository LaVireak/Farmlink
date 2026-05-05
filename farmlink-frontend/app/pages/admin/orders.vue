<template>
    <div class="p-6 space-y-6">

        <div>
            <h1 class="text-xl font-bold text-gray-900">Order Management</h1>
            <p class="text-sm text-gray-400 mt-0.5">Review and manage customer orders across the platform</p>
        </div>

        <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <template v-if="loadingStats">
                <div v-for="i in 4" :key="i" class="h-24 bg-gray-100 rounded-2xl animate-pulse" />
            </template>
            <template v-else>
                <AdminStatsCard
                    v-for="stat in stats" :key="stat.title"
                    :title="stat.title"
                    :value="stat.value"
                    :percent="stat.percent"
                    :icon="stat.icon"
                />
            </template>
        </section>

        <section class="grid grid-cols-2 gap-6">
            <div class="border border-gray-100 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm bg-white">
                <div class="flex items-start justify-between gap-4 mb-6">
                    <h2 class="text-sm sm:text-base font-semibold text-gray-900 tracking-tight">
                        Order Volume
                        <span class="text-gray-400 font-normal">
                            (Last {{ activePeriod === '7D' ? '7' : activePeriod.replace('D','').replace('Y','365') }} Days)
                        </span>
                    </h2>
                    <div class="flex items-center gap-0.5 bg-gray-100 rounded-lg p-1 shrink-0">
                        <button
                            v-for="p in periods" :key="p"
                            @click="activePeriod = p; fetchOrderVolume()"
                            :class="[
                                'text-xs font-medium px-2.5 py-1 rounded-md transition-all duration-150',
                                activePeriod === p
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'
                            ]"
                        >{{ p }}</button>
                    </div>
                </div>

                <div v-if="loadingChart" class="h-60 bg-gray-50 rounded-xl animate-pulse" />
                <template v-else>
                    <div class="flex gap-2 sm:gap-3">
                        <div class="flex flex-col-reverse justify-between py-[10px] shrink-0 w-7 sm:w-8">
                            <span
                                v-for="tick in yTicks" :key="tick"
                                class="text-[10px] sm:text-[11px] text-gray-300 font-mono text-right leading-none"
                            >{{ tick }}</span>
                        </div>

                        <div class="relative flex-1 h-44 sm:h-52 lg:h-60" ref="chartArea">
                            <svg
                                class="w-full h-full overflow-visible"
                                :viewBox="`0 0 ${W} ${H}`"
                                preserveAspectRatio="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <defs>
                                    <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%"   stop-color="#22c55e" stop-opacity="0.22" />
                                        <stop offset="100%" stop-color="#22c55e" stop-opacity="0.01" />
                                    </linearGradient>
                                </defs>

                                <line
                                    v-for="tick in yTicks" :key="'g' + tick"
                                    x1="0" :y1="ys(tick)" :x2="W" :y2="ys(tick)"
                                    stroke="#f3f4f6" stroke-width="1.2"
                                />

                                <path :d="areaPath" fill="url(#fillGrad)" />
                                <path
                                    :d="linePath"
                                    fill="none"
                                    stroke="#16a34a"
                                    stroke-width="2.2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="chart-line"
                                />

                                <circle
                                    v-for="(pt, i) in pts" :key="'hit' + i"
                                    :cx="pt.x" :cy="pt.y" r="20"
                                    fill="transparent" class="cursor-pointer"
                                    @mouseenter="onEnter($event, i)"
                                    @mouseleave="onLeave"
                                />
                                <circle
                                    v-for="(pt, i) in pts" :key="'dot' + i"
                                    :cx="pt.x" :cy="pt.y" r="3.5"
                                    fill="white" stroke="#16a34a" stroke-width="2"
                                    :class="[
                                        'pointer-events-none transition-opacity duration-150',
                                        hoveredIndex === i ? 'opacity-100' : 'opacity-0'
                                    ]"
                                />
                            </svg>

                            <Transition
                                enter-active-class="transition-all duration-100 ease-out"
                                enter-from-class="opacity-0 translate-y-1"
                                leave-active-class="transition-all duration-75 ease-in"
                                leave-to-class="opacity-0 translate-y-1"
                            >
                                <div
                                    v-if="tooltip.visible"
                                    class="absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-full"
                                    :style="{ left: tooltip.x + 'px', top: (tooltip.y - 10) + 'px' }"
                                >
                                    <div class="bg-gray-900 text-white rounded-lg px-3 py-1.5 text-center shadow-xl">
                                        <div class="text-[10px] text-gray-400 leading-tight">{{ tooltip.label }}</div>
                                        <div class="text-xs font-semibold font-mono leading-tight">{{ tooltip.value }}</div>
                                    </div>
                                    <div class="w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1 rounded-sm" />
                                </div>
                            </Transition>
                        </div>
                    </div>

                    <div class="flex justify-between mt-2 pl-9 sm:pl-11">
                        <span
                            v-for="label in chartXLabels" :key="label"
                            class="text-[10px] sm:text-xs text-gray-300 font-medium"
                        >{{ label }}</span>
                    </div>
                </template>
            </div>

            <!-- Revenue by Category Bar Chart -->
            <div class="bg-white p-5 rounded-2xl shadow">
                <h3 class="text-base font-semibold mb-4">Revenue by Category</h3>
                <div v-if="loadingRevenue" class="h-52 bg-gray-50 rounded-xl animate-pulse" />
                <Bar v-else :data="revenueBarData" :options="barOptions" />
            </div>
        </section>

        <!-- ── Monthly Goals + Recent Activity ──────────────────────────────────── -->
        <section class="grid grid-cols-2 gap-6">

            <!-- Monthly Goals -->
            <div class="bg-white rounded-2xl shadow p-5">
                <h3 class="text-base font-semibold mb-2">Monthly Goals</h3>
                <div v-if="loadingGoals" class="h-40 bg-gray-50 rounded-xl animate-pulse mt-4" />
                <div v-else class="grid grid-cols-3 gap-2 mt-4">
                    <div
                        v-for="goal in monthlyGoals" :key="goal.label"
                        class="flex flex-col items-center gap-3"
                    >
                        <svg width="120" height="120" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="48" fill="none" stroke="#f3f4f6" stroke-width="10" />
                            <circle
                                cx="60" cy="60" r="48"
                                fill="none"
                                :stroke="goal.stroke"
                                stroke-width="10"
                                stroke-linecap="round"
                                :stroke-dasharray="`${(goal.percent / 100) * 301.6} 301.6`"
                                transform="rotate(-90 60 60)"
                                style="transition: stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1);"
                            />
                            <text x="60" y="55" text-anchor="middle" dominant-baseline="middle"
                                :fill="goal.stroke" font-size="20" font-weight="700"
                                font-family="ui-sans-serif, system-ui, sans-serif"
                            >{{ goal.percent }}%</text>
                            <text x="60" y="73" text-anchor="middle" fill="#9ca3af" font-size="9.5"
                                font-family="ui-sans-serif, sans-serif"
                            >of goal</text>
                        </svg>
                        <div class="text-center space-y-0.5">
                            <p class="text-sm font-semibold text-gray-800">{{ goal.label }}</p>
                            <p class="text-xs text-gray-400">{{ goal.current }}</p>
                            <p class="text-xs font-medium" :style="{ color: goal.stroke }">Goal: {{ goal.target }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white rounded-2xl shadow p-5">
                <h3 class="text-base font-semibold mb-4">Recent Activity</h3>
                <div v-if="loadingActivity" class="space-y-3">
                    <div v-for="i in 5" :key="i" class="h-10 bg-gray-50 rounded-lg animate-pulse" />
                </div>
                <div v-else>
                    <div
                        v-for="act in activities" :key="act.id"
                        class="flex gap-3 py-3 border-b border-gray-50 last:border-0"
                    >
                        <div class="w-2 h-2 rounded-full mt-2 flex-shrink-0" :class="act.dotColor"></div>
                        <div>
                            <p class="text-sm text-gray-700 leading-snug">{{ act.text }}</p>
                            <p class="text-xs text-gray-400 mt-0.5">{{ act.time }}</p>
                        </div>
                    </div>
                </div>
            </div>

        </section>

        <!-- ── Recent Orders ──────────────────────────────────────────────────── -->
        <AdminOrderTable
            :loading="loadingOrders"
            :orders="orders"
            :filtered-orders="filteredOrders"
            :filters="orderFilters"
            :has-active-filters="hasActiveFilters"
            :status-class="statusClass"
            :initials="initials"
            @update:filters="orderFilters = $event"
            @reset-filters="resetOrderFilters"
        />

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { DollarSign, Package, ShoppingCart, Users, Search } from 'lucide-vue-next'
import { Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title, Tooltip, Legend,
    LineElement, PointElement,
    BarElement,
    CategoryScale, LinearScale,
    ArcElement,
} from 'chart.js'

ChartJS.register(
    ArcElement,
    Title, Tooltip, Legend,
    LineElement, PointElement,
    BarElement,
    CategoryScale, LinearScale,
)

definePageMeta({ layout: 'admin' })

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

async function apiFetch(path) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
}

const loadingStats    = ref(true)
const loadingChart    = ref(true)
const loadingRevenue  = ref(true)
const loadingGoals    = ref(true)
const loadingActivity = ref(true)
const loadingOrders   = ref(true)


const mockStats = [
    { title: 'Users', value: '0', percent: 0, icon: 'users' },
    { title: 'Orders', value: '0', percent: 0, icon: 'cart' },
    { title: 'Revenue', value: '$0', percent: 0, icon: 'revenue' },
    { title: 'Products', value: '0', percent: 0, icon: 'products' },
]

const stats = ref(mockStats)

const iconMap = { users: Users, cart: ShoppingCart, revenue: DollarSign, products: Package }

async function fetchStats() {
    loadingStats.value = true
    try {
        const data = await apiFetch('/admin/stats')
        stats.value = data.map(s => ({ ...s, icon: iconMap[s.icon] ?? Package }))
    } catch (e) {
        console.error('fetchStats:', e)
        stats.value = mockStats.map(s => ({ ...s, icon: iconMap[s.icon] ?? Package }))
    } finally {
        loadingStats.value = false
    }
}

const periods      = ['7D', '30D', '60D', '90D', '1Y']
const activePeriod = ref('7D')
const chartXLabels = ref([])
const chartData    = ref([])

const W     = 800
const H     = 220
const PAD_T = 10
const PAD_B = 10
const yTicks = [0, 50, 100, 150, 200]
const yMin = 0
const yMax = 200

function ys(val) {
    return PAD_T + (1 - (val - yMin) / (yMax - yMin)) * (H - PAD_T - PAD_B)
}

const pts = computed(() =>
    chartData.value.map(([xr, yv]) => ({ x: xr * W, y: ys(yv), value: yv, xr }))
)

function spline(points) {
    if (points.length < 2) return ''
    let d = `M ${points[0].x} ${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(i - 1, 0)]
        const p1 = points[i]
        const p2 = points[i + 1]
        const p3 = points[Math.min(i + 2, points.length - 1)]
        const cp1x = p1.x + (p2.x - p0.x) / 6
        const cp1y = p1.y + (p2.y - p0.y) / 6
        const cp2x = p2.x - (p3.x - p1.x) / 6
        const cp2y = p2.y - (p3.y - p1.y) / 6
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
    }
    return d
}

const linePath = computed(() => spline(pts.value))
const areaPath = computed(() => {
    if (!pts.value.length) return ''
    const last  = pts.value[pts.value.length - 1]
    const first = pts.value[0]
    const bottom = H - PAD_B
    return `${spline(pts.value)} L ${last.x} ${bottom} L ${first.x} ${bottom} Z`
})

const hoveredIndex = ref(null)
const tooltip      = ref({ visible: false, x: 0, y: 0, label: '', value: 0 })
const chartArea    = ref(null)

function onEnter(e, i) {
    hoveredIndex.value = i
    const rect = chartArea.value.getBoundingClientRect()
    const pt   = pts.value[i]
    tooltip.value = {
        visible: true,
        x: (pt.x / W) * rect.width,
        y: (pt.y / H) * rect.height,
        label: chartXLabels.value[Math.round(pt.xr * (chartXLabels.value.length - 1))],
        value: pt.value,
    }
}

function onLeave() {
    hoveredIndex.value    = null
    tooltip.value.visible = false
}

async function fetchOrderVolume() {
    loadingChart.value = true
    try {
        const data = await apiFetch(`/admin/order-volume?period=${activePeriod.value}`)
        chartXLabels.value = data.labels
        chartData.value    = data.data
    } catch (e) {
        console.error('fetchOrderVolume:', e)
    } finally {
        loadingChart.value = false
    }
}

const revenueBarData = ref({ labels: [], datasets: [] })

const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
        x: { grid: { display: false } },
        y: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { callback: (v) => '$' + v },
        },
    },
}

async function fetchRevenueByCategory() {
    loadingRevenue.value = true
    try {
        const data = await apiFetch('/admin/revenue-by-category')
        revenueBarData.value = {
            labels: data.labels,
            datasets: [{
                label: 'Revenue ($)',
                data: data.data,
                backgroundColor: ['#15803d','#16a34a','#22c55e','#4ade80','#86efac'],
                borderRadius: 6,
            }],
        }
    } catch (e) {
        console.error('fetchRevenueByCategory:', e)
    } finally {
        loadingRevenue.value = false
    }
}

const monthlyGoals = ref([])

async function fetchGoals() {
    loadingGoals.value = true
    try {
        monthlyGoals.value = await apiFetch('/admin/goals')
    } catch (e) {
        console.error('fetchGoals:', e)
    } finally {
        loadingGoals.value = false
    }
}

const activities = ref([])

async function fetchActivity() {
    loadingActivity.value = true
    try {
        activities.value = await apiFetch('/admin/activity')
    } catch (e) {
        console.error('fetchActivity:', e)
    } finally {
        loadingActivity.value = false
    }
}

const orders = ref([])

const orderFilters = ref({
    search:    '',
    status:    '',
    dateRange: '',
    sort:      'date_desc',
})

const hasActiveFilters = computed(() =>
    orderFilters.value.search ||
    orderFilters.value.status ||
    orderFilters.value.dateRange
)

function resetOrderFilters() {
    orderFilters.value = { search: '', status: '', dateRange: '', sort: 'date_desc' }
}

const filteredOrders = computed(() => {
    let list = [...orders.value]
    const { search, status, dateRange, sort } = orderFilters.value

    if (search) {
        const q = search.toLowerCase()
        list = list.filter(o =>
            o.id.toLowerCase().includes(q) ||
            o.customer.toLowerCase().includes(q) ||
            o.product.toLowerCase().includes(q) ||
            o.status.toLowerCase().includes(q)
        )
    }

    if (status) {
        list = list.filter(o => o.status === status)
    }

    if (dateRange) {
        const now = new Date()
        now.setHours(23, 59, 59, 999)
        list = list.filter(o => {
            const orderDate = new Date(o.date)
            if (dateRange === 'today') {
                const today = new Date()
                return orderDate.toDateString() === today.toDateString()
            }
            const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24)
            return diffDays <= parseInt(dateRange)
        })
    }

    list.sort((a, b) => {
        if (sort === 'date_desc')   return new Date(b.date) - new Date(a.date)
        if (sort === 'date_asc')    return new Date(a.date) - new Date(b.date)
        if (sort === 'amount_desc') return parseFloat(b.amount.replace(/[^0-9.]/g, '')) - parseFloat(a.amount.replace(/[^0-9.]/g, ''))
        if (sort === 'amount_asc')  return parseFloat(a.amount.replace(/[^0-9.]/g, '')) - parseFloat(b.amount.replace(/[^0-9.]/g, ''))
        return 0
    })

    return list
})

async function fetchOrders() {
    loadingOrders.value = true
    try {
        orders.value = await apiFetch('/admin/orders')
    } catch (e) {
        console.error('fetchOrders:', e)
    } finally {
        loadingOrders.value = false
    }
}

const initials = (name) => name.split(' ').map(n => n[0]).join('')
const statusClass = (status) => {
    const map = {
        Completed:  'bg-green-100 text-green-700',
        Pending:    'bg-yellow-100 text-yellow-700',
        Processing: 'bg-blue-100 text-blue-700',
        Cancelled:  'bg-red-100 text-red-600',
    }
    return map[status] ?? 'bg-gray-100 text-gray-600'
}

onMounted(() => {
    fetchStats()
    fetchOrderVolume()
    fetchRevenueByCategory()
    fetchGoals()
    fetchActivity()
    fetchOrders()
})
</script>

<style scoped>
.chart-line {
    stroke-dasharray: 2000;
    stroke-dashoffset: 2000;
    animation: draw 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes draw {
    to { stroke-dashoffset: 0; }
}
</style>