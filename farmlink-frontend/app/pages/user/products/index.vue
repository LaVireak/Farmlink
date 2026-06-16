<template>
  <CommonAppHeader />

  <div class="products-page">
    <!-- Banner -->
    <section class="promo-banner">
      <div class="banner-overlay"></div>

      <div class="banner-content">
        <span class="banner-pill">🌿 FRESH PICKS</span>
        <h1>Farm Fresh Produce</h1>
        <p>
          Harvested daily from local Cambodian farms — delivered straight to
          your table.
        </p>
      </div>
    </section>

    <!-- Intro -->
    <section class="py-8 px-4">
      <div class="text-center">
        <h1 class="text-3xl font-bold">Browse Our Products</h1>
        <p class="text-gray-600 mt-2">
          Fresh items directly from local farms
        </p>
      </div>
      </section>
    <div class="products-layout ps-6 py-12">
      <!-- Sidebar -->
      <aside class="filter-sidebar">
        <!-- Category -->

        <div class="filter-section">
          <h3 class="filter-title">Category</h3>

          <select v-model="selectedCategory" class="filter-select">
            <option value="All">All Categories</option>

            <option
              v-for="cat in allCategories"
              :key="cat"
              :value="cat"
            >
              {{ cat }}
            </option>
          </select>
        </div>

        <!-- Rating -->
        <div class="filter-section">
          <h3 class="filter-title">Rating</h3>

          <div class="rating-filters">
            <button
              v-for="r in [5,4,3,2,1]"
              :key="r"
              :class="[
                'rating-option',
                minRating === r ? 'rating-active' : ''
              ]"
              @click="minRating = minRating === r ? 0 : r"
            >
              <span class="rating-stars">
                <span
                  v-for="i in 5"
                  :key="i"
                  :class="i <= r ? 'star-on' : 'star-off'"
                >
                  ★
                </span>
              </span>

              <span class="rating-label">& up</span>
            </button>
          </div>
        </div>

        <!-- Price -->
        <div class="filter-section">
          <h3 class="filter-title">Price Range</h3>

          <div class="price-slider-wrap">
            <div class="price-value">
              <span class="price-current">
                ${{ price }}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="300"
              v-model="price"
              class="price-slider"
              :style="{ '--val': (price / 300) * 100 }"
            />

            <div class="price-labels">
              <span>$0</span>
              <span>$150</span>
              <span>$300</span>
            </div>
          </div>
        </div>

        <!-- Clear -->
        <button class="clear-btn" @click="clearFilters">
          Clear All Filters
        </button>
      </aside>

      <!-- Products -->
      <main class="products-main">
        <div class="results-bar">
          <p class="results-count">
            Showing
            <strong>{{ filteredProducts.length }}</strong>
            products
          </p>

          <select v-model="sortBy" class="sort-select">
            <option value="default">Sort by: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="empty-state">
          <p>Loading products...</p>
        </div>

        <!-- Product Grid -->
        <div v-else class="product-grid">
          <NuxtLink
            v-for="product in sortedProducts"
            :key="product.id"
            :to="`/user/products/${product.id}`"
            class="product-link"
          >
            <UserProductCard
              :product="product"
              @add-to-cart="handleAddToCart"
            />
          </NuxtLink>
        </div>

        <div v-if="!loading && filteredProducts.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
          <p class="text-lg font-semibold text-gray-700 mt-2">No products found matching your search</p>
          <p class="text-sm text-gray-500">Try adjusting your filters or search keywords.</p>
        </div>
      </main>
    </div>
  </div>

  <CommonAppFooter />
</template>

<script setup>
import CommonAppHeader from '~/components/common/AppHeader.vue'
import CommonAppFooter from '~/components/common/AppFooter.vue'
import UserProductCard from '~/components/user/UserProductCard.vue'
import { useCart } from '~/composables/useCart'

import { useAuthStore } from '~/stores/auth.store'

const authStore = useAuthStore()
import { ref, computed, onMounted, watch } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const config = useRuntimeConfig()

// ================= STATE =================
const selectedCategory = ref('All')
const price = ref(300)
const minRating = ref(0)
const sortBy = ref('default')
const loading = ref(false)
const searchQuery = ref(route.query.search || '')

const products = ref([])
const allCategories = ref([])

// ================= FETCH PRODUCTS =================
const fetchProducts = async () => {
  loading.value = true

  try {
    const res = await $fetch(`${config.public.apiUrl}/products`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`
      }
    })

    products.value = Array.isArray(res) ? res : []

    allCategories.value = [
      ...new Set(products.value.map((p) => p.category))
    ]

  } catch (err) {
    console.error('Failed to fetch products:', err)
    products.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)

// ================= CLEAR FILTERS =================
const fetchCategories = async () => {
  try {
    if (products.value.length > 0) {
      allCategories.value = [...new Set(products.value.map(p => p.category).filter(Boolean))]
    }
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
}

// Watch for route search param changes (e.g. from header search)
watch(() => route.query.search, (newVal) => {
  searchQuery.value = newVal || ''
})

// Sync search query changes to URL route
watch(searchQuery, (newVal) => {
  const query = { ...route.query }
  if (newVal) {
    query.search = newVal
  } else {
    delete query.search
  }
  navigateTo({ path: route.path, query })
})

const clearFilters = () => {
  selectedCategory.value = 'All'
  price.value = 300
  minRating.value = 0
  sortBy.value = 'default'
  searchQuery.value = ''
  navigateTo('/user/products')
}

// ================= FILTER =================
const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchCategory =
      selectedCategory.value === 'All' ||
      p.category === selectedCategory.value

    const effectivePrice = p.discount
      ? p.price * (1 - p.discount / 100)
      : p.price

    const matchPrice = effectivePrice <= price.value
    const matchRating = (p.rating || 0) >= minRating.value
    
    const query = searchQuery.value.trim().toLowerCase()
    const matchSearch = !query || 
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query)) ||
      (p.description && p.description.toLowerCase().includes(query))

    return matchCategory && matchPrice && matchRating && matchSearch
  })
})

// ================= SORT =================
const sortedProducts = computed(() => {
  const arr = [...filteredProducts.value]

  switch (sortBy.value) {
    case 'price-low':
      return arr.sort((a, b) => {
        const aPrice = a.discount
          ? a.price * (1 - a.discount / 100)
          : a.price

        const bPrice = b.discount
          ? b.price * (1 - b.discount / 100)
          : b.price

        return aPrice - bPrice
      })

    case 'price-high':
      return arr.sort((a, b) => {
        const aPrice = a.discount
          ? a.price * (1 - a.discount / 100)
          : a.price

        const bPrice = b.discount
          ? b.price * (1 - b.discount / 100)
          : b.price

        return bPrice - aPrice
      })

    case 'rating':
      return arr.sort(
        (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
      )

    case 'name':
      return arr.sort((a, b) =>
        a.name.localeCompare(b.name)
      )

    default:
      return arr
  }
})

// ================= CART =================
const { addToCart } = useCart()

const handleAddToCart = (product, event) => {
  addToCart(product, 1, event)
}
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