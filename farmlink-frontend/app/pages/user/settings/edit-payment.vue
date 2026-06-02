<script setup lang="ts">
import CommonAppSidebar from '../../../components/common/AppSidebar.vue';
import { ref, computed, onMounted } from 'vue';
import { usePaymentMethods } from '../../../composables/usePaymentMethods';

definePageMeta({
  middleware: 'user',
  layout: 'user',
});

useHead({
  title: 'Edit Payment Method | FarmLink Cambodia',
});

const route = useRoute();
const paymentMethodId = computed(() => route.query.id as string | undefined);

const {
  cards,
  isLoading,
  fetchPaymentMethods,
  setDefaultPaymentMethod,
  removePaymentMethod,
  updatePaymentMethodName,
  getCardById,
} = usePaymentMethods();

// Load cards if not already fetched
onMounted(async () => {
  if (cards.value.length === 0) {
    await fetchPaymentMethods();
  }
});

const card = computed(() =>
  paymentMethodId.value ? getCardById(paymentMethodId.value) : undefined,
);

// ── Form state ────────────────────────────────────────────────────────────────
const billingName = ref('');
const isDefault = ref(false);
const isSaving = ref(false);
const saveError = ref('');
const saveSuccess = ref(false);

// Initialise form from card data once loaded
watch(card, (c) => {
  if (c) {
    billingName.value = c.billingName ?? '';
    isDefault.value = c.isDefault;
  }
}, { immediate: true });

const brandLabel: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  discover: 'Discover',
  unionpay: 'UnionPay',
  jcb: 'JCB',
  diners: 'Diners Club',
  unknown: 'Card',
};

function getBrandLabel(brand: string) {
  return brandLabel[brand.toLowerCase()] ?? brand;
}
function formatExpiry(m: number, y: number) {
  return `${String(m).padStart(2, '0')} / ${String(y).slice(-2)}`;
}

async function saveChanges() {
  if (!card.value) return;
  isSaving.value = true;
  saveError.value = '';
  saveSuccess.value = false;
  try {
    // Update billing name if changed
    if (billingName.value.trim() !== (card.value.billingName ?? '')) {
      await updatePaymentMethodName(card.value.id, billingName.value.trim());
    }
    // Set default if toggled on
    if (isDefault.value && !card.value.isDefault) {
      await setDefaultPaymentMethod(card.value.id);
    }
    saveSuccess.value = true;
    setTimeout(() => (saveSuccess.value = false), 3000);
  } catch (e: any) {
    saveError.value = e.message || 'Failed to update card.';
  } finally {
    isSaving.value = false;
  }
}

// ── Remove ────────────────────────────────────────────────────────────────────
const isRemoving = ref(false);
const removeError = ref('');

async function handleRemove() {
  if (!card.value) return;
  isRemoving.value = true;
  removeError.value = '';
  try {
    await removePaymentMethod(card.value.id);
    navigateTo('/user/settings/payment');
  } catch (e: any) {
    removeError.value = e.message || 'Failed to remove card.';
    isRemoving.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#fbf9f6] text-on-background">
    <CommonAppHeader />

    <main class="max-w-[1550px] mx-auto w-full pt-16 sm:pt-16 pb-16 px-4 sm:px-16 lg:px-8 flex-1">
      <div class="flex flex-col md:flex-row gap-8 md:gap-10">
        <CommonAppSidebar active="payment" />

        <section class="flex-1">
          <div class="mb-10">
            <div class="flex items-center gap-2 text-[11px] font-bold text-[#5a5b58] uppercase tracking-wider mb-2">
              <NuxtLink to="/user/settings/payment" class="hover:text-primary transition-colors">Payments</NuxtLink>
              <span class="material-symbols-outlined text-xs">chevron_right</span>
              <span class="text-[#154212]">Edit Card</span>
            </div>
            <h1 class="text-4xl font-[Manrope,sans-serif] font-extrabold text-[#154212] tracking-tight">Update Payment Method</h1>
            <p class="text-[#42493e] mt-2 max-w-lg leading-relaxed">Ensure your billing information is accurate to keep your farm-to-table deliveries flowing without interruption.</p>
          </div>

          <!-- Loading -->
          <div v-if="isLoading" class="animate-pulse space-y-6">
            <div class="h-64 rounded-xl bg-[#e3e2df]" />
            <div class="h-16 rounded-xl bg-[#e3e2df]" />
          </div>

          <!-- Card not found -->
          <div v-else-if="!card" class="flex flex-col items-center py-20 text-center gap-4">
            <span class="material-symbols-outlined text-5xl text-on-surface-variant">credit_card_off</span>
            <p class="text-on-surface-variant font-medium">Card not found. It may have been removed.</p>
            <NuxtLink to="/user/settings/payment" class="text-primary font-bold underline text-sm">Back to Payment Methods</NuxtLink>
          </div>

          <!-- Edit form -->
          <div v-else class="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
            <div class="min-w-0 space-y-8">
              <section class="bg-white p-8 rounded-xl shadow-sm border border-[#c2c9bb]/30">
                <h3 class="text-lg font-[Manrope,sans-serif] font-bold text-[#154212] mb-6 flex items-center gap-2">
                  <span class="material-symbols-outlined">lock</span>
                  Secure Card Details
                </h3>

                <form class="space-y-6" @submit.prevent="saveChanges">
                  <!-- Billing Name (editable) -->
                  <div class="space-y-2">
                    <label class="block text-[11px] font-semibold uppercase tracking-wider text-[#72796e]">Cardholder Name</label>
                    <input
                      v-model="billingName"
                      class="w-full px-4 py-3 rounded-lg bg-[#e9e8e5] border-none focus:ring-2 focus:ring-[#154212] text-[#1b1c1a] font-body"
                      placeholder="Name as it appears on card"
                      type="text"
                    />
                  </div>

                  <!-- Card number (read-only) -->
                  <div class="space-y-2">
                    <label class="block text-[11px] font-semibold uppercase tracking-wider text-[#72796e]">Card Number</label>
                    <div class="relative">
                      <input
                        class="w-full px-4 py-3 rounded-lg bg-[#dbdad7]/60 border-none text-[#42493e] font-mono cursor-not-allowed pr-12"
                        disabled
                        type="text"
                        :value="`•••• •••• •••• ${card.last4}`"
                      />
                      <span class="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#154212]">credit_card</span>
                    </div>
                    <p class="text-[10px] text-[#72796e] italic">For security, card numbers cannot be changed. Please add a new card if the number has changed.</p>
                  </div>

                  <!-- Expiry (read-only) -->
                  <div class="space-y-2">
                    <label class="block text-[11px] font-semibold uppercase tracking-wider text-[#72796e]">Expiry Date</label>
                    <input
                      class="w-full px-4 py-3 rounded-lg bg-[#dbdad7]/60 border-none text-[#42493e] font-mono cursor-not-allowed"
                      disabled
                      type="text"
                      :value="formatExpiry(card.expMonth, card.expYear)"
                    />
                  </div>

                  <!-- Set as default -->
                  <div class="flex items-center gap-3 py-2">
                    <input
                      id="default_payment"
                      v-model="isDefault"
                      :disabled="card.isDefault"
                      class="rounded text-[#154212] focus:ring-[#154212] border-[#c2c9bb] h-5 w-5"
                      type="checkbox"
                    />
                    <label class="text-sm text-[#1b1c1a]" for="default_payment">
                      Set as default payment method for all purchases
                      <span v-if="card.isDefault" class="ml-2 px-2 py-0.5 text-[10px] bg-[#91f78e] text-[#00731e] font-bold rounded-full uppercase tracking-wide">Current Default</span>
                    </label>
                  </div>

                  <!-- Success / Error feedback -->
                  <p v-if="saveSuccess" class="text-[#006e1c] text-sm font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-[18px]">check_circle</span> Card updated successfully.
                  </p>
                  <p v-if="saveError" class="text-[#ba1a1a] text-sm font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-[18px]">error</span> {{ saveError }}
                  </p>

                  <div class="pt-4 flex items-center gap-4">
                    <button
                      class="flex-1 py-4 bg-gradient-to-br from-[#154212] to-[#2d5a27] text-white font-[Manrope,sans-serif] font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-60"
                      :disabled="isSaving"
                      type="submit"
                    >
                      {{ isSaving ? 'Saving…' : 'Update Card Details' }}
                    </button>
                    <NuxtLink
                      class="px-6 py-4 border border-[#c2c9bb]/40 text-[#1b1c1a] font-[Manrope,sans-serif] font-bold rounded-lg hover:bg-[#efeeea] transition-colors"
                      to="/user/settings/payment"
                    >Cancel</NuxtLink>
                  </div>
                </form>
              </section>

              <!-- Remove card danger zone -->
              <div class="p-6 rounded-xl border-2 border-[#ba1a1a]/10 bg-[#ffdad6]/20">
                <div class="flex items-start gap-4">
                  <div class="p-2 bg-[#ffdad6] rounded-lg">
                    <span class="material-symbols-outlined text-[#93000a]">delete</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-[Manrope,sans-serif] font-bold text-[#93000a]">Remove Payment Method</h4>
                    <p class="text-sm text-[#42493e] mb-4">Once removed, this card will no longer be available for checkout. Pending orders will not be affected.</p>
                    <p v-if="removeError" class="text-[#ba1a1a] text-sm font-bold mb-3">{{ removeError }}</p>
                    <button
                      class="text-[#ba1a1a] text-sm font-bold underline hover:no-underline disabled:opacity-50"
                      :disabled="isRemoving"
                      @click="handleRemove"
                    >
                      {{ isRemoving ? 'Removing…' : 'Remove Card Permanently' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right sidebar preview -->
            <div class="space-y-4 md:sticky md:top-28 md:justify-self-end md:w-full md:max-w-[300px] lg:max-w-[320px]">
              <div class="relative w-full aspect-[1.6/1] bg-gradient-to-br from-[#154212] to-[#2d5a27] rounded-2xl p-5 text-white shadow-2xl overflow-hidden group">
                <div class="absolute -right-12 -bottom-12 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                <div class="absolute -left-12 -top-12 w-40 h-40 bg-[#91f78e]/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                <div class="relative flex flex-col h-full justify-between">
                  <div class="flex justify-between items-start">
                    <div class="flex flex-col">
                      <span class="text-[10px] font-label tracking-widest uppercase opacity-70">{{ getBrandLabel(card.brand) }}</span>
                      <span class="font-[Manrope,sans-serif] font-extrabold text-lg">{{ billingName || 'Cardholder Name' }}</span>
                    </div>
                    <span class="material-symbols-outlined text-3xl opacity-90">contactless</span>
                  </div>
                  <div class="space-y-1">
                    <div class="text-[15px] tracking-[0.2em] font-mono">•••• •••• •••• {{ card.last4 }}</div>
                    <div class="flex gap-8">
                      <div class="flex flex-col">
                        <span class="text-[8px] font-label uppercase opacity-60">Expires</span>
                        <span class="text-sm">{{ formatExpiry(card.expMonth, card.expYear) }}</span>
                      </div>
                      <div v-if="card.isDefault || isDefault" class="flex flex-col">
                        <span class="text-[8px] font-label uppercase opacity-60">Status</span>
                        <span class="text-sm">Default</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-[#ffdcbe] p-5 rounded-xl border border-[#563000]/10">
                <h4 class="font-[Manrope,sans-serif] font-bold text-[#2c1600] mb-2 flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">info</span>
                  Payment Security
                </h4>
                <p class="text-xs text-[#693c00] leading-relaxed">
                  Your payment data is encrypted with 256-bit SSL technology. We never store your full card number on our servers. All transactions are processed through local Cambodian banking partners compliant with international security standards.
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