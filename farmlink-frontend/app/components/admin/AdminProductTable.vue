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



      <select
        :value="filterCategory"
        @change="$emit('update:filterCategory', ($event.target as HTMLSelectElement).value)"
        class="text-sm border border-outline-variant rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary bg-surface-container-lowest text-on-surface-variant"
      >
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>

      <button
        @click="exportCSV"
        class="flex items-center gap-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container-low text-sm font-medium px-4 py-2 rounded-xl transition-colors duration-150 flex-shrink-0"
      >
        <Download class="w-4 h-4" />
        Export CSV
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-xs text-on-surface-variant border-b border-outline-variant">
            <th class="px-5 py-3 font-medium">Product ID</th>
            <th class="px-4 py-3 font-medium">Image</th>
            <th class="px-4 py-3 font-medium">Product Name</th>
            <th class="px-4 py-3 font-medium">Farmer</th>
            <th class="px-4 py-3 font-medium">Category</th>
            <th class="px-4 py-3 font-medium">Price</th>
            <th class="px-4 py-3 font-medium">Organic</th>
            <th class="px-4 py-3 font-medium">Submitted</th>
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
            @click="$emit('viewProduct', product)"
            class="border-b border-outline-variant hover:bg-surface-container-low/60 transition group cursor-pointer"
          >
            <td class="px-5 py-3.5 font-mono font-semibold text-xs text-on-surface-variant">
              #{{ String(product.id).slice(0, 8).toUpperCase() }}
            </td>

            <td class="px-4 py-3.5">
              <div class="relative w-10 h-10 rounded-xl overflow-hidden bg-surface-container flex-shrink-0">
                <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
              </div>
            </td>

            <td class="px-4 py-3.5">
              <p class="font-semibold text-on-surface text-sm">{{ product.name }}</p>
            </td>

            <td class="px-4 py-3.5">
              <div class="flex items-center gap-2">
                <span class="text-xs text-on-surface font-medium">{{ product.farmer }}</span>
              </div>
            </td>

            <td class="px-4 py-3.5">
              <span class="text-xs font-medium px-2 py-1 rounded-full" :class="categoryClass(product.category)">
                {{ product.category }}
              </span>
            </td>

            <td class="px-4 py-3.5 font-semibold text-on-surface">${{ product.price }} / {{ product.unit || 'kg' }}</td>



            <td class="px-4 py-3.5">
              <span
                v-if="product.isOrganic"
                class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100/50"
              >
                🌱 Organic
              </span>
              <span v-else class="text-on-surface-variant text-xs">—</span>
            </td>

            <td class="px-4 py-3.5 text-xs text-on-surface-variant">{{ product.submittedAt }}</td>

          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PackageSearch, Search, Download } from 'lucide-vue-next'

const props = defineProps<{
  products: any[]
  categories: string[]
  searchQuery: string
  filterCategory: string
  categoryClass: (c: string) => string
  initials: (name: string) => string
}>()

defineEmits([
  'update:searchQuery',
  'update:filterCategory',
  'viewProduct',
])

function exportCSV() {
  if (!props.products.length) return

  const headers = [
    'Product ID',
    'Name (EN)',
    'Name (KM)',
    'Category',
    'Farmer',
    'Price (USD)',
    'Unit',
    'Min Order Qty',
    'Stock',
    'Status',
    'Organic',
    'Seasonal',
    'Season Start',
    'Season End',
    'Total Sold',
    'Avg Rating',
    'Description',
    'Submitted',
    'Last Updated',
  ]

  const escape = (val: any) => {
    const str = String(val ?? '—')
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str
  }

  const rows = props.products.map(p => [
    String(p.id).slice(0, 8).toUpperCase(),
    escape(p.name),
    escape(p.nameKm || ''),
    escape(p.category),
    escape(p.farmer),
    p.price,
    p.unit || 'kg',
    p.minOrderQty ?? 1,
    p.stock ?? 0,
    escape(p.rawStatus || p.status || ''),
    p.isOrganic ? 'Yes' : 'No',
    p.isSeasonal ? 'Yes' : 'No',
    escape(p.seasonStart || ''),
    escape(p.seasonEnd || ''),
    p.totalSold ?? 0,
    p.avgRating != null ? Number(p.avgRating).toFixed(2) : '',
    escape(p.description || ''),
    escape(p.submittedAt),
    escape(p.updatedAt || ''),
  ].join(','))

  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const date = new Date().toISOString().slice(0, 10)

  const link = document.createElement('a')
  link.href     = url
  link.download = `farmlink-products-${date}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
</script>