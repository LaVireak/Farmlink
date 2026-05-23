<template>
  <div class="min-h-screen bg-[#FDFCFB] py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-green-100 selection:text-green-900">
    <!-- Subtle Background Element -->
    <div class="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-[#f0f9eb] to-transparent pointer-events-none -z-10"></div>
    
    <div class="max-w-5xl mx-auto">
      <!-- Header Section -->
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded">Secure Checkout</span>
          </div>
          <h1 class="text-4xl font-extrabold text-[#064e3b] tracking-tight">{{ t('qr.finalize') }}</h1>
          <p class="text-slate-500 mt-2 font-medium">Order #{{ tranId?.slice(-8) || '...' }} • {{ t('qr.secureQr') }}</p>
        </div>
        
        <!-- Premium Progress Indicator -->
        <div class="flex items-center gap-3">
          <div class="flex flex-col items-end">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 3 of 3</span>
            <span class="text-sm font-bold text-green-700">Payment & Confirmation</span>
          </div>
          <div class="w-12 h-12 rounded-full border-4 border-green-100 border-t-green-600 flex items-center justify-center">
            <span class="text-sm font-black text-green-700">100%</span>
          </div>
        </div>
      </header>

      <div class="flex items-center gap-2 text-gray-400">
        <span class="w-6 h-6 flex items-center justify-center rounded-full border">2</span>
        Shipping
      </div>
      <div class="flex-1 h-px bg-gray-300"></div>

      <div class="flex items-center gap-2 text-green-700 font-semibold">
        <span class="w-6 h-6 flex items-center justify-center rounded-full bg-green-700 text-white">3</span>
        Payment
      </div>
    </div>

    <div class="max-w-5xl mx-auto">


      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <div class="lg:col-span-7">
          <h1 class="text-3xl font-black text-[#0a4d1e] mb-2">Pay with QR Code</h1>
          <p class="text-gray-500 mb-10 max-w-md">
            Complete your harvest order securely using your preferred mobile banking or digital wallet application.
          </p>

          <div class="flex flex-col items-center justify-center mb-12">
            <div class="bg-gradient-to-br from-white to-[#f0f7e9] p-10 rounded-[2.5rem] shadow-lg border-2 border-[#0a4d1e]/10 mb-6 flex items-center justify-center">
              <div v-if="isLoading" class="w-[380px] h-[380px] flex items-center justify-center text-sm text-gray-400 font-semibold">
                Generating QR...
              </div>
              <img
                v-else-if="qrImageSrc"
                :src="qrImageSrc"
                alt="Dynamic payment QR"
                class="w-[380px] h-[380px] object-contain"
              />
              <qrcode-vue 
                v-else-if="qrValue"
                :value="qrValue" 
                :size="380" 
                level="H" 
                render-as="svg"
                foreground="#0a4d1e"
              />
              <div v-else class="w-[380px] h-[380px] flex items-center justify-center text-sm text-red-500 font-semibold text-center px-4">
                No QR data received yet.
              </div>
            </div>
            <div class="text-center">
              <p class="text-[#0a4d1e] font-bold text-lg mb-1">Dynamic Bakong QR</p>
              <p class="text-gray-400 text-sm font-medium">
                <span v-if="isLoading">Generating QR...</span>
                <span v-else-if="error" class="text-red-600 font-semibold">{{ error }}</span>
                <span v-else-if="paymentStatus === 'paid'" class="text-green-700 font-bold">Payment confirmed</span>
                <span v-else-if="isExpired" class="text-red-600 font-semibold">QR expired. Please regenerate.</span>
                <span v-else>Expires in {{ formattedTime }}</span>
              </p>
              <p v-if="tranId" class="text-xs text-gray-400 mt-2">Tran ID: {{ tranId }}</p>
              <p v-if="error" class="text-sm text-red-600 mt-2">{{ error }}</p>
            </div>
          </div>

          <div class="mb-10">
            <h2 class="text-lg font-bold text-[#0a4d1e] mb-6">Payment instructions</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(step, index) in steps" :key="index" 
                class="flex items-center gap-4 bg-[#f0f7e9] p-4 rounded-2xl">
                <span class="flex-shrink-0 w-8 h-8 bg-[#0a4d1e] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {{ index + 1 }}
                </span>
                <p class="text-sm font-semibold text-[#0a4d1e]/80">{{ step }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-4 max-w-md">
            <button
              class="w-full bg-[#0a4d1e] text-white py-4 rounded-2xl font-bold hover:bg-[#083d18] transition-all shadow-md active:scale-[0.98]"
              @click="checkStatus"
              :disabled="isLoading || !tranId"
            >
              <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div class="relative flex flex-col items-center">
                <svg class="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span class="text-xs uppercase tracking-[0.2em] font-black">{{ t('qr.refresh') }}</span>
              </div>
            </button>
          </div>
        </div>

        <div class="lg:col-span-5">
          <div class="bg-white rounded-[2.5rem] shadow-xl p-8 border border-gray-50 overflow-hidden">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-black text-[#0a4d1e]">Order Summary</h2>
              <span class="bg-[#ccb800] text-[#423d00] text-[10px] font-black px-2 py-1 rounded flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" /></svg>
                QR PAYMENT
              </span>
            </div>

            <div class="space-y-6 mb-8">
              <div v-for="item in orderItems" :key="item.name" class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <img :src="item.image" :alt="item.name" class="w-16 h-16 rounded-full object-cover shadow-sm bg-gray-50" />
                  <div>
                    <h3 class="font-bold text-gray-800 leading-tight">{{ item.name }}</h3>
                    <p class="text-xs text-gray-400 font-medium">{{ item.qty }} x ${{ item.unitPrice.toFixed(2) }}</p>
                  </div>
                </div>
                <span class="font-black text-[#0a4d1e]">${{ (item.qty * item.unitPrice).toFixed(2) }}</span>
              </div>
            </div>

            <div class="space-y-3 pt-6 border-t border-gray-100">
              <div class="flex justify-between text-sm font-semibold text-gray-400">
                <span>Subtotal</span>
                <span>Test payment</span>
              </div>
              <div class="flex justify-between text-sm font-semibold text-gray-400">
                <span>Delivery Fee</span>
                <span>$0.00</span>
              </div>
              <div class="flex justify-between items-end pt-4">
                <span class="text-lg font-bold text-[#0a4d1e]">Total Price</span>
                <span class="text-4xl font-black text-[#0a4d1e] tracking-tighter">${{ testAmount.toFixed(2) }}</span>
              </div>
            </div>

            <div class="mt-8 flex gap-3 items-start opacity-50">
              <svg class="w-5 h-5 mt-0.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p class="text-[10px] leading-relaxed font-medium text-gray-600">
                Secure transaction protected by Farm Link encryption. Your purchase supports local farmers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Toast Notification (Example) -->
    <div v-if="paymentStatus === 'paid'" class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#064e3b] text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 z-50 animate-bounce">
      <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
      </div>
      <span class="font-bold text-sm">{{ t('qr.paymentSuccessToast') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQR } from '@/composables/useQR'
import QrcodeVue from 'qrcode.vue'

const { t } = useI18n()

const {
  testAmount,
  qrValue,
  qrImage,
  qrImageSrc,
  tranId,
  formattedTime,
  steps,
  orderItems,
  isLoading,
  error,
  paymentStatus,
  isExpired,
  createDynamicQr,
  checkStatus,
  openAbaApp,
} = useQR();

onMounted(() => {
  if (!tranId.value && !isLoading.value) {
    createDynamicQr();
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
:deep(body) {
  font-family: 'Inter', sans-serif;
}
</style>