<template>
  <AppHeader />

  <div class="min-h-screen bg-[#eef6ea] flex">

    <!-- Sidebar -->
    <aside class="w-64 bg-white p-5 shadow-md rounded-xl m-4 h-fit">
      <h2 class="font-bold text-lg mb-4">CATEGORY</h2>

      <div class="space-y-2 mb-6">
        <label class="flex items-center gap-2">
          <input type="checkbox" value="Organic" v-model="selectedCategories" />
          Organic
        </label>

        <label class="flex items-center gap-2">
          <input type="checkbox" value="Fruit" v-model="selectedCategories" />
          Fruit
        </label>

        <label class="flex items-center gap-2">
          <input type="checkbox" value="Vegetable" v-model="selectedCategories" />
          Vegetable
        </label>
      </div>

      <h2 class="font-bold text-lg mb-2">PRICE RANGE</h2>
      <input type="range" min="0" max="100" v-model="price" class="w-full" />
      <p class="text-sm mt-1">Max: ${{ price }}</p>
    </aside>

    <!-- Product Grid -->
    <main class="flex-1 p-6">
      <div class="grid grid-cols-4 gap-6">

        <NuxtLink
          v-for="product in products"
          :key="product.id"
          :to="`/user/products/${product.id}`"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition"
        >
          <img :src="product.image" class="w-full h-40 object-cover" />

          <div class="p-3">
            <p class="text-xs text-green-600 font-semibold">
              {{ product.category }}
            </p>

            <h3 class="font-bold">{{ product.name }}</h3>

            <div class="flex justify-between mt-2">
              <p class="text-green-700 font-bold">
                ${{ product.price }}
              </p>
              <button class="bg-green-600 text-white w-7 h-7 rounded-full">
                +
              </button>
            </div>
          </div>
        </NuxtLink>

      </div>
    </main>
  </div>

  <AppFooter />
</template>

<script setup>
import AppHeader from '~/components/common/AppHeader.vue'
import AppFooter from '~/components/common/AppFooter.vue'
import { ref, watch, onMounted } from "vue"

// state
const selectedCategories = ref([])
const price = ref(100)
const products = ref([])

// ✅ FIXED BACKEND URL (IMPORTANT)
const API_URL = "http://localhost:3001/api/products"

// fetch function
const fetchProducts = async () => {
  try {
    const categoryQuery = selectedCategories.value.length
      ? selectedCategories.value.join(',')
      : ''

    const url = `${API_URL}?category=${categoryQuery}&maxPrice=${price.value}`

    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    products.value = await res.json()
  } catch (err) {
    console.error("Fetch error:", err)
  }
}

// initial load
onMounted(fetchProducts)

// re-fetch when filters change
watch([selectedCategories, price], fetchProducts)
</script>