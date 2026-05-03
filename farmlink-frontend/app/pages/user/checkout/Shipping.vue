<template>
  <div class="min-h-screen bg-[#f7fdf4] py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
    
       <!-- Progress -->
    <div class="flex items-center gap-4 mb-8 text-sm">
      <div class="flex items-center gap-2 text-gray-400">
        <span class="w-6 h-6 flex items-center justify-center rounded-full border">1</span>
        Cart
      </div>
      <div class="flex-1 h-px bg-gray-300"></div>

      <div class="flex items-center gap-2 text-gray-400">
        <span class="w-6 h-6 flex items-center justify-center rounded-full bg-green-700 text-white">2</span>
        Shipping
      </div>
      <div class="flex-1 h-px bg-gray-300"></div>

      <div class="flex items-center gap-2 text-green-700 font-semibold">
        <span class="w-6 h-6 flex items-center justify-center rounded-full border">3</span>
        Payment
      </div>
    </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <div class="lg:col-span-7 space-y-8">
          
          <div class="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-[#e8f5e9] rounded-2xl flex items-center justify-center text-[#0a4d1e]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 class="text-3xl font-black text-[#0a4d1e]">Shipping Information</h1>
            </div>

            <form class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">Full Name</label>
                  <input v-model="form.name" type="text" class="w-full bg-[#f9fcf7] border-none rounded-full py-4 px-6 text-[#0a4d1e] font-bold focus:ring-2 focus:ring-[#0a4d1e]/10" />
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">Phone Number</label>
                  <input v-model="form.phone" type="text" class="w-full bg-[#f9fcf7] border-none rounded-full py-4 px-6 text-[#0a4d1e] font-bold focus:ring-2 focus:ring-[#0a4d1e]/10" />
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">Email Address</label>
                <input v-model="form.email" type="email" class="w-full bg-[#f9fcf7] border-none rounded-full py-4 px-6 text-[#0a4d1e] font-bold focus:ring-2 focus:ring-[#0a4d1e]/10" />
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">Street Address</label>
                <input v-model="form.address" type="text" class="w-full bg-[#f9fcf7] border-none rounded-full py-4 px-6 text-[#0a4d1e] font-bold focus:ring-2 focus:ring-[#0a4d1e]/10" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="md:col-span-1">
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">City</label>
                  <input v-model="form.city" type="text" class="w-full bg-[#f9fcf7] border-none rounded-full py-4 px-6 text-[#0a4d1e] font-bold focus:ring-2 focus:ring-[#0a4d1e]/10" />
                </div>
                <div class="md:col-span-1">
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">Province</label>
                  <select v-model="form.province" class="w-full bg-[#f9fcf7] border-none rounded-full py-4 px-6 text-[#0a4d1e] font-bold focus:ring-2 focus:ring-[#0a4d1e]/10 appearance-none">
                    <option>Ontario</option>
                    <option>Quebec</option>
                    <option>British Columbia</option>
                  </select>
                </div>
                <div class="md:col-span-1">
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">Postal Code</label>
                  <input v-model="form.postalCode" type="text" class="w-full bg-[#f9fcf7] border-none rounded-full py-4 px-6 text-[#0a4d1e] font-bold focus:ring-2 focus:ring-[#0a4d1e]/10" />
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-4">Delivery Notes (Optional)</label>
                <textarea v-model="form.notes" rows="3" placeholder="Gate code is 1234, please leave by the front porch..." class="w-full bg-[#f9fcf7] border-none rounded-[2rem] py-4 px-6 text-[#0a4d1e] font-bold focus:ring-2 focus:ring-[#0a4d1e]/10"></textarea>
              </div>
            </form>
          </div>

          <div class="rounded-[2.5rem] h-64 overflow-hidden relative shadow-lg group">
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000" 
              class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          </div>
        </div>

        <div class="lg:col-span-5 space-y-6">
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
                <span>$17.00</span>
              </div>
              <div class="flex justify-between text-sm font-semibold text-gray-400">
                <span>Delivery Fee</span>
                <span>$5.00</span>
              </div>
              <div class="flex justify-between items-end pt-4">
                <span class="text-lg font-bold text-[#0a4d1e]">Total Price</span>
                <span class="text-4xl font-black text-[#0a4d1e] tracking-tighter">$21.00</span>
              </div>
            </div>

            <div class="space-y-4 mb-8">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Payment Method</p>
              
              <div v-for="method in paymentMethods" :key="method.id" 
                @click="selectedPayment = method.id"
                class="flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all"
                :class="selectedPayment === method.id ? 'border-[#0a4d1e] bg-[#f7fdf4]' : 'border-gray-100 hover:border-gray-200'">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white" :class="method.bgColor">
                    <component :is="method.icon" class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="font-bold text-sm text-[#0a4d1e] leading-tight">{{ method.title }}</p>
                    <p class="text-[10px] text-gray-400 font-medium">{{ method.subtitle }}</p>
                  </div>
                </div>
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  :class="selectedPayment === method.id ? 'border-[#0a4d1e]' : 'border-gray-200'">
                  <div v-if="selectedPayment === method.id" class="w-2.5 h-2.5 bg-[#0a4d1e] rounded-full"></div>
                </div>
              </div>
            </div>

            <button class="w-full bg-[#0a4d1e] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#083d18] transition-all flex items-center justify-center gap-3 active:scale-95 group">
              Place Order
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
            <p class="text-[9px] text-center mt-4 text-gray-400 font-bold uppercase tracking-widest px-4 leading-relaxed">
              By clicking "Place Order", you agree to FarmLink's Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>

</template>

<script setup>
import { h } from 'vue'

const selectedPayment = ref('cod')

const form = reactive({
  name: 'Johnathan Doe',
  phone: '+1 (555) 000-0000',
  email: 'john@harvest.com',
  address: '123 Orchard Lane',
  city: 'Greenville',
  province: 'Ontario',
  postalCode: 'K1A 0B1',
  notes: ''
})

const summaryItems = [
  {
    name: 'Heirloom Tomatoes',
    details: '1.5kg x $4.50',
    price: 6.75,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'Organic Curly Kale',
    details: '2 Bunches x $3.00',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1524179524541-10d54f5903da?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'Baby Dutch Carrots',
    details: '1 Bag x $4.25',
    price: 4.25,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=200'
  }
]

// Icon definitions
const CashIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' })
])
const CardIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' })
])
const MobileIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' })
])

const paymentMethods = [
  { id: 'cod', title: 'Cash on Delivery', subtitle: 'Pay at your doorstep', icon: CashIcon, bgColor: 'bg-yellow-600' },
  { id: 'card', title: 'Credit/Debit Card', subtitle: 'Secure online payment', icon: CardIcon, bgColor: 'bg-gray-400' },
  { id: 'mobile', title: 'Mobile Payment', subtitle: 'Apple Pay, Google Pay', icon: MobileIcon, bgColor: 'bg-green-400' }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

:deep(body) {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%230a4d1e' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 1.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}
</style>