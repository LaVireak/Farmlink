<template>
  <AppHeader />

    <section class="promo-banner">
      <div class="banner-overlay"></div>
      <div class="banner-content">
        <span class="banner-pill">🌿 FRESH PICKS</span>
        <h1>Farm Fresh Produce</h1>
        <p>Harvested daily from local Cambodian farms — delivered straight to your table.</p>
      </div>
    </section>
    <section class="py-8 px-4">
    <div class="text-center">
        <h1 class="text-3xl font-bold">Browse Our Farms</h1>
        <p class="text-gray-600 mt-2">Fresh items directly from local farms</p>
      </div>
      </section>
<div class="products-layout">
    <aside class="filter-sidebar">

        <div class="filter-section">
          <h3 class="filter-title">Province</h3>
          <select v-model="province" class="filter-select">
            <option value="All">All Provinces</option>
            <option v-for="cat in allCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <div class="filter-section">
          <h3 class="filter-title">Rating</h3>
          <div class="rating-filters">
            <button
              v-for="r in [5, 4, 3, 2, 1]"
              :key="r"
              :class="['rating-option', minRating === r ? 'rating-active' : '']"
              @click="minRating = minRating === r ? 0 : r"
            >
              <span class="rating-stars">
                <span v-for="i in 5" :key="i" :class="i <= r ? 'star-on' : 'star-off'">★</span>
              </span>
              <span class="rating-label">& up</span>
            </button>
          </div>
        </div>

        <button class="clear-btn" @click="clearFilters">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"/>
            <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
          </svg>
          Clear All Filters
        </button>

      </aside>

  <main class="max-canvas bg-[#f7fdf4] px-6 py-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Farms</h1>
        <div class="flex items-center gap-3">
          <input v-model="search" placeholder="Search farms..." class="border rounded-full px-4 py-2" />
          <div class="flex items-center gap-2">
            <button @click="setSort('asc')" :class="sortOrder === 'asc' ? activeSortClass : inactiveSortClass" class="px-3 py-2 rounded">A→Z</button>
            <button @click="setSort('desc')" :class="sortOrder === 'desc' ? activeSortClass : inactiveSortClass" class="px-3 py-2 rounded">Z→A</button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-if="filtered.length === 0" class="text-gray-600">No farms match your filters.</div>
        <div v-for="farm in filtered" :key="farm.id" class="bg-white rounded-md p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <img :src="farm.image" alt="" class="w-full h-40 object-cover rounded-md mb-3" />
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-lg font-bold">{{ farm.name }}</h3>
              <div class="text-sm text-gray-500">{{ farm.province }}</div>
            </div>
            <div class="text-sm text-gray-700">{{ farm.rating.toFixed(1) }}</div>
          </div>
          <div class="mt-2 flex items-center gap-1 text-yellow-500">
            <template v-for="n in 5">
              <svg v-if="n <= Math.round(farm.rating)" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.84-.197-1.54-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.05 9.401c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z"/></svg>
              <svg v-else class="w-4 h-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.974c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.84-.197-1.54-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.05 9.401c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z"/></svg>
            </template>
          </div>

          <p class="text-gray-600 mt-3">{{ farm.description }}</p>

          <div class="mt-4 text-right">
            <NuxtLink :to="`/user/farm/${farm.id}`" class="inline-block px-3 py-2 bg-[#1f7a2e] text-white rounded uppercase text-xs">View</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </main>
  </div>
  <AppFooter />
</template>

<script setup>
import { ref, computed } from 'vue'

import AppHeader from '~/components/common/AppHeader.vue'
import AppFooter from '~/components/common/AppFooter.vue'

const search = ref('')
const sortOrder = ref('asc')
const province = ref('All')
const allCategories = ['Kampong Cham', 'Kandal', 'Ta Keo']
const minRating = ref(0)

const activeSortClass = 'bg-[#1f7a2e] text-white'
const inactiveSortClass = 'bg-white text-gray-700 border'

function setSort(o) { sortOrder.value = o }

const clearFilters = () => {
  province.value = 'All'
  minRating.value = 0
  sortOrder.value = 'asc'
}

const farms = ref([
  { id: 'f1', name: 'Green Valley Farm', rating: 4.6, province: 'Kampong Cham', description: 'Family-run vegetable farm.', image: '/assets/images/farm1.png' },
  { id: 'f2', name: 'Kandal Orchards', rating: 4.2, province: 'Kandal', description: 'Fruit orchard specialising in mangoes.', image: '/assets/images/farm2.png' },
  { id: 'f3', name: 'Ta Keo Hydroponics', rating: 3.9, province: 'Ta Keo', description: 'Modern greenhouse operations.', image: '/assets/images/farm3.png' },
  { id: 'f4', name: 'Cham River Farm', rating: 4.8, province: 'Kampong Cham', description: 'Organic vegetable plots near the river.', image: '/assets/images/farm1.png' },
  { id: 'f5', name: 'Kandal Fresh', rating: 3.5, province: 'Kandal', description: 'Mixed produce and local deliveries.', image: '/assets/images/farm2.png' },
  { id: 'f6', name: 'Ta Keo Greens', rating: 4.0, province: 'Ta Keo', description: 'Specialises in salad greens and herbs.', image: '/assets/images/farm3.png' }
])

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  let list = farms.value.filter(f => {
    if (province.value !== 'All' && f.province !== province.value) return false
    if (f.rating < minRating.value) return false
    if (!q) return true
    return f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
  })

  list.sort((a, b) => {
    return sortOrder.value === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  })

  return list
})
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background: #f4f4ee;
  font-family: 'Inter', sans-serif;
  padding-top: 18px;
}

.promo-banner {
  position: relative;
  width: 94%;
  height: 60vh;
  min-height: 280px;
  background-image: url('/images/farm-banner.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  padding-bottom: 60px;
  margin: auto;
  border-radius: 25px;
  overflow: hidden;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(10, 30, 16, 0.82) 0%,
    rgba(10, 30, 16, 0.50) 50%,
    rgba(10, 30, 16, 0.25) 100%
  );
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 560px;
  padding: 36px 48px;
}

.banner-pill {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(6px);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #c8e6c9;
}

.banner-content h1 {
  margin: 12px 0 0;
  font-size: clamp(26px, 3.5vw, 38px);
  font-weight: 800;
  line-height: 1.05;
  color: #f8faf5;
}

.banner-content p {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.45;
  color: #d4e4d6;
  max-width: 420px;
}

.products-layout {
  display: flex;
  gap: 24px;
  width: 100%;
  /* padding: 28px 32px 48px; */
}

.filter-sidebar {
  width: 330px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(200, 210, 200, 0.4);
  border-radius: 12px;
  padding: 24px 22px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filter-select {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #c2c9bb;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  color: #1b1c1a;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2342493e' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.filter-select:focus {
  border-color: #2e7e3f;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #42493e;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1.5px solid #c2c9bb;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  color: #42493e;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip:hover {
  border-color: #2e7e3f;
  color: #2e7e3f;
}

.chip-active {
  background: linear-gradient(135deg, #2e7e3f, #1f6130);
  color: #fff;
  border-color: transparent;
}

.rating-filters {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rating-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.rating-option:hover {
  background: rgba(46, 126, 63, 0.06);
}

.rating-active {
  background: rgba(46, 126, 63, 0.10);
}

.rating-stars {
  font-size: 16px;
  display: flex;
  gap: 1px;
}

.star-on {
  color: #f59e0b;
}

.star-off {
  color: #d1d5db;
}

.rating-label {
  font-size: 16px;
  color: #6b7280;
}


.price-slider-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
  border-radius: 999px;
  background: linear-gradient(to right, #2e7e3f 0%, #2e7e3f calc(var(--val, 100) * 1%), #e5e7eb calc(var(--val, 100) * 1%), #e5e7eb 100%);
  outline: none;
  cursor: pointer;
}

.price-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #2e7e3f;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.price-slider::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 6px rgba(46, 126, 63, 0.12);
}

.price-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #2e7e3f;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  cursor: pointer;
}

.price-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #6b7280;
}

.price-current {
  font-weight: 700;
  color: #1f6a35;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  border: 1.5px solid #c2c9bb;
  border-radius: 8px;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  color: #42493e;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  border-color: #b91c1c;
  color: #b91c1c;
  background: #fef2f2;
}

.products-main {
  flex: 1;
  min-width: 0;
}
.results-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.results-count {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.results-count strong {
  color: #1b1c1a;
  font-weight: 700;
}

.sort-select {
  padding: 7px 12px;
  border: 1.5px solid #c2c9bb;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  font-weight: 500;
  color: #42493e;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
  margin-right: 18px;
}

.sort-select:focus {
  border-color: #2e7e3f;
}

/* PRODUCT GRID */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

/* EMPTY STATE */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 20px;
  text-align: center;
}

.empty-state p {
  margin: 0;
  font-size: 15px;
  color: #6b7280;
}

/* ──────────────── RESPONSIVE ──────────────── */
@media (max-width: 900px) {
  .products-layout {
    flex-direction: column;
  }

  .filter-sidebar {
    width: 100%;
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }

  .filter-section {
    flex: 1;
    min-width: 180px;
  }

  .rating-filters {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .products-layout {
    padding: 16px 14px 36px;
  }

  .banner-content {
    padding: 24px 20px;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .filter-sidebar {
    padding: 14px;
  }
}
</style>
