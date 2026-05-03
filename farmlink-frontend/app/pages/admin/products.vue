<template>
    <div class="p-6 space-y-6">

        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-xl font-bold text-gray-900">Product Management</h1>
                <p class="text-sm text-gray-400 mt-0.5">Review, approve and moderate farmer product submissions</p>
            </div>
            <div class="flex items-center gap-2">
                <button
                    @click="exportCSV"
                    class="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-150"
                >
                    <Download class="w-4 h-4" />
                    Export
                </button>
                <button
                    @click="filterStatus = 'Pending'"
                    class="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-150 shadow-sm relative"
                >
                    <Clock class="w-4 h-4" />
                    Review Queue
                    <span v-if="pendingCount > 0" class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {{ pendingCount }}
                    </span>
                </button>
            </div>
        </div>

        <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AdminStatsCard title="Total Products" :value="String(products.length)"           :percent="8"  :icon="Package" />
            <AdminStatsCard title="Approved"       :value="String(countByStatus('Approved'))" :percent="12" :icon="PackageCheck" />
            <AdminStatsCard title="Pending"        :value="String(countByStatus('Pending'))"  :percent="0"  :icon="Clock" />
            <AdminStatsCard title="Rejected"       :value="String(countByStatus('Rejected'))" :percent="-3" :icon="PackageX" />
        </section>

        <section class="grid grid-cols-5 gap-6">

            <div class="col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                        <h3 class="text-sm font-semibold text-gray-900">Pending Approval Queue</h3>
                    </div>
                    <span class="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                        {{ pendingCount }} awaiting
                    </span>
                </div>

                <div v-if="loading" class="flex flex-col items-center gap-3 py-12">
                    <div class="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <p class="text-sm text-gray-400">Loading products…</p>
                </div>

                <div v-else-if="pendingProducts.length === 0" class="flex flex-col items-center gap-3 py-12">
                    <div class="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
                        <CheckCircle2 class="w-6 h-6 text-green-500" />
                    </div>
                    <p class="text-sm font-medium text-gray-500">All caught up!</p>
                    <p class="text-xs text-gray-400">No products waiting for review</p>
                </div>

                <div v-else class="divide-y divide-gray-50">
                    <div
                        v-for="p in pendingProducts.slice(0, 5)" :key="p.id"
                        class="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 transition group"
                    >
                        <div class="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            <img :src="p.image" :alt="p.name" class="w-full h-full object-cover" @error="e => e.target.src = fallbackImage" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                                <p class="text-sm font-semibold text-gray-800 truncate">{{ p.name }}</p>
                                <span class="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0" :class="categoryClass(p.category)">{{ p.category }}</span>
                            </div>
                            <div class="flex items-center gap-2 mt-0.5">
                                <div class="w-4 h-4 rounded-full overflow-hidden bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <span class="text-[8px] font-bold text-green-700">{{ p.farmer.split(' ').map(n => n[0]).join('') }}</span>
                                </div>
                                <p class="text-xs text-gray-400">{{ p.farmer }} · submitted {{ p.submittedAt }}</p>
                            </div>
                        </div>
                        <p class="text-sm font-bold text-gray-800 flex-shrink-0">${{ p.price }}</p>
                        <div class="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                @click="openRejectModal(p)"
                                class="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
                            >Reject</button>
                            <button
                                @click="approveProduct(p.id)"
                                class="text-xs font-medium px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
                            >Approve</button>
                        </div>
                    </div>
                </div>

                <div v-if="pendingProducts.length > 5" class="px-5 py-3 border-t border-gray-100">
                    <button
                        @click="filterStatus = 'Pending'"
                        class="text-xs text-green-600 hover:underline font-medium"
                    >View all {{ pendingProducts.length }} pending products →</button>
                </div>
            </div>

            <div class="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
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

        <section class="grid grid-cols-2 gap-6">

            <div class="border border-gray-100 rounded-2xl p-5 shadow-sm bg-white">
                <div class="flex items-start justify-between gap-4 mb-4">
                    <h2 class="text-sm font-semibold text-gray-900">
                        Submission Trend
                        <span class="text-gray-400 font-normal">({{ trendRangeLabel }})</span>
                    </h2>
                    <div class="flex items-center gap-1 bg-gray-100 rounded-xl p-1 flex-shrink-0">
                        <button
                            v-for="r in trendRanges" :key="r.key"
                            @click="setTrendRange(r.key)"
                            class="text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all duration-150"
                            :class="trendRange === r.key
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-400 hover:text-gray-600'"
                        >{{ r.label }}</button>
                    </div>
                </div>
                <div class="flex items-center gap-3 mb-4 text-xs text-gray-400">
                    <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Approved</span>
                    <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span> Pending</span>
                    <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-400 inline-block"></span> Rejected</span>
                </div>
                <div class="relative h-40">
                    <svg class="w-full h-full overflow-visible" :viewBox="`0 0 ${TW} ${TH}`" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="approvedGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stop-color="#22c55e" stop-opacity="0.25" />
                                <stop offset="100%" stop-color="#22c55e" stop-opacity="0.02" />
                            </linearGradient>
                            <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stop-color="#f59e0b" stop-opacity="0.20" />
                                <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.02" />
                            </linearGradient>
                            <linearGradient id="rejectedGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stop-color="#f87171" stop-opacity="0.18" />
                                <stop offset="100%" stop-color="#f87171" stop-opacity="0.02" />
                            </linearGradient>
                        </defs>

                        <line v-for="t in [0,5,10,15,20]" :key="'tg'+t"
                            x1="0" :y1="trendYs(t)" :x2="TW" :y2="trendYs(t)"
                            stroke="#f3f4f6" stroke-width="1" />

                        <path :d="trendAreaPath('rejected')" fill="url(#rejectedGrad)" />
                        <path :d="trendAreaPath('pending')"  fill="url(#pendingGrad)" />
                        <path :d="trendAreaPath('approved')" fill="url(#approvedGrad)" />

                        <path :d="trendLinePath('rejected')" fill="none" stroke="#f87171" stroke-width="2"   stroke-linecap="round" stroke-linejoin="round" />
                        <path :d="trendLinePath('pending')"  fill="none" stroke="#f59e0b" stroke-width="2"   stroke-linecap="round" stroke-linejoin="round" />
                        <path :d="trendLinePath('approved')" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

                        <template v-if="trendRange === '7d' || trendRange === '30d'">
                            <template v-for="(key, ki) in ['rejected', 'pending', 'approved']" :key="key">
                                <circle
                                    v-for="(v, i) in trendData[key]" :key="key + i"
                                    :cx="(i / (trendData[key].length - 1)) * TW"
                                    :cy="trendYs(v)"
                                    r="3.5"
                                    :fill="['#f87171', '#f59e0b', '#16a34a'][ki]"
                                    stroke="white"
                                    stroke-width="1.5"
                                />
                            </template>
                        </template>
                    </svg>
                </div>
                <div class="flex justify-between mt-2">
                    <span v-for="d in activeTrendDays" :key="d" class="text-[10px] text-gray-300 font-medium">{{ d }}</span>
                </div>
            </div>

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

        </section>

        <AdminProductTable
            :products="filteredProducts"
            :categories="categories"
            :search-query="searchQuery"
            :filter-status="filterStatus"
            :filter-category="filterCategory"
            :status-tabs="statusTabs"
            :category-class="categoryClass"
            :status-class="statusClass"
            :initials="initials"
            @update:search-query="searchQuery = $event"
            @update:filter-status="filterStatus = $event"
            @update:filter-category="filterCategory = $event"
            @toggle-featured="toggleFeatured"
            @view-product="openViewModal"
            @approve-product="approveProduct"
            @reject-product="openRejectModal"
        />

        <section class="grid grid-cols-3 gap-6">
            <div v-for="goal in moderationGoals" :key="goal.label" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div class="flex items-center justify-between mb-3">
                    <p class="text-sm font-medium text-gray-700">{{ goal.label }}</p>
                    <span class="text-xs font-semibold" :style="{ color: goal.stroke }">{{ goal.percent }}%</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2 mb-2">
                    <div class="h-2 rounded-full transition-all duration-700" :style="{ width: goal.percent + '%', background: goal.stroke }"></div>
                </div>
                <div class="flex justify-between text-xs text-gray-400">
                    <span>{{ goal.current }}</span>
                    <span>Goal: {{ goal.target }}</span>
                </div>
            </div>
        </section>

        <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0"
            leave-active-class="transition-all duration-150 ease-in" leave-to-class="opacity-0">
            <div v-if="rejectModal.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                @click.self="rejectModal.visible = false">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
                    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                                <XCircle class="w-4 h-4 text-red-500" />
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-gray-900">Reject Product</p>
                                <p class="text-xs text-gray-400">{{ rejectModal.product?.name }}</p>
                            </div>
                        </div>
                        <button @click="rejectModal.visible = false" class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition">
                            <X class="w-4 h-4" />
                        </button>
                    </div>
                    <div class="p-5 space-y-4">
                        <div>
                            <label class="text-xs font-semibold text-gray-700 block mb-2">Rejection Reason</label>
                            <div class="grid grid-cols-2 gap-2 mb-3">
                                <button
                                    v-for="reason in rejectionReasons" :key="reason"
                                    @click="rejectModal.reason = reason"
                                    class="text-xs font-medium px-3 py-2 rounded-xl border transition text-left"
                                    :class="rejectModal.reason === reason ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'"
                                >{{ reason }}</button>
                            </div>
                            <textarea
                                v-model="rejectModal.note"
                                rows="3"
                                placeholder="Add additional notes for the farmer (optional)…"
                                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition placeholder:text-gray-300 resize-none"
                            ></textarea>
                        </div>
                        <div class="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <AlertCircle class="w-4 h-4 text-amber-500 flex-shrink-0" />
                            <p class="text-xs text-amber-700">The farmer will be notified with the reason you provide.</p>
                        </div>
                        <div class="flex gap-3">
                            <button @click="rejectModal.visible = false" class="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                            <button @click="executeReject" :disabled="!rejectModal.reason"
                                class="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >Send Rejection</button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0"
            leave-active-class="transition-all duration-150 ease-in" leave-to-class="opacity-0">
            <div v-if="viewModal.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                @click.self="viewModal.visible = false">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
                    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <h3 class="text-sm font-semibold text-gray-900">Product Details</h3>
                        <button @click="viewModal.visible = false" class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition">
                            <X class="w-4 h-4" />
                        </button>
                    </div>
                    <div v-if="viewModal.product" class="p-5 space-y-4">
                        <div class="w-full h-44 rounded-xl overflow-hidden bg-gray-100">
                            <img :src="viewModal.product.image" :alt="viewModal.product.name" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex items-start justify-between">
                            <div>
                                <h2 class="text-base font-bold text-gray-900">{{ viewModal.product.name }}</h2>
                                <p class="text-xs text-gray-400 mt-0.5">Submitted by {{ viewModal.product.farmer }} · {{ viewModal.product.submittedAt }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-lg font-bold text-green-600">${{ viewModal.product.price }}</p>
                                <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="statusClass(viewModal.product.status)">{{ viewModal.product.status }}</span>
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-3">
                            <div class="bg-gray-50 rounded-xl p-3">
                                <p class="text-[11px] text-gray-400 mb-1">Category</p>
                                <span class="text-xs font-semibold" :class="categoryClass(viewModal.product.category)">{{ viewModal.product.category }}</span>
                            </div>
                            <div class="bg-gray-50 rounded-xl p-3">
                                <p class="text-[11px] text-gray-400 mb-1">Product ID</p>
                                <p class="text-xs font-mono font-semibold text-gray-700">#PRD-{{ String(viewModal.product.id).padStart(4,'0') }}</p>
                            </div>
                            <div class="bg-gray-50 rounded-xl p-3">
                                <p class="text-[11px] text-gray-400 mb-1">Featured</p>
                                <p class="text-xs font-semibold" :class="viewModal.product.featured ? 'text-amber-600' : 'text-gray-400'">
                                    {{ viewModal.product.featured ? 'Yes' : 'No' }}
                                </p>
                            </div>
                        </div>
                        <div v-if="viewModal.product.description" class="bg-gray-50 rounded-xl p-3">
                            <p class="text-[11px] text-gray-400 mb-1">Description</p>
                            <p class="text-xs text-gray-700 leading-relaxed">{{ viewModal.product.description }}</p>
                        </div>
                        <div v-if="viewModal.product.rejectionReason" class="bg-red-50 border border-red-100 rounded-xl p-3">
                            <p class="text-[11px] text-red-500 font-semibold mb-1">Rejection Reason</p>
                            <p class="text-xs text-red-700">{{ viewModal.product.rejectionReason }}</p>
                        </div>
                        <div class="flex gap-3 pt-1">
                            <button
                                v-if="viewModal.product.status === 'Pending'"
                                @click="() => { approveProduct(viewModal.product.id); viewModal.visible = false }"
                                class="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white transition flex items-center justify-center gap-2"
                            ><CheckCircle2 class="w-4 h-4" /> Approve</button>
                            <button
                                v-if="viewModal.product.status === 'Pending'"
                                @click="() => { viewModal.visible = false; openRejectModal(viewModal.product) }"
                                class="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition flex items-center justify-center gap-2"
                            ><XCircle class="w-4 h-4" /> Reject</button>
                            <button
                                v-if="viewModal.product.status === 'Approved'"
                                @click="() => { suspendProduct(viewModal.product.id); viewModal.visible = false }"
                                class="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 transition"
                            >Suspend</button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

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
import { ref, computed, onMounted } from 'vue'
import {
    Package, PackageCheck, PackageX,
    Clock, Download,
    CheckCircle2, XCircle, X,
    AlertCircle,
} from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

const fallbackImage = 'https://via.placeholder.com/80x80?text=IMG'

const loading  = ref(false)
const products = ref([])

const categories = ref([])
const statusTabs = ['All', 'Pending', 'Approved', 'Rejected', 'Suspended']

const moderationGoals = ref([])
const productActivity = ref([])

const TW       = 600
const TH       = 140
const trendMin = 0
const trendMax = 20

const rejectionReasons = [
    'Incomplete description',
    'Missing certifications',
    'Incorrect pricing',
    'Poor image quality',
    'Prohibited product',
    'Duplicate listing',
]

const categoryColors = {
    Grains: '#22c55e', Organic: '#f59e0b',
    Herbs: '#10b981', Supplies: '#3b82f6', Dairy: '#a855f7',
}

const trendRanges = [
    { key: '7d',  label: '7D'  },
    { key: '30d', label: '30D' },
    { key: '60d', label: '60D' },
    { key: '90d', label: '90D' },
    { key: '1y',  label: '1Y'  },
]

const trendRange = ref('7d')

const trendRangeLabel = computed(() => ({
    '7d':  'Last 7 Days',
    '30d': 'Last 30 Days',
    '60d': 'Last 60 Days',
    '90d': 'Last 90 Days',
    '1y':  'Last 12 Months',
}[trendRange.value]))

const trendDayMap = {
    '7d':  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    '30d': ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
    '60d': ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
    '90d': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    '1y':  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}

const activeTrendDays = computed(() => trendDayMap[trendRange.value])

const trendDataMap = ref({
    '7d':  { approved: [4,7,5,9,6,11,8],   pending: [2,3,4,2,5,3,4],   rejected: [1,1,2,1,2,1,2]   },
    '30d': { approved: [12,18,15,20,14,17,19,16], pending: [5,8,6,9,7,6,8,7], rejected: [2,3,2,4,3,2,3,2] },
    '60d': { approved: [10,14,12,16,18,15,13,17,19,14,16,11], pending: [4,6,5,7,6,5,7,6,8,5,6,4], rejected: [1,2,2,3,2,1,2,2,3,1,2,1] },
    '90d': { approved: [35,42,38,50,44,48,40,52,46], pending: [14,18,16,20,17,19,15,21,18], rejected: [4,6,5,7,6,5,7,6,8] },
    '1y':  { approved: [40,55,48,62,58,70,65,72,68,75,80,85], pending: [18,22,20,25,23,28,26,30,27,32,29,35], rejected: [5,7,6,8,7,9,8,10,9,11,10,12] },
})

const trendData = computed(() => trendDataMap.value[trendRange.value])

async function fetchTrendForRange(range) {
    try {
        
    } catch (e) {
        showToast('Failed to load trend data', 'error')
    }
}

function setTrendRange(range) {
    trendRange.value = range
    fetchTrendForRange(range)
}


async function fetchProducts() {
    loading.value = true
    try {
        
    } catch (e) {
        showToast('Failed to load products', 'error')
    } finally {
        loading.value = false
    }
}

async function fetchGoals() {
    try {
        
    } catch (e) {
        showToast('Failed to load goals', 'error')
    }
}

async function fetchActivity() {
    try {
       
    } catch (e) {
        showToast('Failed to load activity', 'error')
    }
}

onMounted(() => {
    fetchProducts()
    fetchTrendForRange('7d')
    fetchGoals()
    fetchActivity()
})


const countByStatus   = (s) => products.value.filter(p => p.status === s).length
const pendingCount    = computed(() => countByStatus('Pending'))
const pendingProducts = computed(() => products.value.filter(p => p.status === 'Pending'))

const searchQuery    = ref('')
const filterCategory = ref('')
const filterStatus   = ref('All')

const filteredProducts = computed(() =>
    products.value.filter(p => {
        const q  = searchQuery.value.toLowerCase()
        const ms = p.name.toLowerCase().includes(q) || p.farmer.toLowerCase().includes(q)
        const mc = !filterCategory.value || p.category === filterCategory.value
        const mv = filterStatus.value === 'All' || p.status === filterStatus.value
        return ms && mc && mv
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

function trendYs(v) {
    return 10 + (1 - (v - trendMin) / (trendMax - trendMin)) * (TH - 20)
}

function trendLinePath(key) {
    const pts = trendData.value[key].map((v, i) => ({
        x: (i / (trendData.value[key].length - 1)) * TW,
        y: trendYs(v),
    }))
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)]
        d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`
    }
    return d
}

function trendAreaPath(key) {
    const pts = trendData.value[key].map((v, i) => ({
        x: (i / (trendData.value[key].length - 1)) * TW,
        y: trendYs(v),
    }))
    return `${trendLinePath(key)} L ${pts[pts.length - 1].x} ${TH} L ${pts[0].x} ${TH} Z`
}

function addActivity(text, color = 'bg-green-500') {
    productActivity.value.unshift({ id: Date.now(), text, time: 'Just now', dotColor: color })
    if (productActivity.value.length > 8) productActivity.value.pop()
}

async function approveProduct(id) {
    const p = products.value.find(x => x.id === id)
    if (!p) return
    try {
        p.status          = 'Approved'
        p.rejectionReason = null
        addActivity(`${p.name} by ${p.farmer} approved`, 'bg-green-500')
        showToast(`${p.name} has been approved`, 'success')
    } catch (e) {
        showToast('Failed to approve product', 'error')
    }
}

async function suspendProduct(id) {
    const p = products.value.find(x => x.id === id)
    if (!p) return
    try {
        p.status = 'Suspended'
        addActivity(`${p.name} by ${p.farmer} suspended`, 'bg-orange-400')
        showToast(`${p.name} has been suspended`, 'warning')
    } catch (e) {
        showToast('Failed to suspend product', 'error')
    }
}

async function toggleFeatured(id) {
    const p = products.value.find(x => x.id === id)
    if (!p) return
    try {
        p.featured = !p.featured
        addActivity(p.featured ? `${p.name} marked as featured` : `${p.name} removed from featured`, 'bg-amber-400')
        showToast(p.featured ? `${p.name} is now featured` : `${p.name} removed from featured`, 'success')
    } catch (e) {
        showToast('Failed to update featured status', 'error')
    }
}

const rejectModal = ref({ visible: false, product: null, reason: '', note: '' })
function openRejectModal(product) {
    rejectModal.value = { visible: true, product, reason: '', note: '' }
}

async function executeReject() {
    const p = products.value.find(x => x.id === rejectModal.value.product?.id)
    if (!p) return
    try {
        p.status          = 'Rejected'
        p.rejectionReason = rejectModal.value.note
            ? `${rejectModal.value.reason} — ${rejectModal.value.note}`
            : rejectModal.value.reason
        addActivity(`${p.name} by ${p.farmer} rejected — ${rejectModal.value.reason}`, 'bg-red-500')
        showToast(`${p.name} rejected. Farmer has been notified.`, 'warning')
        rejectModal.value.visible = false
    } catch (e) {
        showToast('Failed to reject product', 'error')
    }
}

const viewModal = ref({ visible: false, product: null })
function openViewModal(product) {
    viewModal.value = { visible: true, product }
}

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

const statusClass = (s) => ({
    Approved:  'bg-green-100 text-green-700',
    Pending:   'bg-amber-100 text-amber-700',
    Rejected:  'bg-red-100 text-red-600',
    Suspended: 'bg-orange-100 text-orange-700',
}[s] ?? 'bg-gray-100 text-gray-600')
</script>