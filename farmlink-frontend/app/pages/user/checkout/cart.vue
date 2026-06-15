<template>
  <CommonAppHeader />
  <div class="bg-[#f7fdf4]">
    <div class="min-h-screen p-4 md:p-8 text-gray-800 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-green-800">{{ t('cart.title') }}</h1>
        <p class="text-sm text-gray-500">{{ t('cart.subtitle', { count: totalItems }) }}</p>
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
          Address
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
            class="bg-white p-4 rounded-xl shadow-sm"
          >
            <div class="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_124px_160px] md:items-center gap-4 md:gap-6">
              <!-- Product Info -->
              <div class="flex items-center gap-4 min-w-0">
                <img
                  :src="getCartImage(item)"
                  :alt="item.name"
                  class="w-16 h-16 rounded-lg object-cover bg-gray-100 border border-gray-100"
                />
                <div class="min-w-0">
                  <h3 class="font-semibold truncate">{{ item.name }}</h3>
                  <p class="text-sm text-gray-500 truncate">{{ item.variant }}</p>
                  <p class="text-xs text-green-700 truncate">{{ item.farm }}</p>
                </div>
              </div>

              <!-- Quantity -->
              <div class="flex items-center justify-start md:justify-center gap-3 md:w-[124px]">
                <button
                  @click="decrease(item.id)"
                  class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md"
                >-</button>

                <span class="w-6 text-center font-medium">{{ item.quantity }}</span>

                <button
                  @click="increase(item.id)"
                  class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md"
                >+</button>
              </div>

              <!-- Price -->
              <div class="text-left md:text-right md:w-[160px]">
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
          </div>

          <!-- Continue Shopping -->
          <NuxtLink
            to="/user/products"
            class="mt-6 inline-flex w-full items-center justify-center bg-green-700 px-6 py-3 font-semibold text-white no-underline transition hover:bg-green-800 rounded-xl"
          >
            Continue Shopping
          </NuxtLink>
          

          <!-- Recommendations -->
          <div class="mt-10">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-green-800">Recommendations</h2>
              <a href="#" class="text-sm text-green-700">View All</a>
            </div>

            <div class="flex gap-4 overflow-x-auto pb-2">
              <div
                v-for="rec in recommendations"
                :key="rec.id"
                class="min-w-[200px] bg-white rounded-xl shadow-sm p-4"
              >
                <img
                  :src="rec.image"
                  :alt="rec.name"
                  class="h-32 w-full rounded-lg object-cover bg-gray-200 mb-3"
                />
                <h3 class="font-medium">{{ rec.name }}</h3>
                <p class="text-sm text-gray-500">{{ rec.farm }}</p>
                <p class="text-green-700 font-semibold">
                  ${{ rec.price.toFixed(2) }}
                </p>
                <button
                  @click="addToCart(rec)"
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

          <NuxtLink
            to="/user/checkout/address"
            class="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-green-700 py-3 font-semibold text-white no-underline transition hover:bg-green-800"
          >
            Continue to Payment
          </NuxtLink>

        </div>
      </div>
    </div>
  </div>

  <CommonAppFooter />
</template>

<script setup lang="ts">
import { useCart } from '@/composables/useCart';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const CART_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%23f3f4f6'/%3E%3Cpath d='M20 43l7-9 6 5 9-12 6 16H20z' fill='%23d1d5db'/%3E%3Ccircle cx='25' cy='23' r='4' fill='%23d1d5db'/%3E%3C/svg%3E";

definePageMeta({
  middleware: 'user',
  layout: 'user',
});

const{  
  cart,
  recommendations,
  subtotal,
  deliveryFee,
  total,
  totalItems,
  increase,
  decrease,
  removeItem,
  addToCart } = useCart();

const getCartImage = (item: { image?: string }) => item.image || CART_PLACEHOLDER


</script>