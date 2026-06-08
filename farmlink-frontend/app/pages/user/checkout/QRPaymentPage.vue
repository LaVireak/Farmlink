<template>
   <CommonAppHeader />
  <div class="min-h-screen bg-[#FDFCFB] font-sans selection:bg-green-100 selection:text-green-900">
    <!-- Subtle Background Element -->
    <div class="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-[#f0f9eb] to-transparent pointer-events-none -z-10"></div>
    
    <div class="min-h-screen p-4 md:p-8 text-gray-800 max-w-7xl mx-auto">
      <!-- Header Section -->
      <header class="mb-6">
        <div>
          <h1 class="text-4xl font-bold text-[#064e3b] tracking-tight">Finalize Your Harvest</h1>
          <p class="text-slate-500 mt-2 font-medium">Order #{{ tranId?.slice(-8) || '...' }} • Secure QR Payment</p>
        </div>
      </header>
      
  <!-- Progress Steps -->
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
   

      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Column: Payment Area -->
        <div class="lg:col-span-7 space-y-8">
          
          <!-- Payment Card -->
          <div class="relative bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(6,78,59,0.08)] border border-green-50 overflow-hidden transition-all hover:shadow-[0_30px_60px_rgba(6,78,59,0.12)]">
            <!-- Simplified Immersive Success Overlay -->
            <div v-if="paymentStatus === 'paid'" class="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 z-50 animate-in fade-in duration-500">
              <!-- Decorative background glow -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-green-50/50 to-emerald-50/50 -z-10"></div>

              <div class="flex flex-col items-center text-center">
                <!-- Checkmark (Centered and resized to avoid clipping) -->
                <div class="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(34,197,94,0.3)] mb-8 animate-in zoom-in duration-700">
                  <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h2 class="text-4xl font-black text-[#064e3b] mb-3 tracking-tight">Payment Success!</h2>
                <p class="text-slate-400 font-bold uppercase text-[11px] tracking-[0.25em]">Your harvest is secured</p>
                
                <div class="mt-12 flex flex-col items-center gap-3">
                  <div class="flex gap-2">
                    <div class="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
                    <div class="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse [animation-delay:200ms]"></div>
                    <div class="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse [animation-delay:400ms]"></div>
                  </div>
                  <p class="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                    Redirecting to Summary...
                  </p>
                </div>
              </div>
            </div>


            
            <div class="p-6 flex flex-col items-center">
              <NuxtLink to="/user/checkout/address" class="self-start mb-4 bg-green-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-800 transition no-underline">
                Change Method
              </NuxtLink>
              
              <!-- QR Section -->
              <div class="relative group">
                <!-- Decorative Frame -->
                <div class="absolute -inset-4 bg-gradient-to-tr from-green-50 to-emerald-50 rounded-[3rem] -z-10 blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <div class="w-[320px] aspect-[3/4] bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
                  
                  <div v-if="isLoading" class="flex flex-col items-center gap-4">
                    <div class="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-xs font-bold text-slate-400 animate-pulse">GENERATING SECURE QR</span>
                  </div>

                  <template v-else>
                    <div v-if="qrImageSrc" class="w-full h-full p-1">
                      <img :src="qrImageSrc" alt="ABA PAY QR" class="w-full h-full object-contain rounded-[1.8rem]" />
                    </div>
                    
                    <div v-else-if="qrValue" class="flex flex-col items-center p-8">
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0e7t318Y28eS2U7u0nNn5V_Vj0e6Xn5W86A&s" alt="ABA PAY" class="h-8 mb-8 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                      <div class="p-4 bg-white rounded-2xl shadow-inner border border-slate-50">
                        <qrcode-vue :value="qrValue" :size="240" level="H" render-as="svg" foreground="#064e3b" />
                      </div>
                      <p class="mt-8 text-[10px] text-slate-400 font-bold text-center leading-relaxed tracking-wider px-4">
                        SCAN WITH ABA MOBILE OR ANY KHQR SUPPORTED BANKING APP
                      </p>
                    </div>

                    <div v-else class="flex flex-col items-center gap-4 p-12 text-center">
                      <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      </div>
                      <h3 class="font-bold text-slate-800">Connection Interrupted</h3>
                      <p class="text-xs text-slate-400">{{ error || 'We couldn\'t load your payment code. Please try again.' }}</p>
                      <button @click="createDynamicQr" class="mt-2 text-green-700 font-black text-xs hover:underline uppercase tracking-widest">Retry Connection</button>
                    </div>
                  </template>
                </div>
              </div>

              <!-- Status Footer -->
              <div v-if="paymentStatus !== 'paid'" class="mt-10 w-full max-w-[320px] flex flex-col items-center">
                <div class="flex items-center gap-2 mb-2">
                  <div :class="['w-2 h-2 rounded-full', isExpired ? 'bg-red-500' : 'bg-green-500 animate-pulse']"></div>
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {{ isExpired ? 'Session Expired' : 'Secure Session Active' }}
                  </span>
                </div>
                <div class="text-2xl font-black text-[#064e3b] tabular-nums">
                  {{ isExpired ? '00:00' : formattedTime }}
                </div>
                <div v-if="isExpired" class="mt-4">
                  <button @click="createDynamicQr" class="px-6 py-2 bg-green-700 text-white text-xs font-black rounded-full shadow-lg hover:bg-green-800 transition-all uppercase tracking-widest">
                    Renew Payment Session
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div v-if="paymentStatus !== 'paid'" class="w-full">
            <button 
              @click="checkStatus"
              :disabled="isLoading || !tranId"
              class="w-full group relative overflow-hidden bg-[#064e3b] text-white p-6 rounded-[2rem] font-bold transition-all shadow-xl shadow-green-100 hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
            >
              <div class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div class="relative flex flex-col items-center">
                <svg class="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span class="text-xs uppercase tracking-[0.2em] font-black">Refresh Payment Status</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Right Column: Sidebar -->
        <div class="lg:col-span-5 space-y-8">
          
          <!-- Order Summary Receipt -->
          <div class="relative">
            <!-- Receipt Jagged Edge Effect -->
            <div class="absolute -bottom-2 left-4 right-4 h-4 bg-white shadow-lg -z-10 rounded-b-xl"></div>
            
            <div class="bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-50 relative overflow-hidden">
              <div class="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <svg class="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
              </div>

              <div class="flex justify-between items-center mb-10">
                <h2 class="text-2xl font-black text-[#064e3b]">Harvest Details</h2>
                <div class="bg-green-50 px-3 py-1 rounded-full">
                  <span class="text-[10px] font-black text-green-700 tracking-tighter uppercase">{{ orderItems.length }} Items</span>
                </div>
              </div>

              <div class="space-y-8 mb-10">
                <div v-for="item in orderItems" :key="item.id" class="flex items-center gap-4 group">
                  <div class="relative">
                    <div class="absolute inset-0 bg-green-200 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform -z-10 opacity-30"></div>
                    <img :src="item.image" :alt="item.name" class="w-16 h-16 rounded-2xl object-cover shadow-sm bg-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-slate-800 truncate">{{ item.name }}</h3>
                    <p class="text-xs text-slate-400 font-bold uppercase tracking-tight">{{ item.qty }} × ${{ item.unitPrice.toFixed(2) }}</p>
                  </div>
                  <span class="font-black text-slate-800 text-lg">${{ (item.qty * item.unitPrice).toFixed(2) }}</span>
                </div>
              </div>

              <div class="space-y-4 pt-8 border-t border-slate-50">
                <div class="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>${{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Delivery Fee</span>
                  <span>${{ deliveryFee.toFixed(2) }}</span>
                </div>
                
                <div class="pt-6">
                  <div class="flex justify-between items-end">
                    <div>
                      <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">Total Harvest Amount</span>
                      <span class="text-4xl font-black text-[#064e3b] tracking-tighter tabular-nums">${{ totalAmount.toFixed(2) }}</span>
                    </div>
                    <span class="text-xs font-black text-slate-400 mb-2">USD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Information Panel -->
          <div class="bg-[#f0f9eb] rounded-[2rem] p-8 border border-green-100">
            <h4 class="text-sm font-black text-green-800 uppercase tracking-widest mb-4">How it works</h4>
            <div class="space-y-4">
              <div v-for="(step, index) in steps" :key="index" class="flex gap-4">
                <div class="flex-shrink-0 w-6 h-6 bg-white text-green-700 rounded-lg flex items-center justify-center font-black text-[10px] shadow-sm">
                  {{ index + 1 }}
                </div>
                <p class="text-xs font-semibold text-green-800/70 leading-relaxed">{{ step }}</p>
              </div>
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
      <span class="font-bold text-sm">Payment successfully processed!</span>
    </div>
  </div>
   <CommonAppFooter />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useQR } from '@/composables/useQR'
import QrcodeVue from 'qrcode.vue'

definePageMeta({
  middleware: 'user',
  layout: 'user',
});

const {
  testAmount,
  subtotal,
  deliveryFee,
  totalAmount,
  qrValue,
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

// Watch for payment success and navigate to Success page
watch(paymentStatus, (newStatus) => {
  if (newStatus === 'paid') {
    setTimeout(() => {
      navigateTo('/user/checkout/Success')
    }, 2500) // 2.5s delay to let the user see the success state
  }
})

onMounted(() => {
  if (!tranId.value && !isLoading.value) {
    createDynamicQr();
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;600;800;900&display=swap');

:deep(body) {
  font-family: 'Outfit', 'Inter', sans-serif;
}

.bg-dashed {
  background-image: linear-gradient(to right, #e2e8f0 50%, rgba(255, 255, 255, 0) 0%);
  background-position: top;
  background-size: 10px 1px;
  background-repeat: repeat-x;
}

/* Smooth Scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Custom Animation for QR appearance */
@keyframes qrFadeIn {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.qr-animate {
  animation: qrFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>