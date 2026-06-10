<template>
    <div class="p-10 space-y-6 bg-[#f7fdf4]">
        <AdminProfileDropdown title="Product Management" />


        <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AdminStatsCard title="Total Products"    :value="String(products.length)"                    :percent="totalProductsGrowth"     :icon="Package" />
            <AdminStatsCard title="Total Categories"  :value="String(categories.length)"                  :percent="categoryGrowth"          :icon="Layers" />
            <AdminStatsCard title="Low Stock"         :value="String(lowStockCount)"                      :percent="lowStockProductsGrowth"  :icon="AlertTriangle" />
            <AdminStatsCard title="Featured Products" :value="String(products.filter(p => p.featured).length)" :percent="featuredProductsGrowth"  :icon="PackageCheck" />
        </section>

        <section class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 class="text-sm font-semibold text-gray-900 mb-4">Products by Category</h3>
                <div class="grid grid-cols-3 gap-3">
                    <div v-for="cat in categoryBreakdown.slice(0,3)" :key="cat.name" class="flex flex-col items-center gap-2">
                        <svg width="90" height="90" viewBox="0 0 90 90">
                            <circle cx="45" cy="45" r="36" fill="none" stroke="#f3f4f6" stroke-width="8" />
                            <circle
                                cx="45" cy="45" r="36"
                                fill="none"
                                :stroke="cat.color"
                                stroke-width="8"
                                stroke-linecap="round"
                                :stroke-dasharray="`${(cat.percent / 100) * 226.2} 226.2`"
                                transform="rotate(-90 45 45)"
                                style="transition: stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1);"
                            />
                            <text x="45" y="41" text-anchor="middle" :fill="cat.color" font-size="15" font-weight="700" font-family="ui-sans-serif,sans-serif">{{ cat.percent }}%</text>
                            <text x="45" y="54" text-anchor="middle" fill="#9ca3af" font-size="8" font-family="ui-sans-serif,sans-serif">of total</text>
                        </svg>
                        <div class="text-center">
                            <p class="text-xs font-semibold text-gray-800">{{ cat.name }}</p>
                            <p class="text-[11px] text-gray-400">{{ cat.count }} products</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 space-y-2 border-t border-gray-50 pt-4">
                    <div v-for="cat in categoryBreakdown.slice(3)" :key="cat.name + '-bar'" class="flex items-center gap-3">
                        <span class="text-xs text-gray-600 w-16 flex-shrink-0">{{ cat.name }}</span>
                        <div class="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div class="h-1.5 rounded-full transition-all duration-700" :style="{ width: cat.percent + '%', background: cat.color }"></div>
                        </div>
                        <span class="text-xs text-gray-400 w-6 text-right">{{ cat.percent }}%</span>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 class="text-sm font-semibold text-gray-900 mb-4">Product Activity</h3>
                <div class="space-y-0">
                    <div
                        v-for="act in productActivity" :key="act.id"
                        class="flex gap-3 py-3 border-b border-gray-50 last:border-0"
                    >
                        <div class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" :class="act.dotColor"></div>
                        <div class="flex-1 min-w-0">
                            <p class="text-xs text-gray-700 leading-snug">{{ act.text }}</p>
                            <p class="text-[11px] text-gray-400 mt-0.5">{{ act.time }}</p>
                        </div>
                    </div>
                    <div v-if="productActivity.length === 0" class="py-6 text-center text-xs text-gray-400">No activity yet</div>
                </div>
            </div>

        </section>

        <AdminProductTable
            :products="filteredProducts"
            :categories="categories"
            :search-query="searchQuery"
            :filter-category="filterCategory"
            :category-class="categoryClass"
            :initials="initials"
            @update:search-query="searchQuery = $event"
            @update:filter-category="filterCategory = $event"
            @view-product="openViewModal"
        />

        <teleport to="body">
            <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0 scale-95"
                leave-active-class="transition-all duration-100 ease-in" leave-to-class="opacity-0 scale-95">
                <div v-if="viewModal.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 backdrop-blur-sm p-4"
                    @click.self="viewModal.visible = false">
                    <div class="bg-white/95 backdrop-blur-md rounded-3xl max-w-2xl w-full border border-white/50 shadow-2xl relative overflow-hidden flex flex-col transition-all duration-150">
                        
                        <!-- Header visual / Image banner (Forest green gradient, full width, no white gap) -->
                        <div class="w-full h-56 md:h-64 overflow-hidden relative text-white p-5 flex flex-col bg-gradient-to-br from-[#0c2317] to-[#1c4b35]">
                            
                            <!-- Product Image (No padding, beautiful overlay shadow) -->
                            <div v-if="viewModal.product?.image" class="absolute inset-0 z-0 overflow-hidden">
                                <img :src="getProductImage(viewModal.product.image)" @error="viewModal.product.image = ''" class="w-full h-full object-cover transition-transform duration-700 ease-out" alt="Produce Image" />
                                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40 z-10"></div>
                            </div>

                            <!-- Fallback / No Photo -->
                            <div v-else class="absolute inset-0 bg-gradient-to-br from-[#0c2317] via-[#122e1f] to-[#1c4b35] z-0">
                                <div class="absolute inset-2 rounded-xl bg-[radial-gradient(#2d6a4f_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
                                <div class="absolute inset-2 rounded-xl flex flex-col items-center justify-center text-7xl select-none opacity-90">
                                    <span class="animate-bounce duration-[3000ms]">{{ getCategoryEmoji(viewModal.product?.category) }}</span>
                                    <span class="text-[9px] font-bold text-emerald-500/50 tracking-widest uppercase mt-4">NO PHOTO UPLOADED</span>
                                </div>
                            </div>

                            <!-- Header Badges -->
                            <div class="flex flex-wrap gap-2 z-20 relative">
                                <span class="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-300 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 shadow-2xs">
                                    {{ viewModal.product?.category || 'Fruits' }}
                                </span>
                                <span v-if="viewModal.product?.badge === 'Organic' || !!viewModal.product?.isOrganic" class="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/40 backdrop-blur-md rounded-lg border border-emerald-500/20 shadow-2xs flex items-center gap-1">
                                    🌱 Organic
                                </span>
                                <span v-if="!!viewModal.product?.isSeasonal" class="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/40 backdrop-blur-md rounded-lg border border-amber-500/20 shadow-2xs flex items-center gap-1">
                                    ☀️ Seasonal
                                </span>
                            </div>

                            <!-- Close Button -->
                            <button @click="viewModal.visible = false" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center shadow-md border border-white/10 hover:scale-110 active:scale-95 transition-all duration-300 z-20">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <!-- Form Details Content -->
                        <div class="w-full p-6 md:p-8 flex flex-col justify-between relative overflow-hidden bg-white rounded-b-3xl">
                            
                            <!-- Premium Background Plant Silhouette -->
                            <svg class="absolute -bottom-16 -right-16 w-52 h-52 text-[#2d6a4f]/5 pointer-events-none transform rotate-45 select-none z-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 3C11.5 3 7 7.5 7 17v2h2c9.5 0 12-4.5 12-14zm-4 4.5c-.8.8-2 .8-2.8 0s-.8-2 0-2.8 2-.8 2.8 0 .8 2 0 2.8zM3 13c0 4.4 3.6 8 8 8h2c-4.4 0-10-5.6-10-10z"/>
                            </svg>

                            <div class="z-10 relative space-y-5 flex-1 flex flex-col justify-between">
                                <div class="space-y-5">
                                    
                                    <!-- Form Row 1: Name and Category -->
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Product Name (EN)</label>
                                            <input :value="viewModal.product?.name" type="text" readonly
                                                class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none cursor-default select-all" />
                                        </div>
                                        <div>
                                            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Category</label>
                                            <div class="relative">
                                                <select :value="viewModal.product?.category || 'Fruits'" disabled
                                                    class="w-full pl-4 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none appearance-none cursor-default">
                                                    <option>{{ viewModal.product?.category || 'Fruits' }}</option>
                                                </select>
                                                <span class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Form Row 2: Pricing, Selling Unit, Stock -->
                                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                        <div>
                                            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Pricing (USD)</label>
                                            <div class="relative">
                                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-extrabold text-sm">$</span>
                                                <input :value="viewModal.product?.price ? Number(viewModal.product.price).toFixed(2) : '0.00'" type="text" readonly
                                                    class="w-full pl-8 pr-16 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 font-bold cursor-default select-all" />
                                                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-[#2d6a4f] bg-emerald-50 border border-emerald-100/50 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider select-none">
                                                    / {{ viewModal.product?.unit || 'kg' }}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Selling Unit</label>
                                            <div class="relative">
                                                <select :value="viewModal.product?.unit || 'kg'" disabled
                                                    class="w-full pl-4 pr-10 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 cursor-default appearance-none">
                                                    <option>{{ viewModal.product?.unit || 'kg' }}</option>
                                                </select>
                                                <span class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Stock Quantity</label>
                                            <input :value="viewModal.product?.stock" type="text" readonly
                                                class="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 font-bold cursor-default select-all" />
                                        </div>
                                    </div>

                                    <!-- Form Row 3: Description -->
                                    <div>
                                        <label class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Description</label>
                                        <textarea :value="viewModal.product?.description || 'No specific details provided for this crop batch.'" readonly
                                            class="w-full h-24 px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 leading-relaxed cursor-default resize-none overflow-y-auto scrollbar-thin"></textarea>
                                    </div>

                                    <!-- Form Row 4: Quality & Seasonality Badges -->
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        
                                        <!-- Pesticide Free -->
                                        <div :class="viewModal.product?.badge === 'Organic' || !!viewModal.product?.isOrganic ? 'border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-500/5 shadow-sm' : 'border-gray-200/80 bg-white'"
                                            class="flex items-center justify-between p-3.5 rounded-2xl border select-none transition duration-300">
                                            <div class="flex items-center gap-3">
                                                <span :class="viewModal.product?.badge === 'Organic' || !!viewModal.product?.isOrganic ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-400 border border-gray-100'"
                                                    class="w-9 h-9 rounded-xl flex items-center justify-center text-base transition duration-300">🌱</span>
                                                <div>
                                                    <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider leading-none mb-1">Pesticide Free</h4>
                                                    <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Organic / Certified</p>
                                                </div>
                                            </div>
                                            <div :class="viewModal.product?.badge === 'Organic' || !!viewModal.product?.isOrganic ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 bg-white'"
                                                class="w-4.5 h-4.5 rounded-full border flex items-center justify-center transition duration-300 bg-white">
                                                <svg v-if="viewModal.product?.badge === 'Organic' || !!viewModal.product?.isOrganic" class="w-3 h-3 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>

                                        <!-- Seasonal Product -->
                                        <div :class="viewModal.product?.isSeasonal ? 'border-amber-500 bg-amber-50/30 ring-4 ring-amber-500/5 shadow-sm' : 'border-gray-200/80 bg-white'"
                                            class="flex items-center justify-between p-3.5 rounded-2xl border select-none transition duration-300">
                                            <div class="flex items-center gap-3">
                                                <span :class="viewModal.product?.isSeasonal ? 'bg-amber-500 text-white' : 'bg-gray-50 text-gray-400 border border-gray-100'"
                                                    class="w-9 h-9 rounded-xl flex items-center justify-center text-base transition duration-300">☀️</span>
                                                <div>
                                                    <h4 class="text-xs font-bold text-gray-800 uppercase tracking-wider leading-none mb-1">Seasonal Product</h4>
                                                    <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Harvested / Fresh</p>
                                                </div>
                                            </div>
                                            <div :class="viewModal.product?.isSeasonal ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-200 bg-white'"
                                                class="w-4.5 h-4.5 rounded-full border flex items-center justify-center transition duration-300 bg-white">
                                                <svg v-if="viewModal.product?.isSeasonal" class="w-3 h-3 stroke-[3px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Metadata Footer -->
                                    <div class="flex items-center justify-between pt-4 border-t border-gray-100 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        <span>Farmer: <span class="text-gray-700 font-extrabold normal-case">{{ viewModal.product?.farmer }}</span></span>
                                        <span>Submitted: <span class="text-gray-700 font-extrabold normal-case">{{ viewModal.product?.submittedAt }}</span></span>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </Transition>
        </teleport>

        <!-- Toast -->
        <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 translate-y-2"
            leave-active-class="transition-all duration-200 ease-in" leave-to-class="opacity-0 translate-y-2">
            <div v-if="toast.visible"
                class="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium text-white min-w-[260px]"
                :class="{
                    'bg-gray-900':  toast.type === 'success',
                    'bg-red-500':   toast.type === 'error',
                    'bg-amber-500': toast.type === 'warning',
                }">
                <component :is="toast.type === 'success' ? CheckCircle2 : toast.type === 'warning' ? AlertCircle : XCircle" class="w-4 h-4 flex-shrink-0" />
                {{ toast.message }}
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import {
    Package, PackageCheck, PackageX,
    Download,
    CheckCircle2, XCircle, X,
    AlertCircle,
    Layers, AlertTriangle,
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth.store'

definePageMeta({ middleware: 'admin', layout: 'admin' })

const config  = useRuntimeConfig()
const baseURL = config.public.apiUrl
const auth = useAuthStore()

const fallbackImage = 'https://placehold.co/80x80?text=IMG'

const loading  = ref(false)
const products = ref([])

const categories = ref([])


const productActivity = ref([])

const categoryColors = {
    Grains: '#22c55e', Organic: '#f59e0b',
    Herbs: '#10b981', Supplies: '#3b82f6', Dairy: '#a855f7',
}

// Helper functions for Growth calculation
const calculateGrowth = (items) => {
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

    let countThisMonth = 0
    let countLastMonth = 0

    items.forEach(item => {
        const dateStr = item.rawDate
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

const calculateStatusGrowth = (statusStr) => {
    const filtered = statusStr
        ? products.value.filter(p => p.status === statusStr)
        : products.value
    return calculateGrowth(filtered)
}

const totalProductsGrowth = computed(() => calculateStatusGrowth(null))
const featuredProductsGrowth = computed(() => {
    const featured = products.value.filter(p => p.featured)
    return calculateGrowth(featured)
})
const categoryGrowth = computed(() => 0)
const lowStockCount = computed(() => products.value.filter(p => p.stock < 10).length)
const lowStockProductsGrowth = computed(() => {
    const lowStock = products.value.filter(p => p.stock < 10)
    return calculateGrowth(lowStock)
})

// Map backend status enum → UI display string
function mapStatus(s) {
    return {
        active:         'Approved',
        inactive:       'Suspended',
        pending_review: 'Approved',
        out_of_stock:   'Suspended',
    }[s] ?? 'Approved'
}

function populateInitialActivity() {
    const sorted = [...products.value]
        .sort((a, b) => new Date(b.rawDate || 0) - new Date(a.rawDate || 0))
        .slice(0, 5)

    productActivity.value = sorted.map(p => {
        const timeStr = p.submittedAt !== '—' ? `on ${p.submittedAt}` : 'recently'
        return {
            id: p.id,
            text: `New product "${p.name}" submitted by ${p.farmer} is now active.`,
            time: timeStr,
            dotColor: 'bg-green-500'
        }
    })
}

async function fetchProducts() {
    loading.value = true
    try {
        const res = await $fetch(`${baseURL}/admin/products`, {
            params: { take: 1000 },
            headers: auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : undefined,
        })
        console.log('[DEBUG_RES]:', res)
        const raw = res?.data ?? res ?? []
        console.log('[DEBUG_RAW]:', raw)
        products.value = raw.map(p => ({
            id:              p.id,
            name:            (p.nameEn ?? p.name_en ?? p.name ?? '—')
                                 .replace(/\(local\s*(image)?\s*path\s*.*\)/gi, '')
                                 .replace(/\(\s*[a-zA-Z]:\\[^)]+\)/g, '')
                                 .replace(/\(\s*\/[^)]+\)/g, '')
                                 .trim(),
            nameKm:          p.nameKm ?? p.name_km ?? '',
            price:           parseFloat(p.pricePerUnit ?? p.price_per_unit ?? 0).toFixed(2),
            image:           p.thumbnailUrl ?? p.thumbnail_url ?? '',
            status:          mapStatus(p.status),
            rawStatus:       p.status ?? '',
            category:        p.category?.nameEn ?? p.category?.name ?? p.categoryId ?? 'Other',
            farmer:          p.farmer?.user
                                 ? `${p.farmer.user.firstName ?? ''} ${p.farmer.user.lastName ?? ''}`.trim()
                                 : (p.farmer?.farmName ?? '—'),
            description:     p.description ?? '',
            featured:        p.isFeatured ?? false,
            submittedAt:     p.createdAt
                                 ? new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                 : '—',
            updatedAt:       p.updatedAt
                                 ? new Date(p.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                 : '—',
            rawDate:         p.createdAt,
            rejectionReason: p.rejectionReason ?? null,
            stock:           p.stockQuantity ?? p.stock ?? 0,
            unit:            p.unit ?? 'kg',
            minOrderQty:     p.minOrderQty ?? p.min_order_qty ?? 1,
            isOrganic:       p.isOrganic ?? false,
            isSeasonal:      p.isSeasonal ?? false,
            seasonStart:     p.seasonStart ?? p.season_start ?? null,
            seasonEnd:       p.seasonEnd ?? p.season_end ?? null,
            totalSold:       p.totalSold ?? p.total_sold ?? 0,
            avgRating:       p.avgRating ?? p.avg_rating ?? null,
        }))
        categories.value = [...new Set(products.value.map(p => p.category).filter(Boolean))]
        populateInitialActivity()
    } catch (e) {
        console.error('[PRODUCTS_FETCH_ERROR]:', e)
        showToast('Failed to load products', 'error')
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await auth.hydrate()

    if (!auth.accessToken) {
        await navigateTo('/auth/signin')
        return
    }

    await fetchProducts()
})

const countByStatus   = (s) => products.value.filter(p => p.status === s).length

const searchQuery    = ref('')
const filterCategory = ref('')

const filteredProducts = computed(() =>
    products.value.filter(p => {
        const q  = searchQuery.value.toLowerCase()
        const ms = p.name.toLowerCase().includes(q) || p.farmer.toLowerCase().includes(q)
        const mc = !filterCategory.value || p.category === filterCategory.value
        return ms && mc
    })
)

const categoryBreakdown = computed(() => {
    const total = products.value.length || 1
    return (categories.value.length ? categories.value : Object.keys(categoryColors))
        .map(cat => ({
            name:    cat,
            count:   products.value.filter(p => p.category === cat).length,
            percent: Math.round((products.value.filter(p => p.category === cat).length / total) * 100),
            color:   categoryColors[cat] ?? '#6b7280',
        }))
        .filter(c => c.count > 0)
        .sort((a, b) => b.count - a.count)
})

function addActivity(text, color = 'bg-green-500') {
    productActivity.value.unshift({ id: Date.now(), text, time: 'Just now', dotColor: color })
    if (productActivity.value.length > 8) productActivity.value.pop()
}



async function toggleFeatured(id) {
    const p = products.value.find(x => x.id === id)
    if (!p) return
    try {
        await $fetch(`${baseURL}/admin/products/${id}/featured`, {
            method: 'PATCH',
            headers: auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : undefined,
        })
        p.featured = !p.featured
        addActivity(p.featured ? `Product "${p.name}" marked as featured` : `Product "${p.name}" removed from featured`, 'bg-amber-400')
        showToast(p.featured ? `"${p.name}" is now featured` : `"${p.name}" removed from featured`, 'success')
    } catch (e) {
        showToast('Failed to update featured status', 'error')
    }
}

const viewModal = ref({ visible: false, product: null })
function openViewModal(product) {
    viewModal.value = { visible: true, product }
}

watch(
    () => viewModal.value.visible,
    (visible) => {
        if (typeof document !== 'undefined') {
            if (visible) {
                document.body.style.overflow = 'hidden'
                document.documentElement.style.overflow = 'hidden'
            } else {
                document.body.style.overflow = ''
                document.documentElement.style.overflow = ''
            }
        }
    }
)

onUnmounted(() => {
    if (typeof document !== 'undefined') {
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
    }
})

function exportCSV() {
    showToast('Exporting products to CSV…', 'success')
}

const toast = ref({ visible: false, message: '', type: 'success' })
let toastTimer = null
function showToast(message, type = 'success') {
    if (toastTimer) clearTimeout(toastTimer)
    toast.value = { visible: true, message, type }
    toastTimer  = setTimeout(() => { toast.value.visible = false }, 3200)
}

const initials = (name) => name?.split(' ').map(n => n[0]).join('') ?? ''

const categoryClass = (c) => ({
    Grains:   'bg-yellow-100 text-yellow-700',
    Organic:  'bg-amber-100 text-amber-700',
    Herbs:    'bg-green-100 text-green-700',
    Supplies: 'bg-blue-100 text-blue-700',
    Dairy:    'bg-purple-100 text-purple-700',
}[c] ?? 'bg-gray-100 text-gray-600')



function getProductImage(url) {
    if (!url) return undefined
    const lower = url.toLowerCase()
    if (lower.includes('random-question-but-does-anyone-have-versions-of-this-cat-v0-ya8qikz9kn0f1.webp')) {
        return '/cat.webp'
    }
    if (lower.includes('screenshot 2026-05-27 122353.png') || lower.includes('screenshot%202026-05-27%20122353.png')) {
        return '/screenshot1.png'
    }
    if (lower.includes('screenshot 2026-05-27 005643.png') || lower.includes('screenshot%202026-05-27%20005643.png')) {
        return '/screenshot2.png'
    }
    return url
}

function getCategoryEmoji(category) {
    if (!category) return '🌾'
    const lower = category.toLowerCase()
    if (lower.includes('fruit')) return '🥭'
    if (lower.includes('leafy') || lower.includes('greens') || lower.includes('choy')) return '🥬'
    if (lower.includes('veg')) return '🥕'
    if (lower.includes('herb')) return '🌿'
    return '🌾'
}
</script>