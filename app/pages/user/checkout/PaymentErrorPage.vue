<template>
  <div class="min-h-screen bg-[#f7fdf4] py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900 flex items-center justify-center">
    <div class="max-w-3xl w-full mx-auto">
      
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 relative">
          <div class="absolute inset-0 rounded-full bg-red-100 blur-xl opacity-50"></div>
          <svg class="w-10 h-10 text-red-600 relative z-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </div>
        <h1 class="text-4xl font-extrabold text-[#1a1a1a] mb-4 tracking-tight">
          Payment Unsuccessful
        </h1>
        <p class="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
          We couldn’t process your payment. Please check your card details or try a 
          different payment method to complete your harvest order.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-12">
        
        <div class="bg-[#adb3a6] rounded-[2.5rem] p-8 shadow-sm">
          <div class="flex items-center gap-2 mb-6">
            <div class="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
              <div class="w-2.5 h-0.5 bg-white"></div>
            </div>
            <h2 class="font-bold text-[#2d3326] tracking-tight">Technical Insight</h2>
          </div>

          <div class="space-y-6">
            <div>
              <p class="text-[10px] font-black text-[#5e6656] uppercase tracking-[0.2em] mb-2">Error Code</p>
              <span class="inline-block bg-white/50 px-3 py-1 rounded-md text-red-700 font-mono text-xs font-bold">
                CC_DECLINED
              </span>
            </div>
            
            <div>
              <p class="text-[10px] font-black text-[#5e6656] uppercase tracking-[0.2em] mb-1">Reason</p>
              <p class="text-sm font-semibold text-[#2d3326]">
                Insufficient Funds or Incorrect Card Info
              </p>
            </div>
          </div>
        </div>

        <div class="bg-[#0a4d1e] text-white rounded-[2.5rem] p-8 shadow-lg flex flex-col justify-between">
          <h2 class="text-xl font-bold mb-6">Pending Order</h2>

          <div class="space-y-4">
            <div class="flex justify-between items-center text-sm">
              <span class="opacity-70">Subtotal</span>
              <span class="font-bold tracking-wide">$84.20</span>
            </div>
            <div class="flex justify-between items-center text-sm border-t border-white/10 pt-4">
              <span class="opacity-70">Delivery</span>
              <span class="font-bold text-[#86efac] tracking-widest">FREE</span>
            </div>
            <div class="flex justify-between items-end pt-4">
              <span class="text-sm opacity-90 font-bold">Total Amount</span>
              <span class="text-3xl font-black tracking-tight">$84.20</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-8">
        <button class="bg-[#0a4d1e] text-white px-10 py-4 rounded-full font-bold hover:bg-[#083d18] transition-all flex items-center gap-3 shadow-md active:scale-95">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retry Payment
        </button>
        <NuxtLink to="/cart" class="text-[#0a4d1e] font-bold text-sm hover:underline decoration-2 underline-offset-4">
          Back to Cart
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
// Props or Data could be passed here for dynamic error handling
defineProps({
  errorCode: {
    type: String,
    default: 'CC_DECLINED'
  },
  orderTotal: {
    type: Number,
    default: 84.20
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

:deep(body) {
  font-family: 'Inter', sans-serif;
}
</style>