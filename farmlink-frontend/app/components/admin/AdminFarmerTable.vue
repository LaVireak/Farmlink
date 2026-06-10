<template>
  <section class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant">
    <div class="px-5 py-4 border-b border-outline-variant space-y-4">
      <div class="relative flex-1 min-w-[200px]">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Search farmers by name or crop…"
          class="w-full pl-9 pr-4 py-2 text-sm border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-surface-container-lowest text-on-surface transition"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label class="text-xs font-semibold text-on-surface-variant block mb-2">Status</label>
          <select
            :value="filterStatus"
            @change="$emit('update:filterStatus', ($event.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2 text-sm border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-surface-container-lowest text-on-surface transition"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        <div>
          <label class="text-xs font-semibold text-on-surface-variant block mb-2">Sort By</label>
          <select
            :value="sortBy"
            @change="$emit('update:sortBy', ($event.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2 text-sm border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-surface-container-lowest text-on-surface transition"
          >
            <option value="name">Name (A-Z)</option>
            <option value="yield-desc">Est. Yield (High-Low)</option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="$emit('resetFilters')"
            class="w-full px-3 py-2 text-sm border border-outline text-on-surface-variant rounded-xl hover:bg-surface-container font-medium transition"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full table-fixed">
        <thead>
          <tr class="border-b border-outline-variant bg-surface-container-low">
            <th class="w-24 px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">Farmer ID</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">Name</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">Address</th>
            <th class="w-32 px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">Phone</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">Email</th>
            <th class="w-20 px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">Image</th>
            <th class="w-24 px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">ID Document</th>
            <th class="w-28 px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">Status</th>
            <th class="w-20 px-4 py-3 text-center text-xs font-semibold text-on-surface-variant">Rating</th>
            <th class="w-24 px-4 py-3 text-center text-xs font-semibold text-on-surface-variant">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="farmers.length === 0">
            <td colspan="10" class="px-5 py-12">
              <div class="flex flex-col items-center gap-3">
                <div class="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center">
                  <UserX class="w-6 h-6 text-on-surface-variant" />
                </div>
                <p class="text-sm font-medium text-on-surface-variant">No farmers found</p>
              </div>
            </td>
          </tr>

          <tr
            v-for="farmer in farmers"
            :key="farmer.id"
            @click="$emit('openFarmer', farmer)"
            class="border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <td class="px-4 py-3 font-mono font-semibold text-xs text-on-surface-variant truncate">
              #{{ String(farmer.id || '').slice(0, 8).toUpperCase() }}
            </td>

            <td class="px-4 py-3">
              <span class="text-sm font-semibold text-on-surface truncate block">{{ farmer.name }}</span>
            </td>

            <td class="px-4 py-3">
              <p class="text-sm text-on-surface-variant truncate">{{ farmer.location }}</p>
            </td>

            <td class="px-4 py-3">
              <span class="text-sm text-on-surface truncate block">{{ farmer.phone }}</span>
            </td>

            <td class="px-4 py-3">
              <span class="text-sm text-on-surface-variant truncate block">{{ farmer.email }}</span>
            </td>

            <td class="px-4 py-3">
              <div class="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center">
                <img
                  v-if="farmer.avatarUrl"
                  :src="resolveUrl(farmer.avatarUrl)"
                  :alt="farmer.name"
                  class="w-full h-full object-cover"
                />
                <svg
                  v-else
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-full h-full"
                >
                  <rect width="100" height="100" fill="#f0f0f0" />
                  <circle cx="50" cy="36" r="18" fill="#9e9e9e" />
                  <ellipse cx="50" cy="85" rx="30" ry="22" fill="#9e9e9e" />
                </svg>
              </div>
            </td>

            <td class="px-4 py-3">
              <div class="w-12 h-8 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                <img
                  v-if="farmer.idDocumentUrl"
                  :src="resolveUrl(farmer.idDocumentUrl)"
                  alt="Farmer ID"
                  class="w-full h-full object-cover"
                />
                <svg
                  v-else
                  viewBox="0 0 100 66"
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-full h-full"
                >
                  <rect width="100" height="66" fill="#f5f5f5" rx="4" />
                  <path d="M30 22h40M30 33h40M30 44h25" stroke="#bdbdbd" stroke-width="4" stroke-linecap="round" />
                </svg>
              </div>
            </td>

            <td class="px-4 py-3">
              <span class="inline-flex text-xs font-medium px-2.5 py-1 rounded-lg" :class="statusClass(farmer.status)">
                {{ farmer.status }}
              </span>
            </td>

            <td class="px-4 py-3 text-center">
              <p class="text-sm font-semibold">
                <span class="text-on-surface">{{ farmer.rating || 0 }}</span><span class="text-amber-500">★</span>
              </p>
            </td>

            <td class="px-4 py-3" @click.stop>
              <div class="flex items-center justify-center">
                <button
                  @click="$emit('suspendFarmer', farmer)"
                  class="p-2 rounded-lg bg-error-container text-error transition-colors hover:bg-error hover:text-white"
                  title="Suspend / Ban Farmer"
                >
                  <ShieldOff class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Search, UserX, ShieldOff } from 'lucide-vue-next'

defineProps<{
  farmers: any[]
  searchQuery: string
  filterStatus: string
  sortBy: string
  statusClass: (s: string) => string
  roleAvatarClass: (r: string) => string
  initials: (name: string) => string
}>()

defineEmits([
  'update:searchQuery',
  'update:filterStatus',
  'update:sortBy',
  'resetFilters',
  'openFarmer',
  'suspendFarmer',
])

const config = useRuntimeConfig()
const STATIC_BASE = (config.public.apiUrl as string).replace('/api', '')

function resolveUrl(url: string | undefined): string {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:')) return url
  return `${STATIC_BASE}/${url}`
}
</script>