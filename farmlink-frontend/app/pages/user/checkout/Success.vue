<template>
  <div class="min-h-screen bg-[#f7fdf4] py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
    <div class="max-w-3xl mx-auto">
      
      <!-- Error State UI -->
      <div v-if="isError" class="text-center mb-10 bg-white rounded-3xl p-8 border border-red-100 shadow-sm max-w-2xl mx-auto">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6 text-red-600">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 class="text-3xl font-extrabold text-red-800 mb-3 tracking-tight">Checkout Error</h1>
        <p class="text-gray-600 text-lg mb-8 leading-relaxed max-w-md mx-auto">
          {{ errorMessage || 'An error occurred while creating your order in the database.' }}
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/user/checkout/cart" class="w-full sm:w-auto bg-[#0a4d1e] text-white px-8 py-3 rounded-full font-bold hover:bg-[#083d18] transition-colors no-underline">
            Return to Cart
          </NuxtLink>
          <NuxtLink to="/" class="w-full sm:w-auto text-[#0a4d1e] font-bold hover:underline no-underline">
            Return Home
          </NuxtLink>
        </div>
      </div>

      <!-- Success State UI -->
      <div v-else>
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-[#d1f0d1] rounded-full mb-6">
            <svg class="w-8 h-8 text-[#0a4d1e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="text-4xl font-extrabold text-[#0a4d1e] mb-3 tracking-tight">{{ t('success.title') }}</h1>
          <p class="text-gray-600 text-lg">{{ t('success.thanks', { name: customerName, orderId: orderIdText }) }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          <div class="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-[#0a4d1e]">{{ t('success.yourHarvest') }}</h2>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">{{ items.length }} {{ t('success.items') }}</span>
            </div>

            <div v-if="items.length" class="space-y-6">
              <div v-for="item in items" :key="item.id" class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-4 min-w-0">
                  <img :src="item.image" :alt="item.name" class="w-16 h-16 rounded-full object-cover bg-gray-100 flex-shrink-0" />
                  <div class="min-w-0">
                    <h3 class="font-bold text-gray-800 truncate">{{ item.name }}</h3>
                    <p class="text-xs text-gray-500 truncate">{{ item.desc }}</p>
                  </div>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="text-xs text-gray-400">{{ item.quantity }} × ${{ item.price.toFixed(2) }}</p>
                  <span class="font-bold text-gray-700">${{ item.lineTotal.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <div v-else class="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
              Your cart is empty.
            </div>

            <hr class="my-6 border-gray-100" />

            <div class="space-y-3 text-sm">
              <div class="flex justify-between text-gray-500">
                <span>{{ t('success.subtotal') }}</span>
                <span>${{ dynamicSubtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-500">
                <span>{{ t('success.deliveryFee') }}</span>
                <span>${{ dynamicDeliveryFee.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-xl font-extrabold text-[#0a4d1e] pt-2">
                <span>{{ t('success.totalPaid') }}</span>
                <span>${{ totalPaid.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-[#0a4d1e] text-white rounded-3xl p-6 shadow-lg">
              <div class="flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-[#86efac]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <h2 class="font-bold tracking-wide">Delivery Details</h2>
              </div>
              
              <div class="mb-6">
                <p class="text-xs text-green-200 uppercase font-bold tracking-widest mb-1">Estimated Arrival</p>
                <p class="text-lg font-semibold">Today, 4:00 PM – 6:00 PM</p>
              </div>

              <div>
                <p class="text-xs text-green-200 uppercase font-bold tracking-widest mb-1">Shipping To</p>
                <p class="text-sm leading-relaxed opacity-90 whitespace-pre-line">
                  {{ deliveryAddress }}
                </p>
              </div>
            </div>

            <div class="relative h-32 w-full bg-[#cde4b9] rounded-3xl overflow-hidden border-4 border-white shadow-sm">
              <div class="absolute inset-0 opacity-40" style="background-image: radial-gradient(#0a4d1e 0.5px, transparent 0.5px); background-size: 10px 10px;"></div>
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div class="bg-[#0a4d1e] p-2 rounded-full shadow-lg">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="flex flex-col items-center gap-4">
              <NuxtLink to="/user/settings/PurchaseHistory?tab=In-Transit" class="w-full bg-[#0a4d1e] text-white py-4 rounded-full font-bold hover:bg-[#083d18] transition-colors flex items-center justify-center gap-2 group no-underline">
                {{ t('success.track') }} <span class="group-hover:translate-x-1 transition-transform">→</span>
              </NuxtLink>
              <NuxtLink to="/" class="text-[#0a4d1e] font-bold text-sm hover:underline decoration-2 no-underline">{{ t('success.return') }}</NuxtLink>
            </div>
          </div>
        </div>

        <div class="mt-12 bg-[#ccb800] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div class="relative z-10">
            <h2 class="text-2xl font-black text-[#423d00] mb-2 italic">While you wait...</h2>
            <p class="text-[#5c5500] font-medium max-w-md leading-snug">
              Meet Sarah, the farmer behind your kale. Her organic farm in Green Valley 
              has been pesticide-free since 1994.
            </p>
          </div>
          <button class="relative z-10 bg-[#423d00] text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-black transition-colors">
            Read the Story
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { useAuthStore } from '~/stores/auth.store'
import { getAccessToken } from '~/services/auth.service'
import { useRewards } from '@/composables/useRewards'

const { t } = useI18n()
definePageMeta({
  middleware: 'user',
  layout: 'user',
});

const authStore = useAuthStore()
const config = useRuntimeConfig()
const route = useRoute()
const { cart, subtotal, deliveryFee, total } = useCart()
const { awardPoints } = useRewards()

const customerName = computed(() => {
  if (authStore.user) {
    return `${authStore.user.firstName || ''} ${authStore.user.lastName || ''}`.trim() || 'Johnathan'
  }
  return 'Johnathan'
})

const orderIdText = ref('#FL-8821')
const deliveryAddress = ref('123 Orchard Lane,\nGreen Valley, GV 90210')
const createdOrder = ref(null)
const itemsSnapshot = ref([])
const isError = ref(false)
const errorMessage = ref('')

const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%23f3f4f6'/%3E%3Cpath d='M20 43l7-9 6 5 9-12 6 16H20z' fill='%23d1d5db'/%3E%3Ccircle cx='25' cy='23' r='4' fill='%23d1d5db'/%3E%3C/svg%3E";

const items = computed(() => {
  if (createdOrder.value) {
    return createdOrder.value.items.map((item) => ({
      id: item.id,
      name: item.product?.nameEn || 'Fresh Produce',
      desc: item.product?.category || 'Crop',
      quantity: Number(item.quantity) || 0,
      price: Number(item.unitPrice) || 0,
      lineTotal: (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0),
      image: item.product?.thumbnailUrl || fallbackImage,
    }))
  }
  return itemsSnapshot.value
})

const dynamicSubtotal = computed(() => {
  if (createdOrder.value) return Number(createdOrder.value.subtotal) || 0
  return subtotal.value
})

const dynamicDeliveryFee = computed(() => {
  if (createdOrder.value) return Number(createdOrder.value.deliveryFee) || 0
  return deliveryFee
})

const totalPaid = computed(() => {
  if (createdOrder.value) return Number(createdOrder.value.totalAmount) || 0
  return total.value
})

onMounted(async () => {
  // Capture address from localStorage
  const savedAddress = localStorage.getItem('farmlink_checkout_address')
  let parsedAddress = null
  if (savedAddress) {
    try {
      parsedAddress = JSON.parse(savedAddress)
      deliveryAddress.value = `${parsedAddress.name}\n${parsedAddress.street},\n${parsedAddress.city}`
    } catch (e) {
      console.error(e)
    }
  }

  // Capture payment method
  const rawPaymentMethod = localStorage.getItem('farmlink_checkout_payment_method') || 'card'
  let paymentMethod = 'cash_on_delivery'
  if (rawPaymentMethod === 'card' || rawPaymentMethod === 'stripe') {
    paymentMethod = 'ipay'
  } else if (rawPaymentMethod === 'aba_qr') {
    paymentMethod = 'aba_payway'
  } else if (rawPaymentMethod === 'cod') {
    paymentMethod = 'cash_on_delivery'
  }

  if (cart.value.length > 0) {
    // Snapshot items to keep displaying on screen even after cart is cleared
    itemsSnapshot.value = cart.value.map((item) => ({
      id: item.id,
      name: item.name,
      desc: [item.variant, item.farm].filter(Boolean).join(' • ') || 'Cart item',
      quantity: Number(item.quantity) || 0,
      price: Number(item.price) || 0,
      lineTotal: (Number(item.price) || 0) * (Number(item.quantity) || 0),
      image: item.image || fallbackImage,
    }))

    try {
      const token = await getAccessToken()
      const orderPayload = {
        consumerId: authStore.user?.id,
        paymentMethod: paymentMethod,
        paymentStatus: rawPaymentMethod === 'cod' ? 'unpaid' : 'paid',
        paymentRef: route.query.payment_ref || null,
        deliveryAddress: parsedAddress ? `${parsedAddress.street}, ${parsedAddress.city}` : '123 Orchard Lane, Green Valley, GV 90210',
        deliveryLat: 11.5564,
        deliveryLng: 104.9282,
        note: 'Eco-Courier shipment',
        items: cart.value.map(item => ({
          productId: item.id,
          farmerId: item.farmerId || 'e1cb5bd7-98b7-4c75-ba7e-36c5332f1111', // default fallback if none
          quantity: item.quantity,
          unitPrice: item.price,
        }))
      }

      const res = await fetch(`${config.public.apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderPayload),
      })

      if (res.ok) {
        const data = await res.json()
        createdOrder.value = data
        orderIdText.value = `#${data.orderNumber}`
        
        // Award points based on total amount paid
        if (data.totalAmount) {
          void awardPoints(Number(data.totalAmount))
        }
        
        // Clear cart
        cart.value = []
        localStorage.removeItem('farmlink_cart')
        localStorage.removeItem('farmlink_checkout_payment_method')
        localStorage.removeItem('farmlink_checkout_address')
      } else {
        const errorText = await res.text()
        console.error('Failed to create order in database:', errorText)
        isError.value = true
        try {
          const errObj = JSON.parse(errorText)
          errorMessage.value = errObj.message || 'An error occurred while creating your order.'
        } catch {
          errorMessage.value = 'An error occurred while creating your order.'
        }
      }
    } catch (e) {
      console.error('Order creation error:', e)
      isError.value = true
      errorMessage.value = e.message || 'A network error occurred.'
    }
  }
})
</script>

<style scoped>
/* Optional: Custom font import if you have a specific one in mind */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

:deep(body) {
  font-family: 'Inter', sans-serif;
}
</style>