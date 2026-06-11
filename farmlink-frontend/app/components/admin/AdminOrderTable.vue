<template>
  <section class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant">
    <!-- Header: Search & Filters (Matching User Table layout) -->
    <div class="px-5 py-4 border-b border-outline-variant space-y-4">
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <h3 class="text-base font-semibold text-on-surface">Recent Orders</h3>
        <span class="text-xs text-on-surface-variant whitespace-nowrap">
          {{ filteredOrders.length }} of {{ orders.length }} orders
        </span>
      </div>

      <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <!-- Search Box (Half Left) -->
        <div class="relative w-full md:w-1/2">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            :value="filters.search"
            @input="updateFilter('search', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="Search orders..."
            class="w-full pl-9 pr-4 py-2 text-sm border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-surface-container-lowest text-on-surface transition"
          />
        </div>

        <!-- Filters (Right aligned) -->
        <div class="flex items-center gap-3 flex-wrap md:justify-end flex-1">
          <select
            :value="filters.status"
            @change="updateFilter('status', ($event.target as HTMLSelectElement).value)"
            class="px-3 py-2 text-sm border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-surface-container-lowest text-on-surface transition"
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
            class="px-3 py-2 text-sm border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-surface-container-lowest text-on-surface transition"
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
            class="px-3 py-2 text-sm border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-surface-container-lowest text-on-surface transition"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>

          <button
            @click="$emit('resetFilters')"
            :disabled="!hasActiveFilters"
            class="px-4 py-2 text-sm border border-outline text-on-surface-variant rounded-xl hover:bg-surface-container font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-5 space-y-3 min-h-[450px] flex flex-col justify-center">
      <div v-for="i in 5" :key="i" class="h-12 bg-surface-container rounded-lg animate-pulse" />
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredOrders.length === 0" class="px-5 py-14 text-center min-h-[450px] flex flex-col justify-center items-center">
      <div class="flex flex-col items-center gap-3">
        <div class="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center">
          <ShoppingBag class="w-6 h-6 text-on-surface-variant" />
        </div>
        <p class="text-sm font-medium text-on-surface-variant">No orders found</p>
        <p class="text-xs text-on-surface-variant">Try adjusting your filters</p>
      </div>
    </div>

    <!-- Table: Matching User Table Structure with all Supabase attributes -->
    <div v-else class="overflow-auto max-h-[550px] min-h-[450px] relative">
      <table class="w-full table-fixed min-w-[1400px]">
        <thead>
          <tr class="border-b border-outline-variant bg-surface-container-low sticky top-0 z-10 shadow-sm">
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant w-32">Order ID</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant w-44">Customer</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant w-60">Product</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant w-28">Amount</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant w-44">Payment Method</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant w-36">Payment Status</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant w-64">Delivery Address</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant w-36">Date</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant w-32">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            @click="$emit('openOrder', order)"
            class="border-b border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <!-- Order ID/Number -->
            <td class="px-4 py-3 font-mono font-semibold text-xs text-on-surface-variant whitespace-nowrap overflow-hidden text-ellipsis">
              #{{ String(order.orderNumber !== '—' ? order.orderNumber : order.id).replace(/^ORD-/i, '').slice(0, 8).toUpperCase() }}
            </td>
            
            <!-- Customer -->
            <td class="px-4 py-3 overflow-hidden text-ellipsis whitespace-nowrap">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-on-surface text-sm truncate">{{ order.customer }}</span>
              </div>
            </td>
            
            <!-- Product -->
            <td class="px-4 py-3 text-on-surface-variant text-sm truncate" :title="order.product">
              {{ order.product }}
            </td>
            
            <!-- Amount -->
            <td class="px-4 py-3 font-semibold text-on-surface text-sm truncate">
              {{ order.amount }}
            </td>

            <!-- Payment Method -->
            <td class="px-4 py-3 text-on-surface-variant text-sm truncate">
              {{ order.paymentMethod }}
            </td>

            <!-- Payment Status -->
            <td class="px-4 py-3 whitespace-nowrap">
              <span class="inline-flex text-xs font-medium px-2.5 py-1 rounded-lg" :class="paymentStatusClass(order.paymentStatus)">
                {{ order.paymentStatus }}
              </span>
            </td>

            <!-- Delivery Address -->
            <td class="px-4 py-3 text-on-surface-variant text-sm truncate" :title="order.deliveryAddress">
              {{ order.deliveryAddress }}
            </td>
            
            <!-- Date -->
            <td class="px-4 py-3 text-xs text-on-surface-variant truncate">
              {{ order.date }}
            </td>
            
            <!-- Status -->
            <td class="px-4 py-3">
              <span class="inline-flex text-xs font-medium px-2.5 py-1 rounded-lg" :class="statusClass(order.status)">
                {{ order.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Search, ShoppingBag } from 'lucide-vue-next'

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

const emit = defineEmits(['update:filters', 'resetFilters', 'openOrder'])

function updateFilter(key: string, value: string) {
  emit('update:filters', {
    ...props.filters,
    [key]: value,
  })
}

const paymentStatusClass = (status: string) => {
  const map: Record<string, string> = {
    Paid: 'bg-green-100 text-green-700',
    Unpaid: 'bg-yellow-100 text-yellow-700',
    Refunded: 'bg-orange-100 text-orange-700',
    Failed: 'bg-red-100 text-red-700',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}
</script>