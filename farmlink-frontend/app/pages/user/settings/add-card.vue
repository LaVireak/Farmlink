<script setup lang="ts">
import CommonAppSidebar from '../../../components/common/AppSidebar.vue';
import { computed, nextTick, ref } from 'vue';
import { usePaymentMethods } from '../../../composables/usePaymentMethods';

definePageMeta({
  middleware: 'user',
  layout: 'user',
});

useHead({
  title: 'Add New Card | FarmLink Cambodia',
});

const cardholderName = ref('');
const cardNumber = ref('');
const expiryDate = ref('');
const cvv = ref('');

import { loadStripe, type Stripe, type StripeElements, type StripeCardNumberElement, type StripeError, type PaymentMethod } from '@stripe/stripe-js';

const config = useRuntimeConfig();

const stripe = ref<Stripe | null>(null);
const elements = ref<StripeElements | null>(null);
const cardNumberElement = ref<StripeCardNumberElement | null>(null);
const cardNumberMount = ref<HTMLDivElement | null>(null);
const cardExpiryMount = ref<HTMLDivElement | null>(null);
const cardCvcMount = ref<HTMLDivElement | null>(null);
const cardError = ref('');
const isProcessing = ref(false);

const { addPaymentMethod } = usePaymentMethods();

const previewName = computed(() => (cardholderName.value.trim() ? cardholderName.value.toUpperCase() : 'YOUR NAME HERE'));

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

async function savePaymentMethod() {
  if (!stripe.value || !elements.value) return;

  isProcessing.value = true;
  cardError.value = '';

  // Step 1: Create the PaymentMethod token on Stripe's side
  const { error, paymentMethod } = await stripe.value.createPaymentMethod({
    type: 'card',
    card: cardNumberElement.value!,
    billing_details: {
      name: cardholderName.value || undefined,
    },
  });

  if (error) {
    cardError.value = error.message || 'An error occurred while processing the card.';
    isProcessing.value = false;
    return;
  }

  // Step 2: Persist it on the backend (attaches to Stripe Customer)
  try {
    await addPaymentMethod(paymentMethod.id, false);
    navigateTo('/user/settings/payment');
  } catch (e: any) {
    cardError.value = e.message || 'Failed to save card. Please try again.';
  } finally {
    isProcessing.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#fbf9f6] text-zinc-900">
    <CommonAppHeader />

    <main class="max-w-7xl mx-auto w-full pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex-1">
      <div class="flex flex-col md:flex-row gap-8 md:gap-10">
        <CommonAppSidebar active="payment" />

        <section class="flex-1 space-y-10">
          <header class="mb-2">
            <nav class="flex items-center gap-2 text-sm font-label text-outline mb-4 uppercase tracking-wider">
              <a class="hover:text-primary transition-colors" href="/user/settings/payment">Payment Methods</a>
              <span class="material-symbols-outlined text-xs">chevron_right</span>
              <span class="text-primary font-bold">Add New Card</span>
            </nav>
            <h1 class="text-4xl lg:text-5xl font-black text-primary font-[Manrope,sans-serif] tracking-tighter leading-tight mb-4">Secure Payment Details</h1>
            <p class="text-on-surface-variant max-w-2xl text-lg leading-relaxed opacity-80">
              Protecting your harvest transactions with industry-standard encryption. Add a credit or debit card for seamless farm-to-table delivery.
            </p>
          </header>

          <div class="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
            <div class="min-w-0">
              <form class="space-y-8" @submit.prevent>
                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-bold text-on-surface mb-2 uppercase tracking-wide">Cardholder Name</label>
                    <input v-model="cardholderName" class="w-full bg-surface-container-high border-none rounded-lg p-4 focus:ring-2 focus:ring-[#154212] transition-all font-body text-on-surface" placeholder="John Doe" type="text" />
                  </div>

                  <div>
                    <label class="block text-sm font-bold text-on-surface mb-2 uppercase tracking-wide">Card Number</label>
                    <div ref="cardNumberMount" class="w-full bg-surface-container-high border-none rounded-lg p-4 focus-within:ring-2 focus-within:ring-[#154212] transition-all min-h-[56px]"></div>
                  </div>

                  <div class="grid grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-bold text-on-surface mb-2 uppercase tracking-wide">Expiry Date</label>
                      <div ref="cardExpiryMount" class="w-full bg-surface-container-high border-none rounded-lg p-4 focus-within:ring-2 focus-within:ring-[#154212] transition-all min-h-[56px]"></div>
                    </div>

                    <div>
                      <label class="block text-sm font-bold text-on-surface mb-2 uppercase tracking-wide">CVV / CVC</label>
                      <div ref="cardCvcMount" class="w-full bg-surface-container-high border-none rounded-lg p-4 focus-within:ring-2 focus-within:ring-[#154212] transition-all min-h-[56px]"></div>
                    </div>
                  </div>
                  
                  <p v-if="cardError" class="text-error text-sm font-bold mt-2 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[18px]">error</span>
                    {{ cardError }}
                  </p>
                </div>

                <div class="flex items-center gap-3 py-4 bg-secondary-container/20 px-6 rounded-xl border border-secondary-container/30">
                  <span class="material-symbols-outlined text-secondary">verified_user</span>
                  <p class="text-sm text-on-secondary-container">Your payment information is encrypted and never stored on our local servers.</p>
                </div>

                <div class="flex flex-col sm:flex-row gap-4 pt-4">
                  <button @click="savePaymentMethod" :disabled="isProcessing" class="flex-1 bg-[#154212] text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-[#1f5a1a] transition-all flex items-center justify-center gap-2 active:scale-95 duration-150 shadow-[0_10px_24px_-8px_rgba(21,66,18,0.6)] disabled:opacity-70 disabled:active:scale-100" type="button">
                    <span>{{ isProcessing ? 'Processing...' : 'Save Payment Method' }}</span>
                    <span v-if="!isProcessing" class="material-symbols-outlined transition-transform">arrow_forward</span>
                    <span v-else class="material-symbols-outlined animate-spin">progress_activity</span>
                  </button>
                  <NuxtLink class="px-8 py-4 border-2 border-primary/20 text-primary font-bold rounded-lg hover:bg-surface-container-high transition-colors active:scale-95 duration-150 flex items-center justify-center" to="/user/settings/payment">
                    Cancel
                  </NuxtLink>
                </div>
              </form>
            </div>

            <div class="space-y-3 md:sticky md:top-28 md:justify-self-end md:w-full md:max-w-[300px] lg:max-w-[320px]">
              <div class="relative w-full aspect-[1.55/1] rounded-2xl overflow-hidden bg-gradient-to-br from-[#154212] via-[#2d5a27] to-[#002201] p-4 lg:p-5 text-white shadow-2xl group">
                <div class="absolute inset-0 opacity-20 pointer-events-none">
                  <img alt="Card texture background" class="w-full h-full object-cover mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGuePrFCVK7hKDNiapAzQ0aICmBG7Fw5y8GcidAHgjfdc-oyxu42ZqFKUAwv8-YcXfR6hI7jmCQn-0uHrAyNfFMEDy8H-sKpN4jztYHhP5BT2tuj9RFxLJ1KjDrGzMDLsvJ4mp5_WzmHfzECqa54paZ-GmI0riw5WaPERcrWrJFtjhkd8wmF72V-Zb0w7rhzEBefhtDMAYI292QDypGd7ReNc7_3jJ9bGtUSOFY6Bv34XQLwtstQ-_5e638Iwit83hvw1RXbCCGx4" />
                </div>
                <div class="relative z-10 h-full flex flex-col justify-between">
                  <div class="flex justify-between items-start">
                    <div class="w-9 h-7 bg-gradient-to-br from-tertiary-fixed to-tertiary rounded-lg opacity-80"></div>
                    <span class="material-symbols-outlined text-2xl lg:text-3xl opacity-50">contactless</span>
                  </div>
                  <div class="space-y-4">
                    <div class="text-[15px] lg:text-lg font-mono tracking-[0.16em] drop-shadow-md">•••• •••• •••• ••••</div>
                    <div class="flex justify-between items-end">
                      <div>
                        <div class="text-[9px] uppercase tracking-widest opacity-60 mb-1">Card Holder</div>
                        <div class="text-xs lg:text-sm font-[Manrope,sans-serif] font-bold tracking-wide uppercase">{{ previewName }}</div>
                      </div>
                      <div class="text-right">
                        <div class="text-[9px] uppercase tracking-widest opacity-60 mb-1">Expires</div>
                        <div class="text-xs lg:text-sm font-[Manrope,sans-serif] font-bold">MM/YY</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 lg:gap-4">
                <div class="p-3 lg:p-4 rounded-xl bg-[#eef7ed] border border-[#cde2c7] flex flex-col items-center text-center gap-2">
                  <span class="material-symbols-outlined text-[#154212] text-2xl lg:text-3xl">lock</span>
                  <span class="text-xs font-bold uppercase tracking-tighter text-[#154212]">PCI Compliant</span>
                </div>
                <div class="p-3 lg:p-4 rounded-xl bg-[#eef7ed] border border-[#cde2c7] flex flex-col items-center text-center gap-2">
                  <span class="material-symbols-outlined text-[#154212] text-2xl lg:text-3xl">security_update_good</span>
                  <span class="text-xs font-bold uppercase tracking-tighter text-[#154212]">256-bit SSL</span>
                </div>
              </div>

              <div class="bg-tertiary-fixed/30 p-4 lg:p-6 rounded-2xl border border-tertiary/10">
                <h4 class="text-tertiary font-[Manrope,sans-serif] font-bold mb-2">Did you know?</h4>
                <p class="text-sm text-on-tertiary-fixed-variant leading-relaxed">
                  By adding a card, you support our "Instant Farmer Pay" initiative, ensuring Cambodian growers receive their funds within 24 hours of harvest dispatch.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <CommonAppFooter />
  </div>
</template>

