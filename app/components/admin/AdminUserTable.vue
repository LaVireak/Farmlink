<template>
  <section class="bg-white rounded-2xl shadow-sm border border-gray-100">
    <div class="px-5 py-4 border-b border-gray-100 space-y-4">
      <div class="relative flex-1 min-w-[200px]">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Search by name or email…"
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
            <option value="Banned">Banned</option>
          </select>
        </div>

        <div>
          <label class="text-xs font-semibold text-gray-600 block mb-2">Trust Score</label>
          <select
            :value="filterTrust"
            @change="$emit('update:filterTrust', ($event.target as HTMLSelectElement).value)"
            class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition"
          >
            <option value="">All Scores</option>
            <option value="high">High (80+)</option>
            <option value="mid">Medium (50-79)</option>
            <option value="low">Low (0-49)</option>
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
            <option value="orders-desc">Orders (Most)</option>
            <option value="rating-desc">Rating (Highest)</option>
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
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600">User</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
            <th class="px-5 py-3 text-center text-xs font-semibold text-gray-600">Trust</th>
            <th class="px-5 py-3 text-center text-xs font-semibold text-gray-600">Orders</th>
            <th class="px-5 py-3 text-center text-xs font-semibold text-gray-600">Rating</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600">Province</th>
            <th class="px-5 py-3 text-center text-xs font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="users.length === 0">
            <td colspan="8" class="px-5 py-12">
              <div class="flex flex-col items-center gap-3">
                <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                  <UserX class="w-6 h-6 text-gray-300" />
                </div>
                <p class="text-sm font-medium text-gray-500">No users found</p>
              </div>
            </td>
          </tr>

          <tr
            v-for="user in users"
            :key="user.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  :class="roleAvatarClass(user.role)"
                >
                  {{ initials(user.name) }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">{{ user.name }}</p>
                </div>
              </div>
            </td>

            <td class="px-5 py-4">
              <p class="text-sm text-gray-600 truncate">{{ user.email }}</p>
            </td>

            <td class="px-5 py-4">
              <span class="inline-flex text-xs font-medium px-2.5 py-1 rounded-lg" :class="statusClass(user.status)">
                {{ user.status }}
              </span>
            </td>

            <td class="px-5 py-4 text-center">
              <p class="text-sm font-bold" :class="trustScoreColor(user.trustScore)">{{ user.trustScore }}</p>
            </td>

            <td class="px-5 py-4 text-center">
              <p class="text-sm font-semibold text-gray-900">{{ user.orders }}</p>
            </td>

            <td class="px-5 py-4 text-center">
              <p class="text-sm font-semibold">
                <span class="text-gray-900">{{ user.rating }}</span><span class="text-amber-400">★</span>
              </p>
            </td>

            <td class="px-5 py-4">
              <p class="text-sm text-gray-600">{{ user.province }}</p>
            </td>

            <td class="px-5 py-4">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="$emit('openUser', user)"
                  class="p-2 rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                  title="View Profile"
                >
                  <Eye class="w-4 h-4" />
                </button>
                <button
                  @click="$emit('banUser', user)"
                  class="p-2 rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                  title="Ban User"
                >
                  <ShieldX class="w-4 h-4" />
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
import { Eye, Search, ShieldX, UserX } from 'lucide-vue-next'

defineProps<{
  users: any[]
  searchQuery: string
  filterStatus: string
  filterTrust: string
  sortBy: string
  statusClass: (s: string) => string
  trustScoreColor: (s: number) => string
  roleAvatarClass: (r: string) => string
  initials: (name: string) => string
}>()

defineEmits([
  'update:searchQuery',
  'update:filterStatus',
  'update:filterTrust',
  'update:sortBy',
  'resetFilters',
  'openUser',
  'banUser',
])
</script>
