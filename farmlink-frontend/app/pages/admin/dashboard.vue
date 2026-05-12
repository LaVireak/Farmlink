<template>
    <div class="p-10 space-y-6 bg-[#f7fdf4]">
        <AdminProfileDropdown title="Dashboard" />
        <section class="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <AdminStatsCard title="Users" :value="totalUsers" :percent="userGrowth" :icon="Users" />
            <AdminStatsCard title="Orders" :value="totalOrders" :percent="orderGrowth" :icon="ShoppingCart" />
            <AdminStatsCard title="Revenue" :value="formattedRevenue" :percent="revenueGrowth" :icon="DollarSign" />
            <AdminStatsCard title="Products" :value="totalProducts" :percent="productGrowth" :icon="Package" />
        </section>
        <section class="grid grid-cols-2 gap-6 mb-8">
            <div class="bg-white p-4 rounded-2xl shadow">
                <h3 class="text-xl font-semibold mb-4">Sales & Orders</h3>
                <div v-if="totalOrders > 0">
                    <Line :data="lineData" :options="lineOptions" />
                </div>
                <div v-else class="flex items-center justify-center h-64 text-gray-300">
                    <p class="text-sm">Waiting for data...</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl shadow w-full min-w-[420px]">
                <h3 class="text-xl font-semibold mb-4">Order Status Breakdown</h3>
                <div class="flex justify-center">
                    <div v-if="totalOrders > 0" class="w-80 h-80">
                        <Doughnut :data="doughnutData" :options="doughnutOptions" :plugins="[ChartDataLabels]" />
                    </div>
                    <div v-else class="w-80 h-80 flex items-center justify-center text-gray-300">
                        <p class="text-sm">Waiting for data...</p>
                    </div>
                </div>
            </div>
        </section>
        <section class="grid grid-cols-2 gap-6">

            <div class="bg-white rounded-2xl shadow p-5 w-full">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold">Latest Products</h3>
            <button class="text-sm text-green-600 hover:underline font-medium">View all</button>
        </div>
        <div class="grid grid-cols-2 gap-3">
            <div
                v-for="product in products"
                :key="product.id"
                class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/40 transition cursor-pointer"
            >
                <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
                </div>
                <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5 mb-0.5">
                        <span class="text-[10px] font-medium px-1.5 py-0.5 rounded-full" :class="categoryClass(product.category)">
                            {{ product.category }}
                        </span>
                    </div>
                    <p class="text-sm font-semibold text-gray-800 truncate">{{ product.name }}</p>
                    <p class="text-sm font-bold text-green-600 mt-0.5">${{ product.price }}</p>
                    <div class="flex items-center justify-between mt-1">
                        <p class="text-[11px] text-gray-400">{{ product.time }}</p>
                        <span class="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                            :class="product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'">
                            {{ product.inStock ? 'In stock' : 'Out' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

            <div class="bg-white rounded-2xl shadow p-5 w-full">
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold">Top Performing Farmers</h3>
        <button class="text-sm text-green-600 hover:underline font-medium">View all</button>
    </div>
    <table class="w-full text-sm">
        <thead>
            <tr class="text-left text-xs text-gray-400 border-b border-gray-100">
                <th class="pb-3 font-medium">Farmer</th>
                <th class="pb-3 font-medium">Revenue</th>
                <th class="pb-3 font-medium">Orders</th>
                <th class="pb-3 font-medium">Rating</th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="farmer in topFarmers"
                :key="farmer.id"
                class="border-b border-gray-50 hover:bg-gray-50 transition"
            >
                <td class="py-3 pr-2">
                    <div class="flex items-center gap-2">
                        <img
                            :src="farmer.image"
                            :alt="farmer.name"
                            class="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div>
                            <p class="font-medium text-gray-800 truncate max-w-[90px]">{{ farmer.name }}</p>
                            <p class="text-[11px] text-gray-400 truncate max-w-[90px]">{{ farmer.farm }}</p>
                        </div>
                    </div>
                </td>
                <td class="py-3 pr-2 font-semibold text-gray-800">${{ farmer.revenue.toLocaleString() }}</td>
                <td class="py-3 pr-2 text-gray-500">{{ farmer.orders }}</td>
                <td class="py-3">
                    <span class="text-[11px] font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                        ⭐ {{ farmer.rating }}
                    </span>
                </td>
            </tr>
        </tbody>
    </table>
</div>
        </section>
    </div>
</template>

<script setup>
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { Doughnut, Line } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {
  Chart as ChartJS,
  Title, Tooltip, Legend,
  LineElement, PointElement,
  CategoryScale, LinearScale,
  ArcElement
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Title, Tooltip, Legend,
  LineElement, PointElement,
  CategoryScale, LinearScale,
)

definePageMeta({
    layout: 'admin',
})

const allUsers = ref([])
const allOrders = ref([])
const allProducts = ref([])
const allFarmers = ref([])

const totalUsers = computed(() => allUsers.value.length)
const totalOrders = computed(() => allOrders.value.length)
const totalRevenue = computed(() => allOrders.value.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.amount, 0))
const formattedRevenue = computed(() => `$${totalRevenue.value.toLocaleString()}`)
const totalProducts = computed(() => allProducts.value.length)

const userGrowth = ref(0)
const orderGrowth = ref(0)
const revenueGrowth = ref(0)
const productGrowth = ref(0)

const orderStatusCounts = computed(() => {
    const counts = { Completed: 0, Cancelled: 0, Pending: 0, Processing: 0 }
    allOrders.value.forEach(o => {
        if (counts.hasOwnProperty(o.status)) counts[o.status]++
    })
    return counts
})

const products = computed(() => allProducts.value.slice(0, 4))

const topFarmers = computed(() => 
    allFarmers.value.sort((a, b) => b.revenue - a.revenue).slice(0, 5)
)

const lineData = computed(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
        label: 'Sales',
        data: [120, 190, 300, 250, 220, totalOrders.value * 10],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.2)',
        tension: 0.4,
        fill: true,
    }]
}))

const lineOptions = {
    responsive: true,
    plugins: {
        legend: { display: false },
    }
}

const doughnutData = computed(() => ({
    labels: ['Completed', 'Cancelled', 'Pending', 'Processing'],
    datasets: [
        {
            data: [
                orderStatusCounts.value.Completed,
                orderStatusCounts.value.Cancelled,
                orderStatusCounts.value.Pending,
                orderStatusCounts.value.Processing
            ],
            backgroundColor: ['#22c55e', '#ef4444', '#facc15', '#3b82f6'],
            borderWidth: 0
        }
    ]
}))

const doughnutOptions = {
    responsive: true,
    cutout: '75%',
    plugins: {
        legend: {
            position: 'bottom',
            align: 'center',
            maxHeight: 80,
            labels: {
                usePointStyle: true,
                boxWidth: 10,
                boxHeight: 10,
                padding: 26
            }
        },
        datalabels: {
            color: '#ffffff',
            font: { weight: 'semi-bold', size: 10 },
            formatter: (value, context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = Math.round((value / total) * 100)
                return `${percentage}%`
            }
        }
    }
}

const categoryClass = (category) => {
    const map = {
        Supplies: 'bg-blue-100 text-blue-700',
        Grains:   'bg-yellow-100 text-yellow-700',
        Herbs:    'bg-green-100 text-green-700',
        Organic:  'bg-amber-100 text-amber-700',
    }
    return map[category] ?? 'bg-gray-100 text-gray-600'
}

const statusClass = (status) => {
    const map = {
        Completed:  'bg-green-100 text-green-700',
        Pending:    'bg-yellow-100 text-yellow-700',
        Processing: 'bg-blue-100 text-blue-700',
        Cancelled:  'bg-red-100 text-red-600',
    }
    return map[status] ?? 'bg-gray-100 text-gray-600'
}
</script>

<style scoped>
</style>