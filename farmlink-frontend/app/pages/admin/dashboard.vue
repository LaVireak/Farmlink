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
                <div v-else class="flex items-center justify-center h-64 text-gray-400">
                    <p class="text-sm">No Sales and Orders Recorded </p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl shadow w-full min-w-[420px]">
                <h3 class="text-xl font-semibold mb-4">Revenue by Category</h3>
                <div class="flex justify-center">
                    <div v-if="totalOrders > 0" class="w-80 h-80">
                        <Doughnut :data="doughnutData" :options="doughnutOptions" :plugins="[ChartDataLabels]" />
                    </div>
                    <div v-else class="w-80 h-80 flex items-center justify-center text-gray-400">
                        <p class="text-sm">No Revenue Recorded </p>
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
    middleware: 'admin',
    layout: 'admin',
})

import { useAdmin } from '~/services/admin.service'
import { useAuthStore } from '~/stores/auth.store'
import { onMounted } from 'vue'

const auth = useAuthStore()
const { 
    loading, 
    dashboardStats,
    users: allUsersRaw, 
    orders: allOrdersRaw, 
    products: allProductsRaw, 
    farmers: allFarmersRaw, 
    fetchDashboard 
} = useAdmin()

const allUsers = computed(() => allUsersRaw.value)

const allOrders = computed(() => {
    return allOrdersRaw.value.map(o => ({
        id: o.id,
        status: mapOrderStatus(o.status),
        amount: parseFloat(o.totalAmount ?? o.total_amount ?? 0),
        items: o.items ?? [],
        createdAt: o.createdAt ?? o.created_at,
    }))
})

const allProducts = computed(() => {
    return allProductsRaw.value.map(p => ({
        id: p.id,
        name: p.nameEn ?? p.name_en ?? p.name ?? '—',
        category: p.category?.nameEn ?? p.category?.name ?? p.categoryId ?? 'Other',
        price: parseFloat(p.pricePerUnit ?? p.price_per_unit ?? 0).toFixed(2),
        image: p.thumbnailUrl ?? p.thumbnail_url ?? 'https://placehold.co/80x80?text=IMG',
        inStock: (p.stockQuantity ?? p.stock ?? 0) > 0,
        time: p.createdAt 
            ? new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
            : '—'
    }))
})

const allFarmers = computed(() => {
    return allFarmersRaw.value.map(f => ({
        id: f.id,
        name: f.user ? `${f.user.firstName ?? ''} ${f.user.lastName ?? ''}`.trim() : '—',
        farm: f.farmName ?? '—',
        image: f.user?.avatarUrl ?? 'https://placehold.co/80x80?text=FARMER',
        revenue: parseFloat(f.totalSales ?? 0),
        orders: f.totalSales > 0 ? Math.round(parseFloat(f.totalSales) / 15) : 0,
        rating: f.avgRating ? parseFloat(f.avgRating).toFixed(1) : '5.0',
    }))
})

const totalUsers = computed(() => dashboardStats.value?.totalUsers ?? allUsers.value.length)
const totalOrders = computed(() => dashboardStats.value?.totalOrders ?? allOrders.value.length)
const totalRevenue = computed(() => dashboardStats.value?.totalRevenue ?? allOrders.value.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.amount, 0))
const formattedRevenue = computed(() => `$${totalRevenue.value.toLocaleString()}`)
const totalProducts = computed(() => allProducts.value.length)

const calculateGrowth = (items) => {
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

    let countThisMonth = 0
    let countLastMonth = 0

    items.forEach(item => {
        const dateStr = item.createdAt ?? item.created_at
        if (!dateStr) return
        const date = new Date(dateStr)
        
        if (date >= thisMonthStart && date <= now) {
            countThisMonth++
        } else if (date >= lastMonthStart && date <= lastMonthEnd) {
            countLastMonth++
        }
    })

    if (countLastMonth === 0) {
        return countThisMonth > 0 ? 100 : 0
    }
    return Math.round(((countThisMonth - countLastMonth) / countLastMonth) * 100)
}

const calculateRevenueGrowth = (orders) => {
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

    let revThisMonth = 0
    let revLastMonth = 0

    orders.forEach(order => {
        const lowerStatus = String(order.status).toLowerCase()
        if (lowerStatus !== 'completed') return
        const dateStr = order.createdAt ?? order.created_at
        if (!dateStr) return
        const date = new Date(dateStr)
        const amount = parseFloat(order.totalAmount ?? order.total_amount ?? order.amount ?? 0)

        if (date >= thisMonthStart && date <= now) {
            revThisMonth += amount
        } else if (date >= lastMonthStart && date <= lastMonthEnd) {
            revLastMonth += amount
        }
    })

    if (revLastMonth === 0) {
        return revThisMonth > 0 ? 100 : 0
    }
    return Math.round(((revThisMonth - revLastMonth) / revLastMonth) * 100)
}

const userGrowth = computed(() => calculateGrowth(allUsersRaw.value))
const orderGrowth = computed(() => calculateGrowth(allOrdersRaw.value))
const revenueGrowth = computed(() => calculateRevenueGrowth(allOrdersRaw.value))
const productGrowth = computed(() => calculateGrowth(allProductsRaw.value))

function mapOrderStatus(status) {
    const lower = String(status).toLowerCase();
    if (lower === 'completed') return 'Completed';
    if (lower === 'cancelled') return 'Cancelled';
    if (lower === 'pending') return 'Pending';
    return 'Processing';
}

onMounted(async () => {
    await auth.hydrate()
    if (!auth.accessToken) {
        await navigateTo('/auth/signin')
        return
    }
    fetchDashboard()
})


const revenueByCategory = computed(() => {
    const categories = {}
    
    allOrders.value.forEach(order => {
        if (order.status !== 'Completed') return
        const items = order.items || []
        items.forEach(item => {
            const catName = item.product?.category?.nameEn ?? item.product?.category?.name ?? 'Other'
            const subtotal = parseFloat(item.subtotal ?? 0)
            
            if (!categories[catName]) {
                categories[catName] = 0
            }
            categories[catName] += subtotal
        })
    })
    
    return categories
})

const products = computed(() => allProducts.value.slice(0, 4))

const topFarmers = computed(() => 
    [...allFarmers.value].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
)

const salesAndOrdersChartData = computed(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const now = new Date()
    
    const labels = []
    const monthlyCounts = {}
    const monthlySales = {}
    
    // Set up the last 6 months dynamically
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const label = months[d.getMonth()]
        labels.push(label)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        monthlyCounts[key] = 0
        monthlySales[key] = 0
    }
    
    // Group orders
    allOrders.value.forEach(order => {
        const dateStr = order.createdAt
        if (!dateStr) return
        const date = new Date(dateStr)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        if (monthlyCounts.hasOwnProperty(key)) {
            monthlyCounts[key]++
            if (order.status === 'Completed') {
                monthlySales[key] += order.amount
            }
        }
    })
    
    const salesData = []
    const ordersData = []
    labels.forEach((_, index) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        salesData.push(monthlySales[key])
        ordersData.push(monthlyCounts[key])
    })
    
    return { labels, salesData, ordersData }
})

const lineData = computed(() => ({
    labels: salesAndOrdersChartData.value.labels,
    datasets: [
        {
            label: 'Sales ($)',
            data: salesAndOrdersChartData.value.salesData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.1)',
            tension: 0.4,
            fill: true,
            yAxisID: 'y',
        },
        {
            label: 'Orders Placed',
            data: salesAndOrdersChartData.value.ordersData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            tension: 0.4,
            fill: true,
            yAxisID: 'y1',
        }
    ]
}))

const lineOptions = {
    responsive: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        legend: { display: true, position: 'top' },
    },
    scales: {
        y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
                display: true,
                text: 'Sales ($)'
            },
            grid: {
                drawOnChartArea: true,
            }
        },
        y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
                display: true,
                text: 'Orders Count'
            },
            grid: {
                drawOnChartArea: false,
            }
        }
    }
}

const doughnutData = computed(() => {
    const dataObj = revenueByCategory.value
    const labels = Object.keys(dataObj)
    const data = Object.values(dataObj)
    
    if (labels.length === 0) {
        return {
            labels: ['Fruits', 'Vegetables', 'Leafy Greens', 'Herbs'],
            datasets: [{
                data: [0, 0, 0, 0],
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
                borderWidth: 0
            }]
        }
    }
    
    const colors = ['#22c55e', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ec4899', '#f43f5e', '#14b8a6']
    
    return {
        labels,
        datasets: [
            {
                data,
                backgroundColor: labels.map((_, i) => colors[i % colors.length]),
                borderWidth: 0
            }
        ]
    }
})

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