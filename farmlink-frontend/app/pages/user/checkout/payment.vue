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
                  123 Orchard Lane, Green Valley, CA 90210
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

      <!-- RIGHT -->
      <div class="space-y-6">
        <!-- Summary -->
        <div class="bg-green-800 text-white p-6 rounded-2xl shadow-lg">
          <h3 class="font-semibold mb-4">Order Summary</h3>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span>Organic Veggie Box (L)</span>
              <span>$45.00</span>
            </div>
            <div class="flex justify-between">
              <span>Artisanal Honey Jar</span>
              <span>$12.50</span>
            </div>
            <div class="flex justify-between">
              <span>Delivery Fee</span>
              <span>FREE</span>
            </div>
          </div>

          <div class="mt-6 border-t border-green-600 pt-4">
            <p class="text-xs text-green-200">TOTAL AMOUNT</p>
            <p class="text-2xl font-bold">$57.50</p>
          </div>

          <button
            @click="processPayment"
            :disabled="isProcessing"
            class="w-full mt-6 bg-[#facc15] text-[#154212] py-4 rounded-xl font-bold text-lg hover:bg-[#fde047] transition-all flex justify-center items-center gap-2 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
          >
            <span>{{ isProcessing ? 'Processing Securely...' : 'Confirm Payment' }}</span>
            <span v-if="!isProcessing" class="material-symbols-outlined">arrow_forward</span>
            <span v-else class="material-symbols-outlined animate-spin">progress_activity</span>
          </button>

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

definePageMeta({
  middleware: 'user',
  layout: 'user',
});

const config = useRuntimeConfig();

const form = reactive({
  name: 'Johnathan Appieseed',
})

const billingSame = ref(true)

const stripe = ref<Stripe | null>(null);
const elements = ref<StripeElements | null>(null);
const cardNumberElement = ref<StripeCardNumberElement | null>(null);
const cardNumberMount = ref<HTMLDivElement | null>(null);
const cardExpiryMount = ref<HTMLDivElement | null>(null);
const cardCvcMount = ref<HTMLDivElement | null>(null);
const cardError = ref('');
const isProcessing = ref(false);

onMounted(async () => {
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
      const response = await fetch('http://localhost:3001/api/stripe/charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 57.50, // Hardcoded for this demo, usually comes from cart state
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