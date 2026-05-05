<template>
  <AppHeader />

  <div class="min-h-screen bg-[#eef6ea] flex">

    <!-- ================= LEFT FILTER ================= -->
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

      <h2 class="font-bold text-lg mb-2">REVIEW</h2>
      <div class="mb-6 text-green-500">★★★★★</div>

      <h2 class="font-bold text-lg mb-2">PRICE RANGE</h2>
      <input
        type="range"
        min="0"
        max="100"
        v-model="price"
        class="w-full"
      />
      <p class="text-sm mt-1">Max: ${{ price }}</p>
    </aside>

    <!-- ================= PRODUCT GRID ================= -->
    <main class="flex-1 p-6">

      <div class="grid grid-cols-4 gap-6">

        <NuxtLink
          v-for="product in filteredProducts"
          :key="product.id"
          :to="`/user/products/${product.id}`"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition cursor-pointer"
        >
          <img :src="product.image" alt="product.name" class="w-full h-40 object-cover" />
          <div class="p-3">
            <p class="text-xs text-green-600 font-semibold">
              {{ product.category }}
            </p>

            <h3 class="font-bold">{{ product.name }}</h3>

            <div class="flex justify-between items-center mt-2">
              <p class="text-green-700 font-bold">${{ product.price }}</p>

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
import { ref, computed } from "vue"

/* ================= FILTER STATE ================= */
const selectedCategories = ref([])
const price = ref(100)

/* ================= SAMPLE PRODUCTS ================= */
const products = ref([
  {
    id: 1,
    name: "Fresh Green Beans",
    category: "Vegetable",
    price: 4.5,
    image: "/images/beans.jpg"
  },
  {
    id: 2,
    name: "Fresh Broccoli",
    category: "Vegetable",
    price: 3.75,
    image: "/images/broccoli.jpg"
  },
  {
    id: 3,
    name: "Fresh Bell Peppers",
    category: "Vegetable",
    price: 2.1,
    image: "/images/pepper.jpg"
  },
  {
    id: 4,
    name: "Fresh Cucumbers",
    category: "Vegetable",
    price: 2.5,
    image: "/images/cucumber.jpg"
  },
  {
    id: 5,
    name: "Fresh Grapes",
    category: "Fruit",
    price: 5.5,
    image: "/images/grape.jpg"
  },
  {
    id: 6,
    name: "Fresh Apples",
    category: "Fruit",
    price: 3.99,
    image: "/images/apple.jpg"
  },
  {
    id: 7,
    name: "Fresh Oranges",
    category: "Fruit",
    price: 4.2,
    image: "/images/orange.jpg"
  },
  {
    id: 8,
    name: "Fresh Bananas",
    category: "Fruit",
    price: 2.8,
    image: "/images/bananas.jpg"
  },
  {
    id: 9,
    name: "Organic Tomatoes",
    category: "Organic",
    price: 5.2,
    image: "/images/tomatoes.jpg"
  },
  {
    id: 10,
    name: "Organic Cabbage",
    category: "Organic",
    price: 3.5,
    image: "/images/cabbage.jpg"
  },
  {
    id: 11,
    name: "Organic Lettuce",
    category: "Organic",
    price: 4.0,
    image: "/images/lettuce.jpg"
  },
  {
    id: 12,
    name: "Heirloom Carrots",
    category: "Organic",
    price: 4.95,
    image: "/images/carrot.jpg"
  }
])

/* ================= FILTER LOGIC ================= */
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    
    const matchCategory =
      selectedCategories.value.length === 0 ||
      selectedCategories.value.includes(p.category)

    const matchPrice = p.price <= price.value

    return matchCategory && matchPrice
  })
})
</script>