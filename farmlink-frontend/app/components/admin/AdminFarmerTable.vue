<template>
  <section class="bg-white rounded-2xl shadow-sm border border-gray-100">
    <div class="px-5 py-4 border-b border-gray-100 space-y-4">
      <div class="relative flex-1 min-w-[200px]">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Search farmers by name or crop…"
          class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label class="text-xs font-semibold text-gray-600 block mb-2">Status</label>
          <select
            :value="filterStatus"
            @change="$emit('update:filterStatus', ($event.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        <div>
          <label class="text-xs font-semibold text-gray-600 block mb-2">Match Status</label>
          <select
            :value="filterMatch"
            @change="$emit('update:filterMatch', ($event.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition"
          >
            <option value="">All Matches</option>
            <option value="matched">Matched</option>
            <option value="unmatched">Unmatched</option>
            <option value="seeking">Seeking Match</option>
          </select>
        </div>

        <div>
          <label class="text-xs font-semibold text-gray-600 block mb-2">Sort By</label>
          <select
            :value="sortBy"
            @change="$emit('update:sortBy', ($event.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition"
          >
            <option value="name">Name (A-Z)</option>
            <option value="trust-desc">Trust Score (High-Low)</option>
            <option value="trust-asc">Trust Score (Low-High)</option>
            <option value="yield-desc">Est. Yield (High-Low)</option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="$emit('resetFilters')"
            class="w-full px-3 py-2 text-sm border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 font-medium transition"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50">
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600">Farmer</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600">Main Crop</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600">Location</th>
            <th class="px-5 py-3 text-center text-xs font-semibold text-gray-600">Trust</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
            <th class="px-5 py-3 text-center text-xs font-semibold text-gray-600">Match Status</th>
            <th class="px-5 py-3 text-center text-xs font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="farmers.length === 0">
            <td colspan="7" class="px-5 py-12">
              <div class="flex flex-col items-center gap-3">
                <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                  <UserX class="w-6 h-6 text-gray-300" />
                </div>
                <p class="text-sm font-medium text-gray-500">No farmers found</p>
              </div>
            </td>
          </tr>

          <tr
            v-for="farmer in farmers"
            :key="farmer.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  :class="roleAvatarClass('Farmer')"
                >
                  {{ initials(farmer.name) }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">{{ farmer.name }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ farmer.phone }}</p>
                </div>
              </div>
            </td>

            <td class="px-5 py-4">
              <div class="flex items-center gap-2">
                <Leaf class="w-4 h-4 text-green-600" />
                <span class="text-sm text-gray-700 font-medium">{{ farmer.mainCrop }}</span>
              </div>
            </td>

            <td class="px-5 py-4">
              <p class="text-sm text-gray-600 truncate">{{ farmer.location }}</p>
            </td>

            <td class="px-5 py-4 text-center">
              <p class="text-sm font-bold" :class="trustScoreColor(farmer.trustScore)">{{ farmer.trustScore }}</p>
            </td>

            <td class="px-5 py-4">
              <span class="inline-flex text-xs font-medium px-2.5 py-1 rounded-lg" :class="statusClass(farmer.status)">
                {{ farmer.status }}
              </span>
            </td>

            <td class="px-5 py-4 text-center">
              <span 
                class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border"
                :class="farmer.matchStatus === 'Matched' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : farmer.matchStatus === 'Seeking' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-700 border-gray-200'"
              >
                <Link2 class="w-3.5 h-3.5" v-if="farmer.matchStatus === 'Matched'" />
                <Search class="w-3.5 h-3.5" v-else-if="farmer.matchStatus === 'Seeking'" />
                <Unlink class="w-3.5 h-3.5" v-else />
                {{ farmer.matchStatus }}
              </span>
            </td>

            <td class="px-5 py-4">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="$emit('openFarmer', farmer)"
                  class="p-2 rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                  title="View Profile"
                >
                  <Eye class="w-4 h-4" />
                </button>
                <button
                  @click="$emit('matchFarmer', farmer)"
                  class="p-2 rounded-lg bg-indigo-50 text-indigo-600 transition-colors hover:bg-indigo-100"
                  title="Match with Buyer"
                >
                  <ArrowRightLeft class="w-4 h-4" />
                </button>
                <button
                  @click="$emit('suspendFarmer', farmer)"
                  class="p-2 rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                  title="Suspend Farmer"
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
import { Eye, Search, ShieldOff, UserX, Leaf, Link2, Unlink, ArrowRightLeft } from 'lucide-vue-next'

defineProps<{
  farmers: any[]
  searchQuery: string
  filterStatus: string
  filterMatch: string
  sortBy: string
  statusClass: (s: string) => string
  trustScoreColor: (s: number) => string
  roleAvatarClass: (r: string) => string
  initials: (name: string) => string
}>()

defineEmits([
  'update:searchQuery',
  'update:filterStatus',
  'update:filterMatch',
  'update:sortBy',
  'resetFilters',
  'openFarmer',
  'matchFarmer',
  'suspendFarmer',
])
</script>
