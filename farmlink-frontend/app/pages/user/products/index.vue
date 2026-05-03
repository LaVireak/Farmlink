<template>
  <div class="bg-[#f6f8f3] min-h-screen flex flex-col">

    <!-- HEADER -->
    <header class="flex justify-between items-center p-6 bg-white shadow">
      <div class="flex items-center gap-3">
        <!-- <img src="/images/logo.png" alt="FarmLink Logo" class="h-10" /> -->
        <nav class="hidden md:flex gap-6 text-gray-700 font-medium">
          <a href="#">Home</a>
          <a href="#">Products</a>
          <a href="#">Farmers</a>
          <a href="#">About</a>
        </nav>
      </div>
      <div class="flex items-center gap-4">
        <input type="text" placeholder="Search..." class="border rounded-full px-4 py-1 text-sm" />
        <button><i class="fas fa-shopping-cart"></i></button>
        <button><i class="fas fa-user"></i></button>
      </div>
    </header>

    <!-- HERO -->
    <section class="relative text-center text-white">
      <img src="/images/farm-banner.jpg" class="w-full h-72 object-cover" />
      <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
        <h1 class="text-4xl font-bold">Connecting You Directly to Local Farms</h1>
        <p class="mt-2">Shop fresh produce directly from farmers</p>
        <div class="mt-4 flex gap-4">
          <button class="bg-green-600 px-6 py-2 rounded-full hover:bg-green-700">Explore Fresh Foods</button>
          <button class="bg-white text-green-700 px-6 py-2 rounded-full hover:bg-gray-100">Meet the Farmers</button>
        </div>
        <span class="mt-4 bg-green-600 px-3 py-1 rounded-full text-sm">100% Locally Sourced</span>
      </div>
    </section>

    <!-- WHY CHOOSE -->
    <section class="py-12 text-center">
      <h2 class="text-2xl font-bold mb-6">Why Choose FarmLink?</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
        <div class="bg-white p-6 rounded-xl shadow">
          <i class="fas fa-leaf text-green-600 text-2xl"></i>
          <p class="mt-2 font-semibold">Farm Fresh Produce</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow">
          <i class="fas fa-truck text-green-600 text-2xl"></i>
          <p class="mt-2 font-semibold">Fast Delivery</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow">
          <i class="fas fa-handshake text-green-600 text-2xl"></i>
          <p class="mt-2 font-semibold">Support Farmers</p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow">
          <i class="fas fa-check-circle text-green-600 text-2xl"></i>
          <p class="mt-2 font-semibold">Quality Guaranteed</p>
        </div>
      </div>
    </section>

    <!-- PRODUCT GRID -->
    <section class="flex-1 px-10">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold">Browse Our Products</h1>
        <p class="text-gray-600 mt-2">Fresh items directly from local farms</p>
      </div>

      <!-- FILTER -->
      <div class="flex justify-center gap-3 mb-8">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          :class="[
            'px-4 py-2 rounded-full text-sm transition cursor-pointer',
            selectedCategory === cat
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <!-- GRID -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-transform hover:-translate-y-1"
          @click="goToProduct(product.id)"
        >
          <img :src="product.image" class="w-full h-44 object-cover rounded-t-2xl" />
          <div class="p-4 text-center">
            <h3 class="font-semibold text-lg">{{ product.name }}</h3>
            <p class="text-green-600 font-bold my-2">${{ product.price.toFixed(2) }}</p>
            <button
              @click="addToCart(product)"
              class="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>

 <!-- NEWSLETTER -->
<section class="bg-green-100 py-12 mt-12">
  <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center px-6 gap-8">
    
    <!-- LEFT CONTENT -->
    <div class="flex-1 text-center md:text-left">
      <h2 class="text-2xl font-bold">Stay Rooted</h2>
      <p class="mt-2 text-gray-700">
        Subscribe to our newsletter for updates
      </p>

      <div class="mt-4 flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
        <input
          type="email"
          placeholder="Enter your email"
          class="px-4 py-2 rounded-full border w-64"
        />
        <button class="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition">
          Subscribe
        </button>
      </div>
    </div>

    <!-- RIGHT IMAGE -->
<div class="flex-1 flex justify-center md:justify-end">
  <img
    src="/images/farmer.jpg"
    alt="Farmer"
    class="max-h-64 w-auto object-contain drop-shadow-lg rounded-lg"
  />
</div>

  </div>
</section>

    <!-- FOOTER -->
    <footer class="bg-white py-8 mt-12 border-t">
      <div class="flex flex-col md:flex-row justify-between items-center px-10 gap-6">
        <div class="flex gap-6 text-gray-600">
          <a href="#">Support</a>
          <a href="#">Account</a>
          <a href="#">Contact</a>
        </div>
        <!-- <div>
          <img src="/images/qr.png" alt="App QR Code" class="h-24" />
        </div> -->
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const categories = ['All Products', 'Vegetables', 'Fruits']
const selectedCategory = ref('All Products')

const products = ref([
  { id: 1, name: 'Fresh Green Beans', price: 4.00, category: 'Vegetables', image: '/images/beans.jpg' },
  { id: 2, name: 'Fresh Broccoli', price: 3.75, category: 'Vegetables', image: '/images/broccoli.jpg' },
  { id: 3, name: 'Fresh Bell Peppers', price: 2.10, category: 'Vegetables', image: '/images/pepper.jpg' },
  { id: 4, name: 'Heirloom Garden Carrots', price: 4.95, category: 'Vegetables', image: '/images/carrot.jpg' },
  { id: 5, name: 'Organic Oranges', price: 5.20, category: 'Fruits', image: '/images/orange.jpg' },
  { id: 6, name: 'Honeycrisp Apples', price: 4.40, category: 'Fruits', image: '/images/apple.jpg' },
  { id: 7, name: 'Fresh Grapes', price: 7.80, category: 'Fruits', image: '/images/grape.jpg' },
  { id: 8, name: 'Fresh Dragon Fruit', price: 6.50, category: 'Fruits', image: '/images/dragon.jpg' }
])

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'All Products') return products.value
  return products.value.filter(p => p.category === selectedCategory.value)
})

const addToCart = (product) => {
  alert(`${product.name} added to cart!`)
}
const goToProduct = (id) => {
  router.push(`/user/products/${id}`)
}
</script>
