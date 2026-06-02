<template>
  <section class="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant">
    <div class="flex items-center gap-3 px-5 py-4 border-b border-outline-variant flex-wrap">
      <div class="relative flex-1 min-w-[180px]">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Search products or farmers…"
          class="w-full pl-9 pr-4 py-2 text-sm border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-surface-container-lowest text-on-surface transition"
        />
      </div>

      <div class="flex items-center gap-0.5 bg-surface-container rounded-xl p-1">
        <button
          v-for="s in statusTabs"
          :key="s"
          @click="$emit('update:filterStatus', s)"
          :class="[
            'text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150',
            filterStatus === s ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
          ]"
        >
          {{ s }}
        </button>
      </div>

      <select
        :value="filterCategory"
        @change="$emit('update:filterCategory', ($event.target as HTMLSelectElement).value)"
        class="text-sm border border-outline-variant rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-surface-container-lowest text-on-surface-variant"
      >
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-xs text-on-surface-variant border-b border-outline-variant">
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
                <div class="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center">
                  <PackageSearch class="w-6 h-6 text-on-surface-variant" />
                </div>
                <p class="text-sm font-medium text-on-surface-variant">No products found</p>
                <p class="text-xs text-on-surface-variant">Try adjusting your filters</p>
              </div>
            </td>
          </tr>

          <tr
            v-for="product in products"
            :key="product.id"
            class="border-b border-outline-variant hover:bg-surface-container-low/60 transition group"
          >
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <div class="relative w-10 h-10 rounded-xl overflow-hidden bg-surface-container flex-shrink-0">
                  <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
                </div>
                <div>
                  <p class="font-semibold text-on-surface text-sm">{{ product.name }}</p>
                  <p class="text-[11px] text-on-surface-variant font-mono">#PRD-{{ String(product.id).padStart(4, '0') }}</p>
                </div>
              </div>
            </td>

            <td class="px-4 py-3.5">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-secondary-container text-secondary flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {{ initials(product.farmer) }}
                </div>
                <span class="text-xs text-on-surface font-medium">{{ product.farmer }}</span>
              </div>
            </td>

            <td class="px-4 py-3.5">
              <span class="text-xs font-medium px-2 py-1 rounded-full" :class="categoryClass(product.category)">
                {{ product.category }}
              </span>
            </td>

            <td class="px-4 py-3.5 font-semibold text-on-surface">${{ product.price }}</td>

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
                  :class="product.featured ? 'text-amber-400 fill-amber-400' : 'text-on-surface-variant fill-surface-container'"
                />
              </button>
              <span v-else class="text-on-surface-variant text-xs">—</span>
            </td>

            <td class="px-4 py-3.5 text-xs text-on-surface-variant">{{ product.submittedAt }}</td>

            <td class="px-4 py-3.5">
              <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  @click="$emit('viewProduct', product)"
                  class="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition"
                  title="View details"
                >
                  <Eye class="w-3.5 h-3.5" />
                </button>
                <button
                  v-if="product.status === 'Pending' || product.status === 'Rejected'"
                  @click="$emit('approveProduct', product.id)"
                  class="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-secondary-container hover:text-secondary transition"
                  title="Approve"
                >
                  <CheckCircle2 class="w-3.5 h-3.5" />
                </button>
                <button
                  v-if="product.status === 'Pending' || product.status === 'Approved'"
                  @click="$emit('rejectProduct', product)"
                  class="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-error transition"
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