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

      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
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
          <label class="text-xs font-semibold text-on-surface-variant block mb-2">Match Status</label>
          <select
            :value="filterMatch"
            @change="$emit('update:filterMatch', ($event.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2 text-sm border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-surface-container-lowest text-on-surface transition"
          >
            <option value="">All Matches</option>
            <option value="matched">Matched</option>
            <option value="unmatched">Unmatched</option>
            <option value="seeking">Seeking Match</option>
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
            <option value="trust-desc">Trust Score (High-Low)</option>
            <option value="trust-asc">Trust Score (Low-High)</option>
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
      <table class="w-full">
        <thead>
          <tr class="border-b border-outline-variant bg-surface-container-low">
            <th class="px-5 py-3 text-left text-xs font-semibold text-on-surface-variant">Farmer</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-on-surface-variant">Main Crop</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-on-surface-variant">Location</th>
            <th class="px-5 py-3 text-center text-xs font-semibold text-on-surface-variant">Trust</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-on-surface-variant">Status</th>
            <th class="px-5 py-3 text-center text-xs font-semibold text-on-surface-variant">Match Status</th>
            <th class="px-5 py-3 text-center text-xs font-semibold text-on-surface-variant">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="farmers.length === 0">
            <td colspan="7" class="px-5 py-12">
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
            class="border-b border-outline-variant hover:bg-surface-container-low transition-colors"
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
                  <p class="text-sm font-semibold text-on-surface truncate">{{ farmer.name }}</p>
                  <p class="text-xs text-on-surface-variant truncate">{{ farmer.phone }}</p>
                </div>
              </div>
            </td>

            <td class="px-5 py-4">
              <div class="flex items-center gap-2">
                <Leaf class="w-4 h-4 text-secondary" />
                <span class="text-sm text-on-surface font-medium">{{ farmer.mainCrop }}</span>
              </div>
            </td>

            <td class="px-5 py-4">
              <p class="text-sm text-on-surface-variant truncate">{{ farmer.location }}</p>
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
                :class="farmer.matchStatus === 'Matched'
                  ? 'bg-secondary-container text-secondary border-outline-variant'
                  : farmer.matchStatus === 'Seeking'
                  ? 'bg-surface-container text-on-surface-variant border-outline'
                  : 'bg-surface-container-low text-on-surface-variant border-outline-variant'"
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
                  class="p-2 rounded-lg bg-secondary-container text-secondary transition-colors hover:bg-secondary hover:text-white"
                  title="View Profile"
                >
                  <Eye class="w-4 h-4" />
                </button>
                <button
                  @click="$emit('matchFarmer', farmer)"
                  class="p-2 rounded-lg bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
                  title="Match with Buyer"
                >
                  <ArrowRightLeft class="w-4 h-4" />
                </button>
                <button
                  @click="$emit('suspendFarmer', farmer)"
                  class="p-2 rounded-lg bg-error-container text-error transition-colors hover:bg-error hover:text-white"
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