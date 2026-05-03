<template>
  <div class="min-h-screen bg-green-50 p-4 md:p-8 text-gray-800">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-green-800">Your Cart</h1>
      <p class="text-sm text-gray-500">
        {{ totalItems }} ITEMS READY FOR HARVEST
      </p>
    </div>

    <!-- Progress Steps -->
    <div class="flex items-center gap-4 mb-8 text-sm">
      <div class="flex items-center gap-2 text-green-700 font-semibold">
        <span class="w-6 h-6 flex items-center justify-center rounded-full bg-green-700 text-white">1</span>
        Cart
      </div>
      <div class="flex-1 h-px bg-gray-300"></div>
      <div class="flex items-center gap-2 text-gray-400">
        <span class="w-6 h-6 flex items-center justify-center rounded-full border">2</span>
        Shipping
      </div>
      <div class="flex-1 h-px bg-gray-300"></div>
      <div class="flex items-center gap-2 text-gray-400">
        <span class="w-6 h-6 flex items-center justify-center rounded-full border">3</span>
        Payment
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cart"
          :key="item.id"
          class="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-xl shadow-sm"
        >
          <!-- Product Info -->
          <div class="flex items-center gap-4 w-full md:w-auto">
            <div class="w-16 h-16 bg-gray-200 rounded-lg"></div>
            <div>
              <h3 class="font-semibold">{{ item.name }}</h3>
              <p class="text-sm text-gray-500">{{ item.variant }}</p>
              <p class="text-xs text-green-700">{{ item.farm }}</p>
            </div>
          </div>

          <!-- Quantity -->
          <div class="flex items-center gap-3 mt-4 md:mt-0">
            <button
              @click="decrease(item.id)"
              class="px-2 py-1 bg-gray-200 rounded"
            >-</button>

            <span>{{ item.quantity }}</span>

            <button
              @click="increase(item.id)"
              class="px-2 py-1 bg-gray-200 rounded"
            >+</button>
          </div>

          <!-- Price -->
          <div class="text-right mt-4 md:mt-0">
            <p class="text-sm text-gray-500">
              ${{ item.price.toFixed(2) }} × {{ item.quantity }}
            </p>
            <p class="font-semibold text-green-700">
              ${{ (item.price * item.quantity).toFixed(2) }}
            </p>
            <button
              @click="removeItem(item.id)"
              class="text-xs text-red-500 mt-1"
            >
              Remove
            </button>
          </div>
        </div>

        <!-- Continue Shopping -->
        <NuxtLink to="/" class="text-green-700 text-sm">
          ← Continue Shopping
        </NuxtLink>

        <!-- Recommendations -->
        <div class="mt-10">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-green-800">
              Goes well with your cart
            </h2>
            <a href="#" class="text-sm text-green-700">
              VIEW ALL STAPLES
            </a>
          </div>

          <div class="flex gap-4 overflow-x-auto pb-2">
            <div
              v-for="rec in recommendations"
              :key="rec.id"
              class="min-w-[200px] bg-white rounded-xl shadow-sm p-4"
            >
              <div class="h-32 bg-gray-200 rounded mb-3"></div>
              <h3 class="font-medium">{{ rec.name }}</h3>
              <p class="text-sm text-gray-500">{{ rec.farm }}</p>
              <p class="text-green-700 font-semibold">
                ${{ rec.price.toFixed(2) }}
              </p>
              <button
                class="mt-3 w-full border border-green-700 text-green-700 rounded-lg py-1 hover:bg-green-700 hover:text-white transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-white p-6 rounded-xl shadow-md h-fit">
        <h2 class="text-lg font-semibold mb-4">Order Summary</h2>

        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Delivery Fee</span>
            <span>${{ deliveryFee.toFixed(2) }}</span>
          </div>
        </div>

        <div class="flex justify-between font-semibold text-lg mt-4">
          <span>Total</span>
          <span class="text-green-700">${{ total.toFixed(2) }}</span>
        </div>

        <button
          class="w-full mt-6 bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition"
        >
          Proceed to Checkout
        </button>

        <p class="text-xs text-gray-500 mt-4">
          Harvesting and delivery typically takes 24–48 hours.
          By proceeding, you agree to our terms.
        </p>

        <div class="flex items-center gap-2 mt-4 text-sm text-green-700">
          🌱 Carbon Neutral Delivery
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '@/composables/useCart';

const{  
  cart,
  recommendations,
  subtotal,
  deliveryFee,
  total,
  totalItems,
  increase,
  decrease,
  removeItem } = useCart();


</script>