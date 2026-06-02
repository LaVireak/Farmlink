<template>
  <CommonAppHeader />
  <div class="bg-[#f7fdf4]">
  <div class="h-auto max-w-7xl mx-auto p-4 md:p-8 text-gray-800">
    <!-- Progress -->
    <div class="flex items-center gap-4 mb-8 text-sm">
      <div class="flex items-center gap-2 text-gray-400">
        <span class="w-6 h-6 flex items-center justify-center rounded-full border">1</span>
        Cart
      </div>
      <div class="flex-1 h-px bg-gray-300"></div>

      <div class="flex items-center gap-2 text-gray-400">
        <span class="w-6 h-6 flex items-center justify-center rounded-full border">2</span>
        Address
      </div>
      <div class="flex-1 h-px bg-gray-300"></div>

      <div class="flex items-center gap-2 text-green-700 font-semibold">
        <span class="w-6 h-6 flex items-center justify-center rounded-full bg-green-700 text-white">3</span>
        Payment
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-8">
      <!-- LEFT -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div class="flex items-center gap-4 mb-8">
            <NuxtLink to="/user/checkout/address" class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
              <span class="material-symbols-outlined text-xl">arrow_back</span>
            </NuxtLink>
            <h2 class="text-2xl font-black text-primary font-[Manrope,sans-serif] tracking-tight">
              Payment Details
            </h2>
          </div>

          <div class="space-y-6">
            <!-- Name -->
            <div>
              <label class="block text-sm font-bold text-on-surface mb-2 uppercase tracking-wide">Cardholder Name</label>
              <input v-model="form.name" class="w-full bg-[#fbf9f6] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#154212] transition-all font-body text-on-surface" placeholder="John Doe" type="text" />
            </div>

            <!-- Card Number -->
            <div>
              <label class="block text-sm font-bold text-on-surface mb-2 uppercase tracking-wide">Card Number</label>
              <div ref="cardNumberMount" class="w-full bg-[#fbf9f6] border-none rounded-xl p-4 focus-within:ring-2 focus-within:ring-[#154212] transition-all min-h-[56px]"></div>
            </div>

            <!-- Expiry + CVV -->
            <div class="grid grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-bold text-on-surface mb-2 uppercase tracking-wide">Expiry Date</label>
                <div ref="cardExpiryMount" class="w-full bg-[#fbf9f6] border-none rounded-xl p-4 focus-within:ring-2 focus-within:ring-[#154212] transition-all min-h-[56px]"></div>
              </div>

              <div>
                <label class="block text-sm font-bold text-on-surface mb-2 uppercase tracking-wide">CVV / CVC</label>
                <div ref="cardCvcMount" class="w-full bg-[#fbf9f6] border-none rounded-xl p-4 focus-within:ring-2 focus-within:ring-[#154212] transition-all min-h-[56px]"></div>
              </div>
            </div>
            
            <p v-if="cardError" class="text-red-500 text-sm font-bold mt-2 flex items-center gap-1">
              <span class="material-symbols-outlined text-[18px]">error</span>
              {{ cardError }}
            </p>
          </div>
          
          <div class="mt-8 flex items-center gap-3 py-3 px-4 bg-green-50 rounded-lg border border-green-100">
            <span class="material-symbols-outlined text-green-700">lock</span>
            <p class="text-sm text-green-800">256-bit encrypted and PCI compliant. Your card is securely processed by Stripe.</p>
          </div>
        </div>

        <!-- Billing Address -->
        <div class="bg-white p-6 rounded-xl shadow-sm">
          <h2 class="text-xl font-semibold text-green-800 mb-4">
            Billing Address
          </h2>

          <div class="space-y-4">
            <label
              class="flex items-start gap-3 border rounded-xl p-4 cursor-pointer"
              :class="billingSame ? 'border-green-700 bg-green-50' : ''"
            >
              <input
                type="radio"
                v-model="billingSame"
                :value="true"
                class="mt-1 accent-green-700"
              />
              <div>
                <p class="font-medium">Same as delivery address</p>
                <p class="text-xs text-gray-500">
                  {{ deliveryAddressText }}
                </p>
              </div>
            </label>

            <label
              class="flex items-start gap-3 border rounded-xl p-4 cursor-pointer"
              :class="!billingSame ? 'border-green-700 bg-green-50' : ''"
            >
              <input
                type="radio"
                v-model="billingSame"
                :value="false"
                class="mt-1 accent-green-700"
              />
              <div>
                <p class="font-medium">Use a different address</p>
                <p class="text-xs text-gray-500">
                  Add a new billing location
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

               <!-- RIGHT: Order Summary -->
             <div class="space-y-6 lg:col-span-1 lg:sticky lg:top-8 self-start">
          <div class="bg-white rounded-[2.5rem] shadow-xl p-8 border border-gray-50">
            <h2 class="text-2xl font-black text-[#0a4d1e] mb-8">Order Summary</h2>
            
            <div class="space-y-6 mb-8">
              <div v-for="item in summaryItems" :key="item.name" class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <img :src="item.image" :alt="item.name" class="w-16 h-16 rounded-full object-cover bg-gray-50" />
                  <div>
                    <h3 class="font-bold text-gray-800 leading-tight">{{ item.name }}</h3>
                    <p class="text-xs text-gray-400 font-medium">{{ item.details }}</p>
                  </div>
                </div>
                <span class="font-black text-[#0a4d1e]">${{ item.price.toFixed(2) }}</span>
              </div>
            </div>

            <div class="space-y-3 pt-6 border-t border-gray-100 mb-8">
              <div class="flex justify-between text-sm font-semibold text-gray-400">
                <span>Subtotal</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm font-semibold text-gray-400">
                <span>Delivery Fee</span>
                <span>${{ deliveryFee.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-end pt-4">
                <span class="text-lg font-bold text-[#0a4d1e]">Total Price</span>
                <span class="text-4xl font-black text-[#0a4d1e] tracking-tighter">${{ total.toFixed(2) }}</span>
              </div>
            </div>


            <button @click="processPayment" :disabled="isProcessing" class="w-full bg-[#0a4d1e] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#083d18] transition-all flex items-center justify-center gap-3 active:scale-110 group disabled:opacity-75 disabled:active:scale-100">
              <span v-if="isProcessing" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
              {{ isProcessing ? 'Processing...' : 'Pay Now' }}
            </button>
            
            <div class="flex items-start gap-3 mt-6 p-4 bg-green-50 rounded-xl text-[#0a4d1e]">
              <span class="material-symbols-outlined text-lg shrink-0">eco</span>
              <p class="text-xs font-bold leading-relaxed">
                Your delivery route will be carbon-offset automatically. Thank you for supporting sustainable logistics!
              </p>
            </div>
          </div>
        </div>
       
    </div>
  </div>
  </div>
  <CommonAppFooter />
  
</template>
<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import { loadStripe, type Stripe, type StripeElements, type StripeCardNumberElement } from '@stripe/stripe-js';

import { computed } from 'vue';
import { useCart } from '@/composables/useCart'

const { cart, subtotal, deliveryFee, total } = useCart()

const summaryItems = computed(() =>
  cart.value.map(item => ({
    name: item.name,
    details: `${item.variant}`,
    price: item.price * item.quantity,
    image: item.image || '/images/placeholder.jpg',
  }))
);
definePageMeta({
  middleware: 'user',
  layout: 'user',
});

const config = useRuntimeConfig();

const form = reactive({
  name: 'Johnathan Appieseed',
})

const billingSame = ref(true)
const deliveryAddressText = ref('123 Orchard Lane, Green Valley, CA 90210')

const stripe = ref<Stripe | null>(null);
const elements = ref<StripeElements | null>(null);
const cardNumberElement = ref<StripeCardNumberElement | null>(null);
const cardNumberMount = ref<HTMLDivElement | null>(null);
const cardExpiryMount = ref<HTMLDivElement | null>(null);
const cardCvcMount = ref<HTMLDivElement | null>(null);
const cardError = ref('');
const isProcessing = ref(false);

onMounted(async () => {
  const saved = localStorage.getItem('farmlink_checkout_address')
  if (saved) {
    try {
      const addr = JSON.parse(saved)
      deliveryAddressText.value = `${addr.street}, ${addr.city}`
    } catch (e) {
      console.error(e)
    }
  }

  const publishableKey = config.public.stripePublishableKey;

  if (!publishableKey) {
    cardError.value = 'Stripe publishable key is missing. Set NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in farmlink-frontend/.env.';
    return;
  }

  stripe.value = await loadStripe(publishableKey);
  if (!stripe.value) {
    cardError.value = 'Stripe failed to initialize. Check the publishable key in your frontend environment.';
    return;
  }

  elements.value = stripe.value.elements();
  await nextTick();
  
  const style = {
    base: {
      fontSize: '16px',
      color: '#1d1d1f',
      fontFamily: 'Manrope, system-ui, sans-serif',
      '::placeholder': {
        color: '#86868b',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  };

  // Create and mount the individual elements
  if (elements.value && cardNumberMount.value && cardExpiryMount.value && cardCvcMount.value) {
    cardNumberElement.value = elements.value.create('cardNumber', { style, showIcon: true });
    cardNumberElement.value.mount(cardNumberMount.value);

    const cardExpiryElement = elements.value.create('cardExpiry', { style });
    cardExpiryElement.mount(cardExpiryMount.value);

    const cardCvcElement = elements.value.create('cardCvc', { style });
    cardCvcElement.mount(cardCvcMount.value);
  }

  // Listen for errors on the card number field
  cardNumberElement.value?.on('change', (event: any) => {
    if (event.error) {
      cardError.value = event.error.message;
    } else {
      cardError.value = '';
    }
  });
});

async function processPayment() {
  if (!stripe.value || !elements.value || !cardNumberElement.value) return;

  isProcessing.value = true;
  cardError.value = '';

  const { error, paymentMethod } = await stripe.value.createPaymentMethod({
    type: 'card',
    card: cardNumberElement.value,
    billing_details: {
      name: form.name || 'John Doe',
    },
  });

  if (error) {
    cardError.value = error.message || 'Payment failed. Please check your details.';
    isProcessing.value = false;
  } else {
    // Send the paymentMethod.id to our NestJS backend to actually charge the card!
    try {
      const response = await fetch(`${config.public.apiUrl}/stripe/charge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total.value, // dynamically pass the cart total
          paymentMethodId: paymentMethod.id,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'succeeded') {
        // Success! Navigate to the success page!
        console.log('Payment Succeeded! ID:', data.id);
        navigateTo('/user/checkout/Success');
      } else {
        throw new Error(data.message || 'Payment failed on server');
      }
    } catch (err: any) {
      cardError.value = err.message || 'Failed to communicate with server.';
      isProcessing.value = false;
    }
  }
}
</script>