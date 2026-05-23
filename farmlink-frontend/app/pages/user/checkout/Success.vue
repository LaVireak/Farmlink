<template>
  <div class="min-h-screen bg-[#f7fdf4] py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
    <div class="max-w-3xl mx-auto">
      
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-[#d1f0d1] rounded-full mb-6">
          <svg class="w-8 h-8 text-[#0a4d1e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-4xl font-extrabold text-[#0a4d1e] mb-3 tracking-tight">
          Harvest Success!
        </h1>
        <p class="text-gray-600 text-lg">
          Thank you, <span class="font-semibold">{{ customerName }}</span>! Your order 
          <span class="bg-[#e8f5e9] px-2 py-0.5 rounded text-[#2e7d32] font-mono">#FL-8821</span> 
          is being prepared by our local farmers.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        <div class="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-[#0a4d1e]">Your Harvest</h2>
            <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">{{ items.length }} Items</span>
          </div>

          <div class="space-y-6">
            <div v-for="item in items" :key="item.name" class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <img :src="item.image" :alt="item.name" class="w-16 h-16 rounded-full object-cover bg-gray-100" />
                <div>
                  <h3 class="font-bold text-gray-800">{{ item.name }}</h3>
                  <p class="text-xs text-gray-500">{{ item.desc }}</p>
                </div>
              </div>
              <span class="font-bold text-gray-700">${{ item.price.toFixed(2) }}</span>
            </div>
          </div>

          <hr class="my-6 border-gray-100" />

          <div class="space-y-3 text-sm">
            <div class="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>$7.75</span>
            </div>
            <div class="flex justify-between text-gray-500">
              <span>Delivery Fee</span>
              <span>$2.00</span>
            </div>
            <div class="flex justify-between text-xl font-extrabold text-[#0a4d1e] pt-2">
              <span>Total Paid</span>
              <span>$9.75</span>
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
              <p class="text-sm leading-relaxed opacity-90">
                123 Orchard Lane,<br />
                Green Valley, GV 90210
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
            <button class="w-full bg-[#0a4d1e] text-white py-4 rounded-full font-bold hover:bg-[#083d18] transition-colors flex items-center justify-center gap-2 group">
              Track Your Harvest
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <NuxtLink to="/" class="text-[#0a4d1e] font-bold text-sm hover:underline decoration-2">
              Return to Market
            </NuxtLink>
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
</template>

<script setup>
const customerName = ref('Johnathan')

const items = ref([
  {
    name: 'Heirloom Carrots',
    desc: 'Bundled Fresh • 1lb',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'Organic Kale',
    desc: 'Local Harvest • 1 Bunch',
    price: 3.25,
    image: 'https://images.unsplash.com/photo-1524179524541-10d54f5903da?auto=format&fit=crop&q=80&w=200'
  }
])
</script>

<style scoped>
/* Optional: Custom font import if you have a specific one in mind */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

:deep(body) {
  font-family: 'Inter', sans-serif;
}
</style>