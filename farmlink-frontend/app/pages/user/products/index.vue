<template>
  <CommonAppHeader />

  <div class="products-page">
    <!-- Banner -->
    <section class="promo-banner">
      <div class="banner-overlay"></div>

      <div class="banner-content">
        <span class="banner-pill">
          <span class="material-symbols-outlined icon-spin-eco">eco</span>
          Fresh Picks
        </span>
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
          <h3 class="filter-title">Search</h3>
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search products..."
              class="filter-input"
            />
            <button 
              v-if="searchQuery" 
              @click="searchQuery = ''" 
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              type="button"
            >
              ✕
            </button>
          </div>
        </div>

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
    const res = await $fetch('http://localhost:3001/products', {
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
const handleAddToCart = (product) => {
  console.log('Added to cart:', product)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');

.products-page {
  min-height: 100vh;
  background-color: #FFFDF4;
  color: #132a13;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  padding: 0 16px;
  max-width: 1820px;
  margin: 0 auto;
}

.promo-banner {
  position: relative;
  width: 100%;
  height: 48vh;
  min-height: 320px;
  background-image: url('https://images.unsplash.com/photo-1610348725531-843dff14c9da?auto=format&fit=crop&w=2000&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  margin: 20px auto 0 auto;
  border-radius: 0px 30px 0px 30px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(13, 40, 24, 0.03);
  animation: bannerFade 1.2s ease-in-out both;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, #FFFDF4 45%, rgba(255, 255, 255, 0.7) 65%, rgba(255, 255, 255, 0.15) 85%, rgba(255, 255, 255, 0) 100%);
  z-index: 1;
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
  padding: clamp(30px, 5vw, 60px);
  color: #132a13;
  animation: contentFadeIn 1.5s ease-in-out 0.3s both;
}

.banner-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 999px;
  background: rgba(45, 106, 79, 0.08);
  border: 1px solid rgba(45, 106, 79, 0.15);
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #2d6a4f;
}

.icon-spin-eco {
  animation: spin 20s linear infinite;
  font-size: 1.1rem !important;
}

@keyframes spin { to { transform: rotate(360deg); } }

.banner-content h1 {
  margin: 16px 0 0;
  font-family: 'Manrope', sans-serif;
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  font-weight: 900;
  line-height: 1.1;
  color: #132a13;
  letter-spacing: -0.02em;
}

.banner-content p {
  margin: 16px 0 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #44554b;
  max-width: 480px;
}

.products-layout {
  display: flex;
  gap: 40px;
  width: 100%;
  margin-top: 20px;
}

.filter-sidebar {
  width: 320px;
  flex-shrink: 0;
  position: sticky;
  top: 24px;
  align-self: flex-start;
  background: #ffffff;
  border: 1px solid rgba(19, 42, 19, 0.08);
  border-radius: 24px;
  padding: 30px 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  box-shadow: 0 10px 30px rgba(13, 40, 24, 0.02);
  animation: slideInLeft 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.1s both;
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-title {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 0.72rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #2d6a4f;
  border-left: 3px solid #2d6a4f;
  padding-left: 8px;
  line-height: 1.1;
}

.filter-input, .filter-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(19, 42, 19, 0.12);
  border-radius: 12px;
  background: #fff;
  font-size: 0.85rem;
  font-weight: 500;
  color: #132a13;
  outline: none;
  transition: all 0.25s ease;
}

.filter-input:focus, .filter-select:focus {
  border-color: #2d6a4f;
  box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.08);
}

.filter-select {
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%232d6a4f' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
}

.rating-filters {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rating-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rating-option:hover {
  background: rgba(45, 106, 79, 0.04);
}

.rating-active {
  background: rgba(45, 106, 79, 0.08);
  border-color: rgba(45, 106, 79, 0.12);
}

.rating-stars {
  font-size: 0.85rem;
  display: flex;
  gap: 2px;
}

.star-on {
  color: #f59e0b;
}

.star-off {
  color: #d1d5db;
}

.rating-label {
  font-size: 0.78rem;
  color: #5c6f5c;
  font-weight: 600;
}

.price-slider-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.price-value {
  font-size: 0.85rem;
}

.price-current {
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  color: #2d6a4f;
}

.price-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(to right, #2d6a4f 0%, #2d6a4f calc(var(--val, 100) * 1%), #e9f5db calc(var(--val, 100) * 1%), #e9f5db 100%);
  outline: none;
  cursor: pointer;
}

.price-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  border: 3.5px solid #2d6a4f;
  box-shadow: 0 2px 6px rgba(45, 106, 79, 0.15);
  cursor: pointer;
  transition: all 0.25s ease;
}

.price-slider::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 6px rgba(45, 106, 79, 0.15);
}

.price-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: #5c6f5c;
  font-weight: 500;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid rgba(19, 42, 19, 0.1);
  border-radius: 12px;
  background: transparent;
  font-family: 'Manrope', sans-serif;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #42493e;
  cursor: pointer;
  transition: all 0.25s ease;
}

.clear-btn:hover {
  border-color: #b91c1c;
  color: #b91c1c;
  background: #fef2f2;
}

.products-main {
  flex: 1;
  min-width: 0;
  animation: slideInUp 0.8s cubic-bezier(0.25, 1, 0.5, 1) 0.2s both;
}

.results-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.results-count {
  margin: 0;
  font-size: 0.8rem;
  color: #5c6f5c;
}

.results-count strong {
  color: #132a13;
  font-weight: 700;
}

.sort-select {
  padding: 8px 14px;
  border: 1px solid rgba(19, 42, 19, 0.1);
  border-radius: 10px;
  background: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  color: #42493e;
  cursor: pointer;
  outline: none;
  transition: all 0.25s ease;
}

.sort-select:focus {
  border-color: #2d6a4f;
}

/* PRODUCT GRID */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.product-grid > * {
  animation: bounceFlip 1.1s cubic-bezier(0.25, 1.1, 0.5, 1) both;
}

.product-grid > *:nth-child(1) { animation-delay: 0.3s; }
.product-grid > *:nth-child(2) { animation-delay: 0.4s; }
.product-grid > *:nth-child(3) { animation-delay: 0.5s; }
.product-grid > *:nth-child(4) { animation-delay: 0.6s; }
.product-grid > *:nth-child(5) { animation-delay: 0.7s; }
.product-grid > *:nth-child(6) { animation-delay: 0.8s; }
.product-grid > *:nth-child(7) { animation-delay: 0.9s; }
.product-grid > *:nth-child(8) { animation-delay: 1.0s; }

/* EMPTY STATE */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 20px;
  text-align: center;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
  color: #5c6f5c;
}

/* ──────────────── RESPONSIVE ──────────────── */
@media (max-width: 1400px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .products-layout {
    flex-direction: column;
    gap: 32px;
  }

  .filter-sidebar {
    width: 100%;
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px;
    padding: 24px;
  }

  .filter-section {
    flex: 1;
    min-width: 220px;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 680px) {
  .filter-sidebar {
    flex-direction: column;
  }

  .product-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .banner-content {
    padding: 32px 24px;
  }
}

@keyframes bannerFade {
  from { opacity: 0; transform: translateY(-16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-24px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounceFlip {
  from {
    opacity: 0;
    transform: perspective(600px) rotateX(-12deg) translateY(24px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: perspective(600px) rotateX(0) translateY(0) scale(1);
  }
}

@keyframes contentFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>