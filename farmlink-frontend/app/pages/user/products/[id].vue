<template>

  <CommonAppHeader />

  <div class="bg-[#f7fdf4] min-h-screen p-6">

    <!-- BACK -->
    <button class="bg-green-600 mb-4 text-white font-medium px-4 py-2 rounded-full border-2 border-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1 transition-all">
      <NuxtLink to="/user/products">
      ← Back
    </NuxtLink>
    </button>
    

    <!-- PRODUCT DETAIL -->
    <div class="grid md:grid-cols-2 gap-10 bg-white p-6 rounded-2xl shadow">

      <!-- LEFT IMAGES -->
      <div>
        <img
          :src="product.image"
          class="w-full h-[750px] object-cover rounded-2xl"
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
  class="bg-green-600 mb-4 mt-6 text-white font-medium px-4 py-2 rounded-full border-2 border-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1 transition-all"
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

  <CommonAppFooter />
  

</template>

<script setup>
import AppHeader from '~/components/common/AppHeader.vue'
import AppFooter from '~/components/common/AppFooter.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()

// MOCK DATA (later you can fetch from API)
const products = [
  {
    id: 1,
    name: 'Fresh Green Beans',
    price: 4.5,
    category: 'Vegetable',
    image: '/images/beans.jpg',
    gallery: ['/images/beans.jpg', '/images/beans2.jpg'],
    description: 'Crisp, organic green beans harvested daily from local farms. Perfect for healthy meals.'
  },
  {
    id: 2,
    name: 'Fresh Broccoli',
    price: 3.75,
    category: 'Vegetable',
    image: '/images/broccoli.jpg',
    gallery: ['/images/broccoli.jpg', '/images/broccoli2.jpg'],
    description: 'Fresh broccoli packed with vitamins and nutrients. Great for steaming or stir-fry.'
  },
  {
    id: 3,
    name: 'Fresh Bell Peppers',
    price: 2.1,
    category: 'Vegetable',
    image: '/images/pepper.jpg',
    gallery: ['/images/pepper.jpg', '/images/pepper2.jpg'],
    description: 'Colorful bell peppers full of flavor and crunch. Ideal for salads and cooking.'
  },
  {
    id: 4,
    name: 'Fresh Cucumbers',
    price: 2.5,
    category: 'Vegetable',
    image: '/images/cucumber.jpg',
    gallery: ['/images/cucumber.jpg', '/images/cucumber2.jpg'],
    description: 'Fresh, crispy cucumbers perfect for salads and refreshing drinks.'
  },
  {
    id: 5,
    name: 'Fresh Grapes',
    price: 5.5,
    category: 'Fruit',
    image: '/images/grape.jpg',
    gallery: ['/images/grape.jpg', '/images/grape2.jpg'],
    description: 'Sweet and juicy grapes freshly picked from local farms.'
  },
  {
    id: 6,
    name: 'Fresh Apples',
    price: 3.99,
    category: 'Fruit',
    image: '/images/apple.jpg',
    gallery: ['/images/apple.jpg', '/images/apple2.jpg'],
    description: 'Crisp and sweet apples. Perfect for snacking or baking.'
  },
  {
    id: 7,
    name: 'Fresh Oranges',
    price: 4.2,
    category: 'Fruit',
    image: '/images/orange.jpg',
    gallery: ['/images/orange.jpg', '/images/orange2.jpg'],
    description: 'Juicy organic oranges rich in vitamin C. Refreshing and naturally sweet.'
  },
  {
    id: 8,
    name: 'Fresh Bananas',
    price: 2.8,
    category: 'Fruit',
    image: '/images/bananas.jpg',
    gallery: ['/images/bananas.jpg', '/images/bananas2.jpg'],
    description: 'Fresh bananas packed with potassium and energy.'
  },
  {
    id: 9,
    name: 'Organic Tomatoes',
    price: 5.2,
    category: 'Organic',
    image: '/images/tomatoes.jpg',
    gallery: ['/images/tomatoes.jpg', '/images/tomatoes2.jpg'],
    description: 'Organic tomatoes rich in flavor and nutrients.'
  },
  {
    id: 10,
    name: 'Organic Cabbage',
    price: 3.5,
    category: 'Organic',
    image: '/images/cabbage.jpg',
    gallery: ['/images/cabbage.jpg', '/images/cabbage2.jpg'],
    description: 'Fresh organic cabbage perfect for salads and cooked dishes.'
  },
  {
    id: 11,
    name: 'Organic Lettuce',
    price: 4.0,
    category: 'Organic',
    image: '/images/lettuce.jpg',
    gallery: ['/images/lettuce.jpg', '/images/lettuce2.jpg'],
    description: 'Crisp organic lettuce perfect for healthy salads.'
  },
  {
    id: 12,
    name: 'Heirloom Carrots',
    price: 4.95,
    category: 'Organic',
    image: '/images/carrot.jpg',
    gallery: ['/images/carrot.jpg', '/images/carrot2.jpg'],
    description: 'Naturally sweet heirloom carrots grown with care.'
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