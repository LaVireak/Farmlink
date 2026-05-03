<template>
  <div class="min-h-screen bg-[#f7fdf4] py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
    <div class="max-w-6xl mx-auto">
      
      <!-- Progress -->
    <div class="flex items-center gap-4 mb-8 text-sm">
      <div class="flex items-center gap-2 text-gray-400">
        <span class="w-6 h-6 flex items-center justify-center rounded-full border">1</span>
        Cart
      </div>
      <div class="flex-1 h-px bg-gray-300"></div>

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


      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <div class="lg:col-span-7">
          <h1 class="text-3xl font-black text-[#0a4d1e] mb-2">Pay with QR Code</h1>
          <p class="text-gray-500 mb-10 max-w-md">
            Complete your harvest order securely using your preferred mobile banking or digital wallet application.
          </p>

          <div class="flex flex-col items-center justify-center mb-12">
            <div class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-6">
              <qrcode-vue 
                :value="qrValue" 
                :size="220" 
                level="H" 
                render-as="svg"
                foreground="#0a4d1e"
              />
            </div>
            <div class="text-center">
              <p class="text-[#0a4d1e] font-bold text-lg mb-1">Farm Link Merchant ID: FL-2024-X9</p>
              <p class="text-gray-400 text-sm font-medium">Expires in {{ formattedTime }}</p>
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
            <button class="w-full bg-[#0a4d1e] text-white py-4 rounded-2xl font-bold hover:bg-[#083d18] transition-all shadow-md active:scale-[0.98]">
              I Have Paid
            </button>
            <button class="w-full bg-white border-2 border-[#0a4d1e] text-[#0a4d1e] py-4 rounded-2xl font-bold hover:bg-[#f7fdf4] transition-all flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload payment screenshot
            </button>
            <button class="w-full text-gray-500 font-bold text-sm pt-2">
              ← Back to Payment Method
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
                <span>$17.00</span>
              </div>
              <div class="flex justify-between text-sm font-semibold text-gray-400">
                <span>Delivery Fee</span>
                <span>$4.00</span>
              </div>
              <div class="flex justify-between items-end pt-4">
                <span class="text-lg font-bold text-[#0a4d1e]">Total Price</span>
                <span class="text-4xl font-black text-[#0a4d1e] tracking-tighter">$21.00</span>
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
  </div>
</template>

<script setup>
import { useQR } from '@/composables/useQR'
import QrcodeVue from 'qrcode.vue'
const { qrValue, formattedTime, steps, orderItems } = useQR();
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
:deep(body) {
  font-family: 'Inter', sans-serif;
}
</style>