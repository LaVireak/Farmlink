<template>
  <section class="bg-surface-container-lowest rounded-2xl shadow p-5">
    <div class="flex items-center justify-between mb-4 gap-3 flex-wrap">
      <h3 class="text-base font-semibold text-on-surface">Recent Orders</h3>

      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          :value="filters.search"
          @input="updateFilter('search', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Search orders..."
          class="pl-9 pr-3 py-1.5 text-sm border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-surface-container-lowest text-on-surface w-52"
        />
      </div>

      <select
        :value="filters.status"
        @change="updateFilter('status', ($event.target as HTMLSelectElement).value)"
        class="text-sm border border-outline-variant rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-secondary bg-surface-container-lowest text-on-surface"
      >
        <option value="">All Statuses</option>
        <option value="Completed">Completed</option>
        <option value="Processing">Processing</option>
        <option value="Pending">Pending</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <select
        :value="filters.dateRange"
        @change="updateFilter('dateRange', ($event.target as HTMLSelectElement).value)"
        class="text-sm border border-outline-variant rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-secondary bg-surface-container-lowest text-on-surface"
      >
        <option value="">All Dates</option>
        <option value="today">Today</option>
        <option value="7">Last 7 Days</option>
        <option value="30">Last 30 Days</option>
        <option value="90">Last 90 Days</option>
      </select>

      <select
        :value="filters.sort"
        @change="updateFilter('sort', ($event.target as HTMLSelectElement).value)"
        class="text-sm border border-outline-variant rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-secondary bg-surface-container-lowest text-on-surface"
      >
        <option value="date_desc">Newest First</option>
        <option value="date_asc">Oldest First</option>
        <option value="amount_desc">Highest Amount</option>
        <option value="amount_asc">Lowest Amount</option>
      </select>

      <span class="text-xs text-on-surface-variant whitespace-nowrap">
        {{ filteredOrders.length }} of {{ orders.length }} orders
      </span>

      <button
        v-if="hasActiveFilters"
        @click="$emit('resetFilters')"
        class="text-xs text-error hover:underline whitespace-nowrap"
      >
        Clear filters
      </button>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-12 bg-surface-container rounded-lg animate-pulse" />
    </div>

    <div v-else-if="filteredOrders.length === 0" class="py-16 text-center text-on-surface-variant text-sm">
      <p class="text-base font-medium text-on-surface mb-1">No orders found</p>
      <p>Try adjusting your filters</p>
    </div>

    <table v-else class="w-full text-sm">
      <thead>
        <tr class="text-left text-xs text-on-surface-variant border-b border-outline-variant">
          <th class="pb-3 font-medium">Order ID</th>
          <th class="pb-3 font-medium">Customer</th>
          <th class="pb-3 font-medium">Product</th>
          <th class="pb-3 font-medium">Amount</th>
          <th class="pb-3 font-medium">Date</th>
          <th class="pb-3 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in filteredOrders"
          :key="order.id"
          class="border-b border-outline-variant hover:bg-surface-container-low transition"
        >
          <td class="py-3 pr-2 font-mono text-xs text-on-surface-variant">{{ order.id }}</td>
          <td class="py-3 pr-2">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-secondary-container text-secondary flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {{ initials(order.customer) }}
              </div>
              <span class="font-medium text-on-surface">{{ order.customer }}</span>
            </div>
          </td>
          <td class="py-3 pr-2 text-on-surface-variant">{{ order.product }}</td>
          <td class="py-3 pr-2 font-semibold text-on-surface">{{ order.amount }}</td>
          <td class="py-3 pr-2 text-on-surface-variant text-xs">{{ order.date }}</td>
          <td class="py-3">
            <span class="text-xs font-medium px-2 py-1 rounded-full" :class="statusClass(order.status)">
              {{ order.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { Search } from 'lucide-vue-next'

const props = defineProps<{
  loading: boolean
  orders: any[]
  filteredOrders: any[]
  filters: {
    search: string
    status: string
    dateRange: string
    sort: string
  }
  hasActiveFilters: boolean
  statusClass: (status: string) => string
  initials: (name: string) => string
}>()

const emit = defineEmits(['update:filters', 'resetFilters'])

function updateFilter(key: string, value: string) {
  emit('update:filters', {
    ...props.filters,
    [key]: value,
  })
}
</script>