<template>
    <div class="p-6 space-y-6">

        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-xl font-bold text-gray-900">Users Management</h1>
                <p class="text-sm text-gray-400 mt-0.5">Manage and view all consumer users</p>
            </div>
            <div class="flex items-center gap-2">
                <button
                    @click="viewOrders"
                    class="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                >
                    <ShoppingBag class="w-4 h-4" /> View Orders
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs text-gray-500 font-medium mb-1">Total Users</p>
                        <p class="text-2xl font-bold text-gray-900">{{ users.length }}</p>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Users class="w-6 h-6 text-blue-600"/>
                    </div>
                </div>
                <p class="text-xs text-gray-400 mt-2">Active consumers</p>
            </div>

            <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs text-gray-500 font-medium mb-1">Active Users</p>
                        <p class="text-2xl font-bold text-gray-900">{{ countBuyerByStatus('Active') }}</p>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck class="w-6 h-6 text-green-600"/>
                    </div>
                </div>
                <p class="text-xs text-gray-400 mt-2">Verified & active</p>
            </div>

            <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs text-gray-500 font-medium mb-1">New This Month</p>
                        <p class="text-2xl font-bold text-gray-900">{{ newThisMonth }}</p>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                        <UserPlus class="w-6 h-6 text-sky-600"/>
                    </div>
                </div>
                <p class="text-xs text-gray-400 mt-2">Joined this month</p>
            </div>

            <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-xs text-gray-500 font-medium mb-1">Avg Trust Score</p>
                        <p class="text-2xl font-bold text-gray-900">{{ avgBuyerTrustScore }}/100</p>
                    </div>
                    <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <TrendingUp class="w-6 h-6 text-purple-600"/>
                    </div>
                </div>
                <p class="text-xs text-gray-400 mt-2">Community average</p>
            </div>
        </div>

        <AdminUserTable
            :users="filteredUsers"
            :search-query="searchQuery"
            :filter-status="filterStatus"
            :filter-trust="filterTrust"
            :sort-by="sortBy"
            :status-class="statusClass"
            :trust-score-color="trustScoreColor"
            :role-avatar-class="roleAvatarClass"
            :initials="initials"
            @update:search-query="searchQuery = $event"
            @update:filter-status="filterStatus = $event"
            @update:filter-trust="filterTrust = $event"
            @update:sort-by="sortBy = $event"
            @reset-filters="resetFilters"
            @open-user="openUserModal"
            @ban-user="(user) => { suspendModal.user = user; suspendModal.visible = true; suspendModal.action = 'Banned'; }"
        />

        <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 translate-x-full"
            leave-active-class="transition-all duration-200 ease-in" leave-to-class="opacity-0 translate-x-full">
            <div v-if="userModal.visible" class="fixed inset-0 z-40 bg-white overflow-y-auto">
                <div v-if="userModal.user" class="min-h-screen">
                    <div class="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                        <div class="max-w-6xl mx-auto px-6 py-6">
                            <button @click="userModal.visible = false"
                                class="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium mb-4 text-sm">
                                ← Back to Users
                            </button>
                            <div class="flex items-center justify-between gap-6">
                                <div class="flex items-center gap-4">
                                    <div class="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold"
                                        :class="roleAvatarClass(userModal.user.role)">
                                        {{ initials(userModal.user.name) }}
                                    </div>
                                    <div>
                                        <h1 class="text-3xl font-bold text-gray-900">{{ userModal.user.name }}</h1>
                                        <p class="text-gray-600 mt-1">{{ userModal.user.email }}</p>
                                        <div class="flex items-center gap-3 mt-3">
                                            <span class="text-sm font-medium px-3 py-1 rounded-full" :class="roleClass(userModal.user.role)">{{ userModal.user.role }}</span>
                                            <span class="text-sm font-medium px-3 py-1 rounded-full" :class="statusClass(userModal.user.status)">{{ userModal.user.status }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <svg width="100" height="100" viewBox="0 0 64 64">
                                        <circle cx="32" cy="32" r="26" fill="none" stroke="#f3f4f6" stroke-width="6"/>
                                        <circle cx="32" cy="32" r="26" fill="none"
                                            :stroke="trustScoreBg(userModal.user.trustScore)"
                                            stroke-width="6" stroke-linecap="round"
                                            :stroke-dasharray="`${(userModal.user.trustScore/100)*163.4} 163.4`"
                                            transform="rotate(-90 32 32)"/>
                                        <text x="32" y="35" text-anchor="middle" font-size="16" font-weight="700"
                                            :fill="trustScoreBg(userModal.user.trustScore)" font-family="ui-mono,monospace">
                                            {{ userModal.user.trustScore }}
                                        </text>
                                    </svg>
                                    <p class="text-xs text-gray-600 mt-2 font-semibold">Trust Score</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="max-w-6xl mx-auto px-6 py-8 space-y-6">
                        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 class="text-lg font-bold text-gray-900 mb-6">Basic Information</h2>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <p class="text-xs font-semibold text-gray-600 mb-2">Full Name</p>
                                    <p class="text-base font-semibold text-gray-900">{{ userModal.user.name }}</p>
                                </div>
                                <div>
                                    <p class="text-xs font-semibold text-gray-600 mb-2">Email Address</p>
                                    <p class="text-base font-semibold text-gray-900">{{ userModal.user.email }}</p>
                                </div>
                                <div>
                                    <p class="text-xs font-semibold text-gray-600 mb-2">User ID</p>
                                    <p class="text-base font-mono font-semibold text-gray-900">#USR-{{ String(userModal.user.id).padStart(4,'0') }}</p>
                                </div>
                                <div>
                                    <p class="text-xs font-semibold text-gray-600 mb-2">Province</p>
                                    <p class="text-base font-semibold text-gray-900">{{ userModal.user.province }}</p>
                                </div>
                                <div>
                                    <p class="text-xs font-semibold text-gray-600 mb-2">Role</p>
                                    <span class="inline-block text-sm font-medium px-3 py-1 rounded-lg" :class="roleClass(userModal.user.role)">{{ userModal.user.role }}</span>
                                </div>
                                <div>
                                    <p class="text-xs font-semibold text-gray-600 mb-2">Status</p>
                                    <span class="inline-block text-sm font-medium px-3 py-1 rounded-lg" :class="statusClass(userModal.user.status)">{{ userModal.user.status }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <p class="text-xs text-gray-500 font-medium mb-2">Total Orders</p>
                                <p class="text-3xl font-bold text-gray-900">{{ userModal.user.orders }}</p>
                            </div>
                            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <p class="text-xs text-gray-500 font-medium mb-2">Rating</p>
                                <p class="text-3xl font-bold text-amber-500">{{ userModal.user.rating }}★</p>
                            </div>
                            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <p class="text-xs text-gray-500 font-medium mb-2">Disputes</p>
                                <p class="text-3xl font-bold" :class="userModal.user.disputes > 2 ? 'text-red-500' : 'text-green-600'">{{ userModal.user.disputes }}</p>
                            </div>
                            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <p class="text-xs text-gray-500 font-medium mb-2">Trust Score</p>
                                <p class="text-3xl font-bold" :class="trustScoreColor(userModal.user.trustScore)">{{ userModal.user.trustScore }}</p>
                            </div>
                        </div>

                        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 class="text-lg font-bold text-gray-900 mb-6">Account Timeline</h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p class="text-xs font-semibold text-gray-600 mb-2">Joined Date</p>
                                    <p class="text-base font-semibold text-gray-900">{{ userModal.user.joinedAt }}</p>
                                </div>
                                <div>
                                    <p class="text-xs font-semibold text-gray-600 mb-2">Last Active</p>
                                    <p class="text-base font-semibold text-gray-900">{{ userModal.user.lastActiveAt ?? '—' }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-3 pb-8">
                            <button @click="() => { suspendModal.user = userModal.user; suspendModal.visible = true; suspendModal.action = ''; userModal.visible = false }"
                                class="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100 font-medium transition">
                                <ShieldOff class="w-5 h-5"/> Suspend/Ban
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0"
            leave-active-class="transition-all duration-150 ease-in" leave-to-class="opacity-0">
            <div v-if="roleModal.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                @click.self="roleModal.visible = false">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4">
                    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                                <ArrowLeftRight class="w-4 h-4 text-purple-500"/>
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-gray-900">Change Role</p>
                                <p class="text-xs text-gray-400">{{ roleModal.user?.name }}</p>
                            </div>
                        </div>
                        <button @click="roleModal.visible = false" class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
                            <X class="w-4 h-4"/>
                        </button>
                    </div>
                    <div class="p-5 space-y-4">
                        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <span class="text-xs text-gray-500">Current role:</span>
                            <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="roleClass(roleModal.user?.role)">{{ roleModal.user?.role }}</span>
                        </div>
                        <div>
                            <label class="text-xs font-semibold text-gray-700 block mb-2">Assign New Role</label>
                            <div class="space-y-2">
                                <button v-for="r in roles" :key="r"
                                    @click="roleModal.newRole = r"
                                    :disabled="r === roleModal.user?.role"
                                    :class="['w-full text-xs font-medium px-3 py-2.5 rounded-xl border transition text-left flex items-center gap-2',
                                        roleModal.newRole === r ? 'border-purple-400 bg-purple-50 text-purple-700'
                                        : r === roleModal.user?.role ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300']">
                                    <span class="w-2 h-2 rounded-full flex-shrink-0"
                                        :class="r === 'Farmer' ? 'bg-green-400' : r === 'Buyer' ? 'bg-blue-400' : 'bg-purple-400'"></span>
                                    {{ r }}
                                    <span v-if="r === roleModal.user?.role" class="ml-auto text-[10px] text-gray-300">(current)</span>
                                </button>
                            </div>
                        </div>
                        <div v-if="roleModal.newRole === 'Admin'" class="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <AlertCircle class="w-4 h-4 text-amber-500 flex-shrink-0"/>
                            <p class="text-xs text-amber-700">Granting Admin access gives full platform control. Confirm carefully.</p>
                        </div>
                        <div class="flex gap-3">
                            <button @click="roleModal.visible = false"
                                class="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                            <button @click="executeRoleChange" :disabled="!roleModal.newRole"
                                class="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition disabled:opacity-40 disabled:cursor-not-allowed">
                                Confirm Change
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0"
            leave-active-class="transition-all duration-150 ease-in" leave-to-class="opacity-0">
            <div v-if="suspendModal.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                @click.self="suspendModal.visible = false">
                <div class="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
                    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                                <ShieldOff class="w-4 h-4 text-orange-500"/>
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-gray-900">Suspend / Ban User</p>
                                <p class="text-xs text-gray-400">{{ suspendModal.user?.name }}</p>
                            </div>
                        </div>
                        <button @click="suspendModal.visible = false" class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
                            <X class="w-4 h-4"/>
                        </button>
                    </div>
                    <div class="p-5 space-y-4">
                        <div class="grid grid-cols-2 gap-3">
                            <button @click="suspendModal.action = 'Suspended'"
                                :class="['p-3 rounded-xl border-2 transition text-left',
                                    suspendModal.action === 'Suspended' ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-gray-300']">
                                <p class="text-xs font-semibold text-gray-800">Suspend</p>
                                <p class="text-[11px] text-gray-400 mt-0.5">Temporary · can appeal · re-activatable</p>
                            </button>
                            <button @click="suspendModal.action = 'Banned'"
                                :class="['p-3 rounded-xl border-2 transition text-left',
                                    suspendModal.action === 'Banned' ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300']">
                                <p class="text-xs font-semibold text-gray-800">Ban</p>
                                <p class="text-[11px] text-gray-400 mt-0.5">Permanent · full access removed</p>
                            </button>
                        </div>
                        <div>
                            <label class="text-xs font-semibold text-gray-700 block mb-2">Reason</label>
                            <div class="grid grid-cols-2 gap-2 mb-3">
                                <button v-for="reason in suspendReasons" :key="reason"
                                    @click="suspendModal.reason = reason"
                                    :class="['text-xs font-medium px-3 py-2 rounded-xl border transition text-left',
                                        suspendModal.reason === reason
                                            ? 'border-orange-400 bg-orange-50 text-orange-700'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300']">
                                    {{ reason }}
                                </button>
                            </div>
                            <textarea v-model="suspendModal.note" rows="2"
                                placeholder="Additional notes (optional)…"
                                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition placeholder:text-gray-300 resize-none"></textarea>
                        </div>
                        <div class="flex gap-3">
                            <button @click="suspendModal.visible = false"
                                class="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                            <button @click="executeSuspend" :disabled="!suspendModal.reason || !suspendModal.action"
                                class="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition disabled:opacity-40 disabled:cursor-not-allowed">
                                Confirm Action
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 translate-y-2"
            leave-active-class="transition-all duration-200 ease-in" leave-to-class="opacity-0 translate-y-2">
            <div v-if="toast.visible"
                class="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium text-white min-w-[260px]"
                :class="{
                    'bg-gray-900':   toast.type === 'success',
                    'bg-red-500':    toast.type === 'error',
                    'bg-amber-500':  toast.type === 'warning',
                    'bg-purple-600': toast.type === 'info',
                }">
                <component :is="toast.type === 'success' ? CheckCheck : toast.type === 'warning' ? AlertCircle : toast.type === 'info' ? ArrowLeftRight : X"
                    class="w-4 h-4 flex-shrink-0"/>
                {{ toast.message }}
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
    Users, X, ShieldCheck, ShieldOff, CheckCheck,
    AlertCircle, TrendingUp, ArrowLeftRight, ShoppingBag,
    UserPlus,
} from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

const allUsers = ref([])

const users = computed(() => allUsers.value.filter(u => u.role === 'Buyer'))

const roles      = ['Buyer', 'Admin']
const statusTabs = ['All', 'Active', 'Suspended', 'Banned']

const countBuyerByStatus = (s) => users.value.filter(u => u.status === s).length
const avgBuyerTrustScore = computed(() => Math.round(users.value.reduce((a, u) => a + u.trustScore, 0) / (users.value.length || 1)))
const newThisMonth = computed(() => {
    const now = new Date()
    return users.value.filter(u => {
        const d = new Date(u.joinedAt || u.createdAt)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
})

const searchQuery  = ref('')
const filterStatus = ref('')
const filterRole   = ref('')
const filterTrust  = ref('')
const sortBy       = ref('name')

const filteredUsers = computed(() => {
    let result = users.value.filter(u => {
        const q  = searchQuery.value.toLowerCase()
        const ms = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        const mr = !filterRole.value   || u.role   === filterRole.value
        const mv = !filterStatus.value || u.status === filterStatus.value
        const mt = !filterTrust.value  ||
            (filterTrust.value === 'high' && u.trustScore >= 80) ||
            (filterTrust.value === 'mid'  && u.trustScore >= 50 && u.trustScore < 80) ||
            (filterTrust.value === 'low'  && u.trustScore < 50)
        return ms && mr && mv && mt
    })
    result = result.sort((a, b) => {
        switch (sortBy.value) {
            case 'name':        return a.name.localeCompare(b.name)
            case 'trust-desc':  return b.trustScore - a.trustScore
            case 'trust-asc':   return a.trustScore - b.trustScore
            case 'orders-desc': return b.orders - a.orders
            case 'rating-desc': return b.rating - a.rating
            default:            return 0
        }
    })
    return result
})

function resetFilters() {
    searchQuery.value  = ''
    filterStatus.value = ''
    filterRole.value   = ''
    filterTrust.value  = ''
    sortBy.value       = 'name'
}

const activityFilters = ['All', 'Role', 'Suspend']
const activityFilter  = ref('All')

const userActivity = ref([
    { id: 1, text: 'Kosal Rith suspended — payment dispute', time: '2 hrs ago', dotColor: 'bg-orange-400', tag: 'Suspend', tagClass: 'bg-orange-100 text-orange-700' },
    { id: 2, text: 'Maly Rith role changed Buyer → Admin',   time: '3 hrs ago', dotColor: 'bg-purple-500', tag: 'Role',    tagClass: 'bg-purple-100 text-purple-700' },
])

const filteredActivity = computed(() =>
    activityFilter.value === 'All'
        ? userActivity.value
        : userActivity.value.filter(a => a.tag === activityFilter.value)
)

function addActivity(text, color, tag, tagClass) {
    userActivity.value.unshift({ id: Date.now(), text, time: 'Just now', dotColor: color, tag, tagClass })
    if (userActivity.value.length > 10) userActivity.value.pop()
}

const geoFilter = ref('All')
const geoData = ref([
    { province: 'Phnom Penh',   count: 412, pct: 32 },
    { province: 'Kampong Cham', count: 198, pct: 15 },
    { province: 'Siem Reap',    count: 156, pct: 12 },
    { province: 'Kampot',       count: 110, pct: 9  },
    { province: 'Kratie',       count: 84,  pct: 7  },
    { province: 'Kandal',       count: 68,  pct: 5  },
    { province: 'Other',        count: 256, pct: 20 },
])

const auditLog = ref([
    { id: 1, time: '05:22', user: 'Maly Rith',  from: 'Buyer',     to: 'Admin',     by: 'admin01'    },
    { id: 2, time: '06:47', user: 'Kosal Rith', from: 'Active',    to: 'Suspended', by: 'admin02'    },
    { id: 3, time: '11:15', user: 'Bopha Lim',  from: 'Buyer',     to: 'Admin',     by: 'superadmin' },
    { id: 4, time: '14:03', user: 'Thy Heng',   from: 'Suspended', to: 'Active',    by: 'admin01'    },
])

function addAuditLog(user, from, to) {
    auditLog.value.unshift({
        id: Date.now(),
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        user, from, to, by: 'admin01',
    })
    if (auditLog.value.length > 8) auditLog.value.pop()
}

const suspendReasons = [
    'Payment dispute', 'Policy violation',
    'Spam / fake listing', 'Fraud suspected',
    'User request', 'Duplicate account',
]

function reinstateUser(id) {
    const u = users.value.find(x => x.id === id)
    if (!u) return
    u.status = 'Active'
    addActivity(`${u.name} reinstated`, 'bg-green-500', 'Role', 'bg-green-100 text-green-700')
    showToast(`${u.name} has been reinstated`, 'success')
}

function viewOrders() { navigateTo('/admin/orders') }
function exportCSV() { showToast('Exporting users to CSV…', 'success') }
function exportAuditLog() { showToast('Exporting audit log…', 'success') }

const roleModal = ref({ visible: false, user: null, newRole: '' })
function openRoleModal(user) { roleModal.value = { visible: true, user, newRole: '' } }
function executeRoleChange() {
    const u = users.value.find(x => x.id === roleModal.value.user?.id)
    if (!u || !roleModal.value.newRole) return
    const oldRole = u.role
    u.role = roleModal.value.newRole
    addAuditLog(u.name, oldRole, roleModal.value.newRole)
    addActivity(`${u.name} role changed ${oldRole} → ${roleModal.value.newRole}`, 'bg-purple-500', 'Role', 'bg-purple-100 text-purple-700')
    showToast(`${u.name} is now a ${roleModal.value.newRole}`, 'info')
    roleModal.value.visible = false
}

const suspendModal = ref({ visible: false, user: null, action: '', reason: '', note: '' })
function openSuspendModal(user) { suspendModal.value = { visible: true, user, action: '', reason: '', note: '' } }
function executeSuspend() {
    const u = users.value.find(x => x.id === suspendModal.value.user?.id)
    if (!u) return
    u.status = suspendModal.value.action
    addActivity(`${u.name} ${suspendModal.value.action.toLowerCase()} — ${suspendModal.value.reason}`, 'bg-orange-400', 'Suspend', 'bg-orange-100 text-orange-700')
    showToast(`${u.name} has been ${suspendModal.value.action.toLowerCase()}`, 'warning')
    suspendModal.value.visible = false
}

const userModal = ref({ visible: false, user: null })
function openUserModal(user) { userModal.value = { visible: true, user } }

const toast = ref({ visible: false, message: '', type: 'success' })
let toastTimer = null
function showToast(message, type = 'success') {
    if (toastTimer) clearTimeout(toastTimer)
    toast.value = { visible: true, message, type }
    toastTimer  = setTimeout(() => { toast.value.visible = false }, 3200)
}

const initials = (name) => name.split(' ').map(n => n[0]).join('')

const roleAvatarClass = (r) => ({
    Farmer: 'bg-green-100 text-green-700',
    Buyer:  'bg-blue-100 text-blue-700',
    Admin:  'bg-purple-100 text-purple-700',
}[r] ?? 'bg-gray-100 text-gray-600')

const roleClass = (r) => ({
    Farmer:    'bg-green-100 text-green-700',
    Buyer:     'bg-blue-100 text-blue-700',
    Admin:     'bg-purple-100 text-purple-700',
    Suspended: 'bg-orange-100 text-orange-600',
}[r] ?? 'bg-gray-100 text-gray-600')

const statusClass = (s) => ({
    Active:    'bg-green-100 text-green-700',
    Pending:   'bg-amber-100 text-amber-700',
    Suspended: 'bg-orange-100 text-orange-700',
    Banned:    'bg-red-100 text-red-600',
}[s] ?? 'bg-gray-100 text-gray-600')

const trustScoreColor = (s) => s >= 80 ? 'text-green-600' : s >= 50 ? 'text-amber-600' : 'text-red-500'
const trustScoreBg    = (s) => s >= 80 ? '#16a34a'        : s >= 50 ? '#d97706'        : '#dc2626'

const churnRiskClass = (r) => ({
    High:   'bg-red-100 text-red-600',
    Medium: 'bg-amber-100 text-amber-600',
    Low:    'bg-green-100 text-green-600',
}[r] ?? 'bg-gray-100 text-gray-600')
</script>