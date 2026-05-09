<template>
  <section class="bg-white rounded-2xl shadow-sm border border-gray-100">
    <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 flex-wrap">
      <div class="relative flex-1 min-w-[180px]">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Search products or farmers…"
          class="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition"
        />
      </div>

      <div class="flex items-center gap-0.5 bg-gray-100 rounded-xl p-1">
        <button
          v-for="s in statusTabs"
          :key="s"
          @click="$emit('update:filterStatus', s)"
          :class="[
            'text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150',
            filterStatus === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
          ]"
        >
          {{ s }}
        </button>
      </div>

      <select
        :value="filterCategory"
        @change="$emit('update:filterCategory', ($event.target as HTMLSelectElement).value)"
        class="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 bg-white text-gray-600"
      >
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-xs text-gray-400 border-b border-gray-100">
            <th class="px-5 py-3 font-medium">Product</th>
            <th class="px-4 py-3 font-medium">Farmer</th>
            <th class="px-4 py-3 font-medium">Category</th>
            <th class="px-4 py-3 font-medium">Price</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 font-medium">Featured</th>
            <th class="px-4 py-3 font-medium">Submitted</th>
            <th class="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="products.length === 0">
            <td colspan="8" class="px-5 py-14 text-center">
              <div class="flex flex-col items-center gap-3">
                <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                  <PackageSearch class="w-6 h-6 text-gray-300" />
                </div>
                <p class="text-sm font-medium text-gray-500">No products found</p>
                <p class="text-xs text-gray-400">Try adjusting your filters</p>
              </div>
            </td>
          </tr>

          <tr
            v-for="product in products"
            :key="product.id"
            class="border-b border-gray-50 hover:bg-gray-50/60 transition group"
          >
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <div class="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
                </div>
                <div>
                  <p class="font-semibold text-gray-800 text-sm">{{ product.name }}</p>
                  <p class="text-[11px] text-gray-400 font-mono">#PRD-{{ String(product.id).padStart(4, '0') }}</p>
                </div>
              </div>
            </td>

            <td class="px-4 py-3.5">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {{ initials(product.farmer) }}
                </div>
                <span class="text-xs text-gray-700 font-medium">{{ product.farmer }}</span>
              </div>
            </td>

            <td class="px-4 py-3.5">
              <span class="text-xs font-medium px-2 py-1 rounded-full" :class="categoryClass(product.category)">
                {{ product.category }}
              </span>
            </td>

            <td class="px-4 py-3.5 font-semibold text-gray-800">${{ product.price }}</td>

            <td class="px-4 py-3.5">
              <span class="text-xs font-medium px-2.5 py-1 rounded-full" :class="statusClass(product.status)">
                {{ product.status }}
              </span>
            </td>

            <td class="px-4 py-3.5">
              <button
                v-if="product.status === 'Approved'"
                @click="$emit('toggleFeatured', product.id)"
                class="transition-transform hover:scale-110"
              >
                <Star
                  class="w-4 h-4 transition-colors"
                  :class="product.featured ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-100'"
                />
              </button>
              <span v-else class="text-gray-200 text-xs">—</span>
            </td>

            <td class="px-4 py-3.5 text-xs text-gray-400">{{ product.submittedAt }}</td>

            <td class="px-4 py-3.5">
              <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  @click="$emit('viewProduct', product)"
                  class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                  title="View details"
                >
                  <Eye class="w-3.5 h-3.5" />
                </button>
                <button
                  v-if="product.status === 'Pending' || product.status === 'Rejected'"
                  @click="$emit('approveProduct', product.id)"
                  class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-600 transition"
                  title="Approve"
                >
                  <CheckCircle2 class="w-3.5 h-3.5" />
                </button>
                <button
                  v-if="product.status === 'Pending' || product.status === 'Approved'"
                  @click="$emit('rejectProduct', product)"
                  class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                  title="Reject"
                >
                  <XCircle class="w-3.5 h-3.5" />
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
import { CheckCircle2, Eye, PackageSearch, Search, Star, XCircle } from 'lucide-vue-next'

defineProps<{
  products: any[]
  categories: string[]
  searchQuery: string
  filterStatus: string
  filterCategory: string
  statusTabs: string[]
  categoryClass: (c: string) => string
  statusClass: (s: string) => string
  initials: (name: string) => string
}>()

defineEmits([
  'update:searchQuery',
  'update:filterStatus',
  'update:filterCategory',
  'toggleFeatured',
  'viewProduct',
  'approveProduct',
  'rejectProduct',
])
</script>
