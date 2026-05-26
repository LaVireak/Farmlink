<template>
  <CommonAppHeader />

  <div class="bg-[#f7fdf4]">
    <div class="min-h-screen p-4 md:p-8 text-gray-800 max-w-7xl mx-auto">
      
      <!-- Progress -->
      <div class="flex items-center gap-4 mb-8 text-sm">
        <div class="flex items-center gap-2 text-gray-400">
          <span class="w-6 h-6 flex items-center justify-center rounded-full border">1</span>
          Cart
        </div>
        <div class="flex-1 h-px bg-gray-300"></div>

        <div class="flex items-center gap-2 text-green-700 font-semibold">
          <span class="w-6 h-6 flex items-center justify-center rounded-full bg-green-700 text-white">2</span>
          Address
        </div>
        <div class="flex-1 h-px bg-gray-300"></div>

        <div class="flex items-center gap-2 text-gray-400">
          <span class="w-6 h-6 flex items-center justify-center rounded-full border">3</span>
          Payment
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- LEFT: Address Selection -->
        <div class="lg:col-span-7 space-y-6">
          <div class="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50">
            <NuxtLink to="/user/checkout/cart" class="inline-block mb-6 bg-green-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-800 transition no-underline">
              Back to Cart
            </NuxtLink>

            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-[#e8f5e9] rounded-2xl flex items-center justify-center text-[#0a4d1e]">
                <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">location_on</span>
              </div>
              <div>
                <h1 class="text-3xl font-black text-[#0a4d1e]">Select Delivery Address</h1>
                <p class="text-sm text-gray-500 mt-1">Where would you like us to deliver your harvest?</p>
              </div>
            </div>

            <!-- Saved Addresses -->
            <div class="space-y-4">
              <div 
                v-for="address in savedAddresses" :key="address.id"
                @click="selectedAddress = address.id"
                class="flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all group"
                :class="selectedAddress === address.id ? 'border-[#0a4d1e] bg-[#f9fcf7]' : 'border-gray-100 hover:border-gray-200'"
              >
                <div class="pt-1">
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    :class="selectedAddress === address.id ? 'border-[#0a4d1e]' : 'border-gray-300'">
                    <div v-if="selectedAddress === address.id" class="w-2.5 h-2.5 bg-[#0a4d1e] rounded-full"></div>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-1">
                    <span class="material-symbols-outlined text-[#0a4d1e] text-lg" style="font-variation-settings: 'FILL' 1;">{{ address.icon }}</span>
                    <h3 class="font-bold text-[#0a4d1e]">{{ address.title }}</h3>
                    <span v-if="address.isDefault" class="bg-green-100 text-green-700 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ml-auto">Default</span>
                  </div>
                  <p class="text-sm font-medium text-gray-700">{{ address.name }}</p>
                  <p class="text-sm text-gray-500 mt-1 leading-relaxed">{{ address.street }}<br/>{{ address.city }}</p>
                  <p class="text-sm text-gray-500 mt-2 flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">phone</span> {{ address.phone }}
                  </p>
                  <div class="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                    <NuxtLink to="/user/settings/edit-address" class="text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-[#0a4d1e] flex items-center gap-1 transition-colors no-underline" @click.stop>
                      <span class="material-symbols-outlined text-base">edit</span> Edit
                    </NuxtLink>
                    <button type="button" @click.stop="deleteAddress(address.id)" class="text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                      <span class="material-symbols-outlined text-base">delete</span> Delete
                    </button>
                  </div>
                </div>
              </div>

              <!-- Add New Address Button -->
              <NuxtLink to="/user/settings/add-address?returnTo=checkout" class="flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#0a4d1e] hover:bg-[#f9fcf7] transition-all cursor-pointer group no-underline">
                <div class="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-[#e8f5e9] flex items-center justify-center text-gray-400 group-hover:text-[#0a4d1e] transition-colors">
                  <span class="material-symbols-outlined text-xl">add</span>
                </div>
                <div>
                  <h3 class="font-bold text-gray-800 group-hover:text-[#0a4d1e]">Add New Address</h3>
                  <p class="text-xs text-gray-500">Deliver to a different location</p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- RIGHT: Order Summary -->
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

            <NuxtLink :to="checkoutRoute" class="w-full bg-[#0a4d1e] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#083d18] transition-all flex items-center justify-center gap-3 active:scale-95 group no-underline">
              Continue
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </NuxtLink>
            
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
import { ref, computed, h, onMounted } from 'vue';
import { useRoute } from 'vue-router';

definePageMeta({
  middleware: 'user',
  layout: 'user',
});

useHead({
  title: 'Select Address | FarmLink Checkout'
});

const route = useRoute();

const selectedAddress = ref(1);
const selectedPayment = ref('aba_qr');

function deleteAddress(id: number) {
  const index = savedAddresses.value.findIndex(a => a.id === id);
  if (index !== -1) {
    savedAddresses.value.splice(index, 1);
    if (selectedAddress.value === id && savedAddresses.value.length > 0) {
      selectedAddress.value = savedAddresses.value[0].id;
    }
  }
}

// Icon definitions
const CashIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' })
]);
const CardIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' })
]);
const MobileIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' })
]);

const paymentMethods = [
  { id: 'aba_qr', title: 'ABA / Bakong QR', subtitle: 'Dynamic QR with auto confirmation', icon: MobileIcon, bgColor: 'bg-[#0a4d1e]' },
  { id: 'cod', title: 'Cash on Delivery', subtitle: 'Pay at your doorstep', icon: CashIcon, bgColor: 'bg-yellow-600' },
  { id: 'card', title: 'Credit/Debit Card', subtitle: 'Secure online payment', icon: CardIcon, bgColor: 'bg-gray-400' },
  { id: 'mobile', title: 'Mobile Payment', subtitle: 'Apple Pay, Google Pay', icon: MobileIcon, bgColor: 'bg-green-400' }
];

const checkoutRoute = computed(() => {
  if (selectedPayment.value === 'aba_qr') return '/user/checkout/QRPaymentPage';
  if (selectedPayment.value === 'cod') return '/user/checkout/Success';
  return '/user/checkout/payment';
});

const savedAddresses = ref([
  {
    id: 1,
    title: 'Home',
    icon: 'home',
    name: 'Sok Samnang',
    street: 'No. 123, Street 456, Sangkat Boeng Keng Kang I',
    city: 'Khan Chamkarmon, Phnom Penh 120102',
    phone: '+855 12 345 678',
    isDefault: true
  },
  {
    id: 2,
    title: 'Work',
    icon: 'work',
    name: 'Sok Samnang (Harvest Trust HQ)',
    street: 'Exchange Square, Level 15, Street 106',
    city: 'Wat Phnom, Daun Penh, Phnom Penh 120211',
    phone: '+855 98 765 432',
    isDefault: false
  }
]);

onMounted(() => {
  if (route.query.new === '1') {
    savedAddresses.value.push({
      id: 3,
      title: 'Newly Added Address',
      icon: 'location_on',
      name: 'Johnathan Doe',
      street: '123 Orchard Lane',
      city: 'Greenville, Ontario, K1A 0B1',
      phone: '+1 (555) 000-0000',
      isDefault: false
    });
    selectedAddress.value = 3;
  }
});

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
];
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24;
}
</style>
