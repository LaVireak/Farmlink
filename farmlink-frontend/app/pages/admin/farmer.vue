<template>
    <div class="p-10 bg-[#f7fdf4]">
        <AdminProfileDropdown title="Farmer Management"/>
        <div class="flex flex-col mb-6 md:flex-row md:items-center justify-end gap-4">
            <!-- Space left for optional future filters/actions -->
        </div>

        <!-- SKELETON -->
        <div v-if="loading">
            <!-- 3 stat cards -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div v-for="i in 3" :key="i"
                    class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between">
                    <div class="space-y-2.5">
                        <div class="h-2.5 w-28 bg-gray-200 rounded-full animate-pulse"/>
                        <div class="h-6 w-10 bg-gray-200 rounded-full animate-pulse"/>
                        <div class="h-2 w-32 bg-gray-100 rounded-full animate-pulse"/>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-gray-200 animate-pulse flex-shrink-0"/>
                </div>
            </div>

            <!-- Table card -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <!-- Search + filter toolbar -->
                <div class="flex items-center gap-3 p-4 border-b border-gray-100">
                    <div class="h-9 flex-1 bg-gray-100 rounded-xl animate-pulse"/>
                    <div class="h-9 w-36 bg-gray-100 rounded-xl animate-pulse"/>
                    <div class="h-9 w-28 bg-gray-100 rounded-xl animate-pulse"/>
                </div>

                <!-- Column header row -->
                <div class="flex items-center gap-4 px-5 py-3 border-b border-gray-100">
                    <div class="w-9 flex-shrink-0"/>
                    <div class="flex-1"><div class="h-2.5 w-12 bg-gray-200 rounded-full animate-pulse"/></div>
                    <div class="hidden sm:block w-32"><div class="h-2.5 w-16 bg-gray-200 rounded-full animate-pulse"/></div>
                    <div class="hidden md:block w-24"><div class="h-2.5 w-14 bg-gray-200 rounded-full animate-pulse"/></div>
                </div>

                <!-- Data rows -->
                <div
                    v-for="i in 7" :key="i"
                    class="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0"
                    :style="{ opacity: 1 - (i - 1) * 0.08 }"
                >
                    <!-- Avatar -->
                    <div class="w-9 h-9 rounded-full bg-gray-200 animate-pulse flex-shrink-0"/>

                    <!-- Name + sub -->
                    <div class="flex-1 space-y-1.5">
                        <div class="h-3 bg-gray-200 rounded-full animate-pulse"
                            :style="{ width: ['80px','100px','72px','90px','64px','88px','76px'][i-1] }"/>
                        <div class="h-2.5 bg-gray-100 rounded-full animate-pulse"
                            :style="{ width: ['60px','72px','56px','68px','52px','64px','58px'][i-1] }"/>
                    </div>
                </div>
            </div>
        </div>

        <!-- ERROR -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-600 mb-6">
            <p class="font-semibold">Failed to load farmers</p>
            <p class="text-sm mt-1">{{ error }}</p>
            <button @click="fetchFarmers" class="mt-3 text-sm underline">Try again</button>
        </div>

        <!-- LOADED -->
        <template v-else>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <!-- Stat Card: Total Farmers -->
                <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-500 font-medium mb-1">Total Farmers</p>
                            <p class="text-2xl font-bold text-gray-900">{{ allFarmers.length }}</p>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Users class="w-6 h-6 text-green-600"/>
                        </div>
                    </div>
                    <p class="text-xs text-gray-400 mt-2">Registered on platform</p>
                </div>

                <!-- Stat Card: Active Farmers -->
                <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-500 font-medium mb-1">Active Farmers</p>
                            <p class="text-2xl font-bold text-gray-900">{{ countByStatus('Active') }}</p>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck class="w-6 h-6 text-blue-600"/>
                        </div>
                    </div>
                    <p class="text-xs text-gray-400 mt-2">Verified & active</p>
                </div>

                <!-- Stat Card: Pending Farmers -->
                <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-500 font-medium mb-1">Pending Verification</p>
                            <p class="text-2xl font-bold text-gray-900">{{ countByStatus('Pending') }}</p>
                        </div>
                        <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <Clock class="w-6 h-6 text-amber-600"/>
                        </div>
                    </div>
                    <p class="text-xs text-gray-400 mt-2">Awaiting admin review</p>
                </div>
            </div>

            <AdminFarmerTable
                :farmers="filteredFarmers"
                :search-query="searchQuery"
                :filter-status="filterStatus"
                sort-by="name"
                :status-class="statusClass"
                :role-avatar-class="roleAvatarClass"
                :initials="initials"
                @update:search-query="searchQuery = $event"
                @update:filter-status="filterStatus = $event"
                @reset-filters="resetFilters"
                @open-farmer="openFarmerModal"
                @suspend-farmer="(farmer) => { suspendModal.farmer = farmer; suspendModal.visible = true; suspendModal.action = 'Suspended'; }"
            />
        </template>

        <!-- CENTERED FARMER DETAIL & EDIT MODAL -->
        <teleport to="body">
            <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0 scale-95"
                leave-active-class="transition-all duration-100 ease-in" leave-to-class="opacity-0 scale-95">
                <div v-if="farmerModal.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 backdrop-blur-sm p-4"
                    @click.self="farmerModal.visible = false">
                    <div class="bg-white/95 backdrop-blur-md rounded-3xl max-w-3xl w-full border border-white/50 shadow-2xl relative overflow-hidden flex flex-col">
                        
                        <!-- Banner Header with Avatar (PFP) -->
                        <div class="w-full h-60 overflow-hidden relative text-white p-5 flex flex-col justify-between bg-gradient-to-br from-green-800 to-green-950">
                            <!-- Background Blurry Image for premium feel -->
                            <div v-if="farmerModal.editForm.avatarPreview" class="absolute inset-0 z-0 overflow-hidden filter blur-sm opacity-55 scale-105">
                                <img :src="resolveUrl(farmerModal.editForm.avatarPreview)" class="w-full h-full object-cover" />
                                <div class="absolute inset-0 bg-black/35 z-10"></div>
                            </div>
                            
                            <!-- Header actions -->
                            <div class="flex justify-between items-start z-20 relative w-full">
                                <div class="flex gap-2">
                                    <span class="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-green-300 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
                                        Farmer
                                    </span>
                                    <select v-model="farmerModal.editForm.status" class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-lg border bg-black/40 text-white border-white/20 focus:outline-none">
                                        <option value="Active" class="bg-gray-800 text-white">Active</option>
                                        <option value="Pending" class="bg-gray-800 text-white">Pending</option>
                                        <option value="Suspended" class="bg-gray-800 text-white">Suspended</option>
                                    </select>
                                </div>
                                <button @click="farmerModal.visible = false" class="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center border border-white/10 transition-all duration-200">
                                    <X class="w-4 h-4" />
                                </button>
                            </div>

                            <!-- Large Profile Photo & Details -->
                            <div class="flex items-center gap-4 z-20 relative mt-auto">
                                <div class="w-24 h-24 rounded-full border-4 border-white/25 overflow-hidden shadow-lg bg-white/10 flex-shrink-0 flex items-center justify-center relative group/avatar">
                                    <img v-if="farmerModal.editForm.avatarPreview" :src="resolveUrl(farmerModal.editForm.avatarPreview)" class="w-full h-full object-cover cursor-pointer hover:scale-105 transition duration-200" title="Click to view full profile image" @click="openFullImage(farmerModal.editForm.avatarPreview)" />
                                    <!-- Fallback SVG -->
                                    <div v-else class="w-full h-full bg-green-900/60 flex items-center justify-center text-green-200">
                                        <svg viewBox="0 0 100 100" class="w-12 h-12" fill="currentColor">
                                            <circle cx="50" cy="32" r="22"/>
                                            <ellipse cx="50" cy="85" rx="38" ry="26"/>
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h2 class="text-2xl font-bold text-white leading-tight">
                                        {{ farmerModal.editForm.firstName }} {{ farmerModal.editForm.lastName }}
                                    </h2>
                                    <p class="text-sm text-white/70 mt-1">{{ farmerModal.editForm.farmName || 'No Farm Name' }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Form Body -->
                        <div class="w-full p-6 md:p-8 flex flex-col gap-4 bg-white rounded-b-3xl overflow-y-auto max-h-[70vh]">
                            
                            <!-- Row 1: First Name / Last Name -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">First Name</label>
                                    <input :value="farmerModal.editForm.firstName" type="text" readonly class="form-input bg-gray-50/50 text-gray-500 cursor-default" />
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Last Name</label>
                                    <input :value="farmerModal.editForm.lastName" type="text" readonly class="form-input bg-gray-50/50 text-gray-500 cursor-default" />
                                </div>
                            </div>

                            <!-- Row 2: Email / Phone -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email Address</label>
                                    <input :value="farmerModal.editForm.email" type="email" readonly class="form-input bg-gray-50/50 text-gray-500 cursor-default" />
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                                    <input :value="farmerModal.editForm.phone" type="text" readonly class="form-input bg-gray-50/50 text-gray-500 cursor-default" />
                                </div>
                            </div>

                            <!-- Row 3: Farm Name / Total Yield -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Farm Name</label>
                                    <input :value="farmerModal.editForm.farmName" type="text" readonly class="form-input bg-gray-50/50 text-gray-500 cursor-default" />
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Estimated Yield</label>
                                    <input :value="farmerModal.editForm.totalSales" type="number" readonly class="form-input bg-gray-50/50 text-gray-500 cursor-default" />
                                </div>
                            </div>

                            <!-- Row 4: Main Crop (productTags) / Address Detail -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Main Crop / Tags</label>
                                    <input :value="farmerModal.editForm.productTags" type="text" readonly class="form-input bg-gray-50/50 text-gray-500 cursor-default" />
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Farming Address Detail</label>
                                    <input :value="farmerModal.editForm.addressDetail" type="text" readonly class="form-input bg-gray-50/50 text-gray-500 cursor-default" />
                                </div>
                            </div>

                            <!-- Row 5: Province / District -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Province</label>
                                    <input :value="farmerModal.editForm.province" type="text" readonly class="form-input bg-gray-50/50 text-gray-500 cursor-default" />
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">District</label>
                                    <input :value="farmerModal.editForm.district" type="text" readonly class="form-input bg-gray-50/50 text-gray-500 cursor-default" />
                                </div>
                            </div>

                            <!-- Row 6: ID Document Upload & View -->
                            <div class="border border-gray-100 p-5 rounded-2xl bg-gray-50/50 flex flex-col gap-4">
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                                    <div>
                                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verification Document</p>
                                        <p class="text-xs text-gray-500 mt-1">This is the verification identity card or deed document uploaded by the farmer.</p>
                                    </div>
                                    <div v-if="farmerModal.editForm.idDocumentPreview">
                                        <button @click="openFullImage(farmerModal.editForm.idDocumentPreview)" class="text-xs text-green-600 hover:text-green-700 font-semibold underline flex items-center gap-1">
                                            Open Document in New Tab
                                        </button>
                                    </div>
                                </div>
                                <div class="w-full">
                                    <div class="w-full h-48 rounded-xl border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center relative group">
                                        <template v-if="farmerModal.editForm.idDocumentPreview">
                                            <img :src="resolveUrl(farmerModal.editForm.idDocumentPreview)" 
                                                class="w-full h-full object-contain cursor-pointer transition-transform duration-200 group-hover:scale-[1.01]" 
                                                title="Click to view full image in a new tab"
                                                @click="openFullImage(farmerModal.editForm.idDocumentPreview)" />
                                            <!-- Interactive zoom/view overlay on hover -->
                                            <div class="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 text-center pointer-events-none">
                                                <span class="text-white text-[11px] font-bold">Click Image to Open in Full Size</span>
                                            </div>
                                        </template>
                                        <span v-else class="text-xs text-gray-400">No Document Uploaded</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Actions Footer -->
                            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                                <button @click="farmerModal.visible = false" class="text-xs font-semibold px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                                <button @click="saveFarmerChanges" :disabled="saving" class="text-xs font-semibold px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white transition disabled:opacity-50 flex items-center gap-2">
                                    <span v-if="saving" class="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></span>
                                    Save Status
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </Transition>
        </teleport>

        <!-- SUSPEND MODAL -->
        <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0"
            leave-active-class="transition-all duration-150 ease-in" leave-to-class="opacity-0">
            <div v-if="suspendModal.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
                @click.self="suspendModal.visible = false">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
                    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                                <ShieldOff class="w-4 h-4 text-red-500"/>
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-gray-900">Suspend Farmer</p>
                                <p class="text-xs text-gray-400">{{ suspendModal.farmer?.name }}</p>
                            </div>
                        </div>
                        <button @click="suspendModal.visible = false" class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
                            <X class="w-4 h-4"/>
                        </button>
                    </div>
                    <div class="p-5 space-y-4">
                        <div class="bg-red-50 p-3 rounded-xl border border-red-100 flex gap-2">
                            <AlertCircle class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <p class="text-xs text-red-800">Suspending this farmer will hide their profile from buyers and pause active matches.</p>
                        </div>
                        <div>
                            <label class="text-xs font-semibold text-gray-700 block mb-2">Reason</label>
                            <textarea v-model="suspendModal.reason" rows="3"
                                placeholder="Why is this farmer being suspended?"
                                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition resize-none"></textarea>
                        </div>
                        <div class="flex gap-3">
                            <button @click="suspendModal.visible = false"
                                class="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                            <button @click="executeSuspend" :disabled="!suspendModal.reason || suspendLoading"
                                class="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                <span v-if="suspendLoading" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                                <span v-else>Confirm Suspend</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- TOAST -->
        <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 translate-y-2"
            leave-active-class="transition-all duration-200 ease-in" leave-to-class="opacity-0 translate-y-2">
            <div v-if="toast.visible"
                class="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium text-white min-w-[260px]"
                :class="{
                    'bg-gray-900':   toast.type === 'success',
                    'bg-red-500':    toast.type === 'error',
                    'bg-amber-500':  toast.type === 'warning',
                    'bg-indigo-600': toast.type === 'info',
                }">
                <component :is="toast.type === 'success' ? CheckCheck : toast.type === 'warning' ? AlertCircle : toast.type === 'info' ? Info : X"
                    class="w-4 h-4 flex-shrink-0"/>
                {{ toast.message }}
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
    Users, X, Search, CheckCheck, MapPin, Sprout, ShieldAlert,
    AlertCircle, Link2, ArrowRightLeft, ShieldOff,
    UserPlus, Info, CheckCircle2, ArrowLeft, User, Leaf, ShieldCheck, Clock
} from 'lucide-vue-next'
import AdminFarmerTable from '~/components/admin/AdminFarmerTable.vue'
import { useAuthStore } from '~/stores/auth.store'

definePageMeta({ layout: 'admin', middleware: 'admin',})

const config  = useRuntimeConfig()
const baseURL = config.public.apiUrl
const auth = useAuthStore()

const allFarmers     = ref([])
const loading        = ref(false)
const error          = ref(null)
const suspendLoading = ref(false)

const normalizeStatus = (status) => ({
    active: 'Active',
    pending: 'Pending',
    suspended: 'Suspended',
    inactive: 'Suspended',
}[String(status || '').toLowerCase()] ?? 'Pending')

const mapFarmer = (profile) => {
    const user = profile?.user ?? {}
    const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || profile?.farmName || 'Unknown'
    const tags = String(profile?.productTags ?? '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    const mainCrop = tags[0] || 'Unknown'
    const trustScore = profile?.avgRating
        ? Math.round(Number(profile.avgRating) * 20)
        : 0

    return {
        id: profile?.id,
        userId: profile?.userId,
        name,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phoneNumber || '—',
        location: [profile?.province, profile?.district].filter(Boolean).join(', ') || '—',
        province: profile?.province || '',
        district: profile?.district || '',
        addressDetail: profile?.addressDetail || '',
        farmName: profile?.farmName || '',
        mainCrop,
        estYield: profile?.totalSales ? String(profile.totalSales) : '—',
        totalSales: profile?.totalSales ?? 0,
        trustScore,
        status: normalizeStatus(user.status ?? (profile?.isVerified ? 'active' : 'pending')),
        matchStatus: profile?.matchStatus || 'Unmatched',
        method: '—',
        farmSize: 0,
        joinedAt: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—',
        crops: tags.map(tag => ({
            name: tag,
            harvestDate: '—',
            volume: '—',
            price: '—',
        })),
        matchedBuyer: profile?.matchedBuyerId || undefined,
        verifiedAt: profile?.verifiedAt || undefined,
        avatarUrl: user.avatarUrl || '',
        idDocumentUrl: profile?.idDocumentUrl || '',
        productTags: tags.join(', '),
        rating: profile?.avgRating ? Number(profile.avgRating) : 0,
    }
}

const mapFarmerFromUser = (user) => ({
    id: user?.id,
    userId: user?.id,
    name: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.email || 'Unknown',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phoneNumber ?? '—',
    location: '—',
    province: '',
    district: '',
    addressDetail: '',
    farmName: '',
    mainCrop: 'Unknown',
    estYield: '—',
    totalSales: 0,
    trustScore: 0,
    status: normalizeStatus(user?.status),
    matchStatus: 'Unmatched',
    method: '—',
    farmSize: 0,
    joinedAt: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—',
    crops: [],
    matchedBuyer: undefined,
    verifiedAt: undefined,
    avatarUrl: user?.avatarUrl || '',
    idDocumentUrl: '',
    productTags: '',
    rating: 0,
})

async function fetchFarmers() {
    loading.value = true
    error.value   = null
    try {
        const res = await $fetch(`${baseURL}/admin/farmers`, {
            headers: auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : undefined,
        })
        const raw = Array.isArray(res) ? res : res?.data ?? []
        const farmers = raw.map(mapFarmer)

        const fallback = await $fetch(`${baseURL}/admin/users`, {
            params: { role: 'farmer', take: 1000, skip: 0 },
            headers: auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : undefined,
        })
        const fallbackRaw = Array.isArray(fallback) ? fallback : fallback?.data ?? []
        const farmerUsers = fallbackRaw.map(mapFarmerFromUser)

        const merged = new Map()
        for (const farmer of farmers) {
            const key = farmer.userId || farmer.id
            if (key) merged.set(key, farmer)
        }
        for (const farmer of farmerUsers) {
            const key = farmer.userId || farmer.id
            if (key && !merged.has(key)) merged.set(key, farmer)
        }

        allFarmers.value = Array.from(merged.values())
    } catch (err) {
        error.value = err?.data?.message ?? 'Failed to load farmers'
        showToast(error.value, 'error')
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

    await fetchFarmers()
})

const countByStatus = (status) => allFarmers.value.filter(f => f.status === status).length

const searchQuery  = ref('')
const filterStatus = ref('')

const safeLower = (value) => String(value ?? '').toLowerCase()

const filteredFarmers = computed(() => {
    let result = allFarmers.value.filter(f => {
        const q  = safeLower(searchQuery.value)
        const ms = safeLower(f.name).includes(q) || safeLower(f.mainCrop).includes(q) || safeLower(f.email).includes(q)
        const mv = !filterStatus.value || f.status === filterStatus.value
        return ms && mv
    })
    return result.sort((a, b) => a.name.localeCompare(b.name))
})

function resetFilters() {
    searchQuery.value  = ''
    filterStatus.value = ''
}

const farmerModal = ref({
    visible: false,
    farmer: null,
    editForm: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        farmName: '',
        province: '',
        district: '',
        addressDetail: '',
        totalSales: 0,
        productTags: '',
        status: 'Pending',
        avatarPreview: '',
        idDocumentPreview: '',
    }
})

const saving = ref(false)

function openFarmerModal(farmer) {
    farmerModal.value.farmer = farmer
    farmerModal.value.editForm = {
        id: farmer.id,
        firstName: farmer.firstName || '',
        lastName: farmer.lastName || '',
        email: farmer.email || '',
        phone: farmer.phone === '—' ? '' : farmer.phone,
        farmName: farmer.farmName || '',
        province: farmer.province || '',
        district: farmer.district || '',
        addressDetail: farmer.addressDetail || '',
        totalSales: farmer.totalSales || 0,
        productTags: farmer.productTags || '',
        status: farmer.status,
        avatarPreview: farmer.avatarUrl || '',
        idDocumentPreview: farmer.idDocumentUrl || '',
    }
    farmerModal.value.visible = true
}

async function saveFarmerChanges() {
    saving.value = true
    try {
        const body = {
            status: farmerModal.value.editForm.status,
        }

        await $fetch(`${baseURL}/admin/farmers/${farmerModal.value.editForm.id}`, {
            method: 'PATCH',
            body,
            headers: auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : undefined,
        })

        showToast('Farmer updated successfully', 'success')
        farmerModal.value.visible = false
        await fetchFarmers()
    } catch (err) {
        showToast(err?.data?.message ?? 'Failed to update farmer', 'error')
    } finally {
        saving.value = false
    }
}

const suspendModal = ref({ visible: false, farmer: null, action: 'Suspended', reason: '' })

async function executeSuspend() {
    if (!suspendModal.value.farmer) return
    suspendLoading.value = true
    try {
        await $fetch(`${baseURL}/admin/farmers/${suspendModal.value.farmer.id}/suspend`, {
            method: 'PATCH',
            body: { reason: suspendModal.value.reason }
        })
        const f = allFarmers.value.find(x => x.id === suspendModal.value.farmer.id)
        if (f) f.status = 'Suspended'
        showToast(`${suspendModal.value.farmer.name} has been suspended`, 'warning')
        suspendModal.value.visible = false
    } catch (err) {
        showToast(err?.data?.message ?? 'Failed to suspend farmer', 'error')
    } finally {
        suspendLoading.value = false
    }
}

const toast = ref({ visible: false, message: '', type: 'success' })
let toastTimer = null
function showToast(message, type = 'success') {
    if (toastTimer) clearTimeout(toastTimer)
    toast.value = { visible: true, message, type }
    toastTimer  = setTimeout(() => { toast.value.visible = false }, 3200)
}

const initials        = (name) => {
    if (!name) return '?'
    const parts = name.split(' ').filter(Boolean)
    return parts.map(n => n[0]).join('').toUpperCase()
}
const roleAvatarClass = ()     => 'bg-green-100 text-green-700'
const statusClass     = (s)    => ({ Active: 'bg-green-100 text-green-700', Pending: 'bg-amber-100 text-amber-700', Suspended: 'bg-red-100 text-red-600' })[s] ?? 'bg-gray-100 text-gray-600'

const resolveUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('http') || url.startsWith('data:')) return url
    const STATIC_BASE = baseURL.replace('/api', '')
    return `${STATIC_BASE}/${url}`
}

const openFullImage = (url) => {
    if (!url) return
    window.open(resolveUrl(url), '_blank')
}
</script>

<style scoped>
.form-input {
  width: 100%;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  border-width: 1px;
  border-color: #e5e7eb;
  border-radius: 0.75rem;
  background-color: #f9fafb;
  color: #111827;
  outline: none;
  transition: all 0.2s;
}
.form-input:focus {
  border-color: #16a34a;
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.15);
}
</style>