<template>
  <div class="min-h-screen" style="background-color: #fbf9f6;">
    <!-- Header Component -->
    <AppHeader />

    <!-- Hero Section with Background -->
    <div class="relative h-64 md:h-80 overflow-hidden" style="background: linear-gradient(135deg, #2e7e3f, #1f6130);">
      <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="0,0 100,0 100,100 0,100" fill="url(#grad)"/>
        </svg>
      </div>
    </div>

    <!-- Main Content -->
    <main class="relative -mt-32 px-4 md:px-8 pb-20">
      <div class="max-w-7xl mx-auto">
        
        <!-- Profile Card -->
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 mb-12">
          <div class="p-8 md:p-12">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <!-- Profile Image -->
              <div class="flex justify-center md:col-span-1">
                <div class="relative group">
                  <div class="absolute inset-0 rounded-full blur-2xl group-hover:blur-3xl opacity-40 group-hover:opacity-60 transition-all duration-300" style="background: linear-gradient(135deg, #2e7e3f, #1f6130);"></div>
                  <div class="relative w-48 h-48 rounded-full border-4 overflow-hidden shadow-xl" style="border-color: #2a6d3b;">
                    <img src="https://via.placeholder.com/300" alt="Sokha" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <!-- Profile Info -->
              <div class="md:col-span-2">
                <div class="mb-4">
                  <h2 class="text-5xl md:text-6xl font-bold mb-3" style="color: #154212;">Sokha</h2>
                  <p class="text-lg leading-relaxed max-w-xl" style="color: #42493e;">
                    Specializing in organic, pesticide-free vegetables. Growing fresh produce with love in Battambang for over 10 years.
                  </p>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
                  <div class="text-center">
                    <div class="text-3xl font-bold" style="color: #2a6d3b;">10+</div>
                    <p class="text-sm" style="color: #72796e;">Years Experience</p>
                  </div>
                  <div class="text-center">
                    <div class="flex items-center justify-center gap-1">
                      <span class="text-3xl font-bold" style="color: #ffc107;">★ 4.8</span>
                    </div>
                    <p class="text-sm" style="color: #72796e;">Rating (245 reviews)</p>
                  </div>
                  <div class="text-center">
                    <div class="text-3xl font-bold" style="color: #2a6d3b;">892+</div>
                    <p class="text-sm" style="color: #72796e;">Products Sold</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-4 mt-10 pt-8 border-t border-gray-200">
              <button class="px-8 py-3 text-white rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg" style="background: linear-gradient(135deg, #2e7e3f, #1f6130);">
                Follow Farm
              </button>
              <button class="px-8 py-3 text-white rounded-full font-bold transition-all duration-300 border-2" style="background-color: #d5f3cf; border-color: #2a6d3b; color: #154212;">
                Message Farmer
              </button>
              <button class="px-8 py-3 text-white rounded-full font-bold transition-all duration-300 border-2" style="background-color: #d5f3cf; border-color: #2a6d3b; color: #154212;">
                View Reviews
              </button>
            </div>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Left Column: Products -->
          <div class="lg:col-span-2">
            <!-- Products Section -->
            <div class="mb-12">
              <div class="flex items-center justify-between mb-8">
                <h3 class="text-3xl font-bold" style="color: #154212;">Currently Selling</h3>
                <a href="#" class="transition-colors font-semibold" style="color: #2a6d3b;">View All →</a>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
                <!-- Loading State -->
                <div v-if="loading" class="col-span-full text-center py-12">
                  <p style="color: #72796e;">Loading products...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="col-span-full text-center py-12">
                  <p style="color: #b42318;">{{ error }}</p>
                </div>

                <!-- Empty State -->
                <div v-else-if="products.length === 0" class="col-span-full text-center py-12">
                  <p style="color: #72796e;">No products available</p>
                </div>

                <!-- Products Grid -->
                <div v-for="product in products" :key="product.id" class="group cursor-pointer">
                  <div class="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                    <!-- Product Image -->
                    <div class="relative h-40 md:h-48 overflow-hidden bg-gray-100">
                      <img 
                        :src="product.thumbnailUrl || 'https://via.placeholder.com/300x250'" 
                        :alt="product.nameEn" 
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div v-if="product.isOrganic" class="absolute top-3 right-3 text-gray-900 px-3 py-1 rounded-full text-xs font-bold" style="background-color: #d5f3cf;">
                        Organic
                      </div>
                      <div v-else class="absolute top-3 right-3 text-gray-900 px-3 py-1 rounded-full text-xs font-bold" style="background-color: #d5f3cf;">
                        Fresh
                      </div>
                    </div>

                    <!-- Product Info -->
                    <div class="p-4 md:p-5">
                      <h4 class="font-bold text-sm md:text-base mb-2 group-hover:transition-colors truncate" style="color: #154212;">{{ product.nameEn }}</h4>
                      <p class="font-bold text-base md:text-lg mb-3" style="color: #2a6d3b;">${{ parseFloat(product.pricePerUnit).toFixed(2) }}/{{ product.unit }}</p>
                      
                      <!-- Rating -->
                      <div v-if="product.avgRating" class="flex items-center gap-1 mb-4">
                        <span class="text-yellow-400">★</span>
                        <span class="text-xs" style="color: #72796e;">{{ product.avgRating }} ({{ product.totalSold }})</span>
                      </div>
                      <div v-else class="flex items-center gap-1 mb-4">
                        <span class="text-yellow-400">★</span>
                        <span class="text-xs" style="color: #72796e;">No ratings yet</span>
                      </div>

                      <button 
                        @click="addToCart(product.id)"
                        class="w-full text-white py-2.5 rounded-lg text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-md" 
                        style="background: linear-gradient(135deg, #2e7e3f, #1f6130);"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-8">
                <button 
                  @click="loadPreviousPage" 
                  :disabled="currentPage === 1"
                  class="px-4 py-2 rounded-lg font-bold transition-all duration-300"
                  :style="currentPage === 1 
                    ? 'background-color: #e3e2df; color: #72796e; cursor: not-allowed;' 
                    : 'background: linear-gradient(135deg, #2e7e3f, #1f6130); color: white;'"
                >
                  ← Previous
                </button>
                <span style="color: #72796e;">Page {{ currentPage }} of {{ totalPages }}</span>
                <button 
                  @click="loadNextPage" 
                  :disabled="currentPage === totalPages"
                  class="px-4 py-2 rounded-lg font-bold transition-all duration-300"
                  :style="currentPage === totalPages 
                    ? 'background-color: #e3e2df; color: #72796e; cursor: not-allowed;' 
                    : 'background: linear-gradient(135deg, #2e7e3f, #1f6130); color: white;'"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          <!-- Right Column: Sidebar -->
          <aside class="lg:col-span-1">
            <!-- Origin Card -->
            <div class="bg-white rounded-3xl p-6 shadow-lg border border-gray-200 sticky top-28">
              <h3 class="text-2xl font-bold mb-6" style="color: #154212;">Farm Location</h3>
              
              <!-- Location Image -->
              <div class="rounded-2xl overflow-hidden mb-6 h-56">
                <img src="https://via.placeholder.com/400x350" alt="Battambang" class="w-full h-full object-cover" />
              </div>
              
              <!-- Location Details -->
              <div class="space-y-4">
                <div>
                  <h4 class="text-2xl font-bold mb-1" style="color: #154212;">Battambang Province</h4>
                  <p class="font-semibold text-sm" style="color: #2a6d3b;">📍 Sunrise Organic Fields</p>
                </div>

                <p class="text-sm leading-relaxed" style="color: #42493e;">
                  Known as the rice bowl of Cambodia, our farm benefits from the rich, fertile soil of the region, which is famous for its quality produce.
                </p>

                <!-- Info Grid -->
                <div class="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                  <div class="rounded-lg p-3" style="background-color: #d5f3cf;">
                    <p class="text-xs mb-1" style="color: #42493e;">Climate</p>
                    <p class="font-bold" style="color: #154212;">Tropical</p>
                  </div>
                  <div class="rounded-lg p-3" style="background-color: #d5f3cf;">
                    <p class="text-xs mb-1" style="color: #42493e;">Soil Type</p>
                    <p class="font-bold" style="color: #154212;">Fertile</p>
                  </div>
                  <div class="rounded-lg p-3" style="background-color: #d5f3cf;">
                    <p class="text-xs mb-1" style="color: #42493e;">Farming Method</p>
                    <p class="font-bold" style="color: #154212;">Organic</p>
                  </div>
                  <div class="rounded-lg p-3" style="background-color: #d5f3cf;">
                    <p class="text-xs mb-1" style="color: #42493e;">Farm Size</p>
                    <p class="font-bold" style="color: #154212;">15 hectares</p>
                  </div>
                </div>

                <!-- CTA Button -->
                <button class="w-full font-bold py-3 rounded-lg transition-all duration-300 mt-6 text-white" style="background: linear-gradient(135deg, #2e7e3f, #1f6130);">
                  Visit Farm
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>

    <!-- Footer -->
     <CommonAppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '~/components/common/AppHeader.vue'

const route = useRoute()
const farmerId = route.params.id

// Reactive state
const products = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)

// Farmer data
const farmerData = ref({
  name: 'Sokha',
  image: 'https://via.placeholder.com/300',
  description: 'Specializing in organic, pesticide-free vegetables. Growing fresh produce with love in Battambang for over 10 years.',
  yearsExperience: '10+',
  rating: 4.8,
  totalReviews: 245,
  totalSold: 892,
  province: 'Battambang Province',
  farmName: 'Sunrise Organic Fields',
})

/**
 * Fetch products by farmer ID
 */
async function fetchProducts(page = 1) {
  loading.value = true
  error.value = null

  try {
    const { data } = await useFetch(
      `/api/products/farmer/${farmerId}?page=${page}&limit=6`,
      {
        method: 'GET',
      }
    )

    if (data.value) {
      products.value = data.value.data || []
      currentPage.value = data.value.page
      totalPages.value = data.value.totalPages
    }
  } catch (err) {
    error.value = err.message || 'Failed to fetch products'
    console.error('Error fetching products:', err)
  } finally {
    loading.value = false
  }
}

/**
 * Load next page of products
 */
function loadNextPage() {
  if (currentPage.value < totalPages.value) {
    fetchProducts(currentPage.value + 1)
  }
}

/**
 * Load previous page of products
 */
function loadPreviousPage() {
  if (currentPage.value > 1) {
    fetchProducts(currentPage.value - 1)
  }
}

/**
 * Add product to cart
 */
function addToCart(productId) {
  console.log('Product added to cart:', productId)
  // Implement cart logic here
}

// Fetch products when component mounts
onMounted(() => {
  if (farmerId) {
    fetchProducts(1)
  }
})
</script>

<style scoped>
/* Smooth animations and transitions */
body {
  letter-spacing: -0.01em;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #EFCF4F
}

::-webkit-scrollbar-thumb {
  background: #2a6d3b;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #154212;
}

/* Smooth hover animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

/* Gradient text animation */
@keyframes gradientShift {
  0%, 100% {
    background-size: 200% 200%;
    background-position: 0% 50%;
  }
  50% {
    background-size: 200% 200%;
    background-position: 100% 50%;
  }
}

/* Apply animations */
section {
  animation: slideUp 0.6s ease-out;
}

.group {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>