<template>
  <div class="bg-[#f6f8f3] min-h-screen p-6">

    <!-- BACK -->
    <button @click="$router.back()" class="mb-4 text-green-700 font-medium">
      ← Back
    </button>

    <!-- PRODUCT DETAIL -->
    <div class="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-2xl shadow">

      <!-- LEFT IMAGES -->
      <div>
        <img
          :src="product.image"
          class="w-full h-80 object-cover rounded-2xl"
        />

        <div class="flex gap-4 mt-4">
          <img
            v-for="(img, i) in product.gallery"
            :key="i"
            :src="img"
            class="w-20 h-20 object-cover rounded-xl cursor-pointer border hover:border-green-600"
          />
        </div>
      </div>

      <!-- RIGHT INFO -->
      <div>
        <span class="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
          Best Product
        </span>

        <h1 class="text-3xl font-bold mt-3">
          {{ product.name }}
        </h1>

        <p class="text-green-600 text-xl font-bold mt-2">
          ${{ product.price.toFixed(2) }}
        </p>

        <!-- QUANTITY -->
        <div class="flex items-center gap-4 mt-6">
          <span>Quantity</span>
          <div class="flex items-center border rounded-full px-3 py-1">
            <button @click="decrease">-</button>
            <span class="mx-3">{{ quantity }}</span>
            <button @click="increase">+</button>
          </div>
        </div>

        <!-- ADD TO CART -->
       <button
  @click="addToCart"
  class="mt-6 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-sm"
>
  Add to Cart
</button>

        <!-- FARM INFO -->
        <div class="mt-6 bg-gray-100 p-4 rounded-xl">
          <p class="font-semibold">Sold by</p>
          <p class="text-gray-600">Organic Dreams Farm</p>
        </div>

        <!-- DESCRIPTION -->
        <div class="mt-6">
          <h3 class="font-semibold text-lg">The Harvest Story</h3>
          <p class="text-gray-600 mt-2">
            {{ product.description }}
          </p>
        </div>

      </div>
    </div>

    <!-- REVIEWS -->
    <div class="mt-12">
      <h2 class="text-xl font-bold mb-4">Customer Reviews</h2>

      <div class="grid md:grid-cols-3 gap-4">
        <div
          v-for="review in reviews"
          :key="review.name"
          class="bg-white p-4 rounded-xl shadow"
        >
          <p class="font-semibold">{{ review.name }}</p>
          <p class="text-yellow-500">★★★★★</p>
          <p class="text-gray-600 text-sm mt-2">{{ review.comment }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()

// MOCK DATA (later you can fetch from API)
const products = [
  {
    id: 1,
    name: 'Fresh Green Beans',
    price: 4.00,
    category: 'Vegetables',
    image: '/images/beans.jpg',
    gallery: [
      '/images/beans.jpg',
      '/images/beans2.jpg',
      '/images/beans3.jpg'
    ],
    description:
      'Crisp, organic green beans harvested daily from local farms. Perfect for healthy meals.'
  },
  {
    id: 2,
    name: 'Fresh Broccoli',
    price: 3.75,
    category: 'Vegetables',
    image: '/images/broccoli.jpg',
    gallery: [
      '/images/broccoli.jpg',
      '/images/broccoli2.jpg'
    ],
    description:
      'Fresh broccoli packed with vitamins and nutrients. Great for steaming or stir-fry.'
  },
  {
    id: 3,
    name: 'Fresh Bell Peppers',
    price: 2.10,
    category: 'Vegetables',
    image: '/images/pepper.jpg',
    gallery: [
      '/images/pepper.jpg',
      '/images/pepper2.jpg'
    ],
    description:
      'Colorful bell peppers full of flavor and crunch. Ideal for salads and cooking.'
  },
  {
    id: 4,
    name: 'Heirloom Garden Carrots',
    price: 4.95,
    category: 'Vegetables',
    image: '/images/carrot.jpg',
    gallery: [
      '/images/carrot.jpg',
      '/images/carrot2.jpg'
    ],
    description:
      'Naturally sweet heirloom carrots grown with care. Perfect for snacks and dishes.'
  },
  {
    id: 5,
    name: 'Organic Oranges',
    price: 5.20,
    category: 'Fruits',
    image: '/images/orange.jpg',
    gallery: [
      '/images/orange.jpg',
      '/images/orange2.jpg'
    ],
    description:
      'Juicy organic oranges rich in vitamin C. Refreshing and naturally sweet.'
  },
  {
    id: 6,
    name: 'Honeycrisp Apples',
    price: 4.40,
    category: 'Fruits',
    image: '/images/apple.jpg',
    gallery: [
      '/images/apple.jpg',
      '/images/apple2.jpg'
    ],
    description:
      'Crisp and sweet Honeycrisp apples. Perfect for snacking or baking.'
  },
  {
    id: 7,
    name: 'Fresh Grapes',
    price: 7.80,
    category: 'Fruits',
    image: '/images/grape.jpg',
    gallery: [
      '/images/grape.jpg',
      '/images/grape2.jpg'
    ],
    description:
      'Sweet and juicy grapes freshly picked from local farms.'
  },
  {
    id: 8,
    name: 'Fresh Dragon Fruit',
    price: 6.50,
    category: 'Fruits',
    image: '/images/dragon.jpg',
    gallery: [
      '/images/dragon.jpg',
      '/images/dragon2.jpg'
    ],
    description:
      'Exotic dragon fruit with vibrant color and refreshing taste.'
  }
]

// GET PRODUCT BY ID
const product = products.find(p => p.id == route.params.id)

// QUANTITY
const quantity = ref(1)

const increase = () => quantity.value++
const decrease = () => {
  if (quantity.value > 1) quantity.value--
}

// CART
const addToCart = () => {
  alert(`${product.name} x${quantity.value} added to cart`)
}

// REVIEWS
const reviews = [
  {
    name: 'Alice',
    comment: 'Very fresh and tasty!'
  },
  {
    name: 'John',
    comment: 'Good quality, will buy again.'
  },
  {
    name: 'Sophea',
    comment: 'Perfect for cooking!'
  }
]
</script>