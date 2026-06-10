<template>
  <section class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant">
    <div class="px-5 py-4 border-b border-outline-variant space-y-4">
      <div class="relative flex-1 min-w-[200px]">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Search by name or email…"
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
            <option value="Banned">Banned</option>
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
            <option value="orders-desc">Orders (Most)</option>
            <option value="rating-desc">Rating (Highest)</option>
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
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">User ID</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">Name</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">Email</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">Image</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">Status</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-on-surface-variant">Orders</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-on-surface-variant">Rating</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">Address</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="users.length === 0">
            <td colspan="8" class="px-4 py-12">
              <div class="flex flex-col items-center gap-3">
                <div class="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center">
                  <UserX class="w-6 h-6 text-on-surface-variant" />
                </div>
                <p class="text-sm font-medium text-on-surface-variant">No users found</p>
              </div>
            </td>
          </tr>

          <tr
            v-for="user in users"
            :key="user.id"
            @click="$emit('openUser', user)"
            class="border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <td class="px-4 py-3 font-mono font-semibold text-xs text-on-surface-variant whitespace-nowrap">
              #{{ String(user.id).slice(0, 8).toUpperCase() }}
            </td>

            <td class="px-4 py-3">
              <span class="text-sm font-semibold text-on-surface truncate block">{{ user.name }}</span>
            </td>

            <td class="px-4 py-3">
              <p class="text-sm text-on-surface-variant truncate">{{ user.email }}</p>
            </td>

            <td class="px-4 py-3">
              <div class="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  v-if="user.avatarUrl"
                  :src="user.avatarUrl"
                  :alt="user.name"
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
              <span class="inline-flex text-xs font-medium px-2.5 py-1 rounded-lg" :class="statusClass(user.status)">
                {{ user.status }}
              </span>
            </td>

            <td class="px-4 py-3 text-center">
              <p class="text-sm font-semibold text-on-surface">{{ user.orders }}</p>
            </td>

            <td class="px-4 py-3 text-center">
              <p class="text-sm font-semibold">
                <span class="text-on-surface">{{ user.rating }}</span><span class="text-amber-400">★</span>
              </p>
            </td>

            <td class="px-4 py-3">
              <p class="text-sm text-on-surface-variant truncate">{{ user.address }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Search, UserX } from 'lucide-vue-next'

defineProps<{
  users: any[]
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
  'openUser',
])
</script>
