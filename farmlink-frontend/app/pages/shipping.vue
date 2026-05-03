<template>
  <div class="min-h-screen bg-[#f7fdf4] py-8 px-6 lg:px-16 font-sans text-slate-900">
    <div class="max-w-none w-full mx-auto">
      
      <nav class="flex items-center justify-center space-x-4 mb-12 text-sm font-medium">
        <div class="flex items-center text-gray-400">
          <span class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center mr-2 text-xs">1</span>
          Cart
        </div>
        <div class="h-px w-12 bg-gray-200"></div>
        <div class="flex items-center text-[#0a4d1e] font-bold">
          <span class="w-6 h-6 rounded-full bg-[#0a4d1e] text-white flex items-center justify-center mr-2 text-xs">2</span>
          <span class="border-b-2 border-[#0a4d1e] pb-0.5">Shipping</span>
        </div>
        <div class="h-px w-12 bg-gray-200"></div>
        <div class="flex items-center text-gray-400">
          <span class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center mr-2 text-xs">3</span>
          Payment
        </div>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <div class="lg:col-span-8 space-y-8">
          
          <div class="bg-white rounded-[2.5rem] p-10 lg:p-14 shadow-sm border border-gray-50">
            <div class="flex items-center gap-4 mb-10">
              <div class="w-12 h-12 bg-[#e8f5e9] rounded-2xl flex items-center justify-center text-[#0a4d1e]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <h1 class="text-3xl lg:text-4xl font-black text-[#0a4d1e]">Shipping Information</h1>
            </div>

            <form class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input label="Full Name" v-model="form.name" />
                <Input label="Phone Number" v-model="form.phone" />
              </div>

              <Input label="Email Address" v-model="form.email" />
              <Input label="Street Address" v-model="form.address" />

              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Input label="City" v-model="form.city" />

                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-4">Province</label>
                  <select
                    v-model="form.province"
                    class="w-full bg-[#f9fcf7] border-none rounded-full py-4 px-8 text-[#0a4d1e] font-bold focus:ring-2 focus:ring-[#0a4d1e]/10 appearance-none select-custom"
                  >
                    <option>Ontario</option>
                    <option>Quebec</option>
                    <option>British Columbia</option>
                  </select>
                </div>

                <Input label="Postal Code" v-model="form.postal" />
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-4">Delivery Notes (Optional)</label>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  placeholder="Gate code is 1234, please leave by the front porch."
                  class="w-full bg-[#f9fcf7] border-none rounded-[2rem] py-5 px-8 text-[#0a4d1e] font-bold focus:ring-2 focus:ring-[#0a4d1e]/10"
                />
              </div>
            </form>
          </div>

          <div class="rounded-[3rem] h-64 lg:h-80 overflow-hidden relative shadow-lg group">
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600" 
              class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              alt="Farm fields"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>

        <div class="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
          <div class="bg-white rounded-[2.5rem] shadow-xl p-8 border border-gray-50">
            <h3 class="text-2xl font-black text-[#0a4d1e] mb-8">Order Summary</h3>

            <div class="space-y-6 mb-8">
              <div v-for="item in cart" :key="item.id" class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 rounded-full bg-gray-100 overflow-hidden">
                    <div class="w-full h-full bg-green-100 flex items-center justify-center text-green-800 font-bold">
                      {{ item.name[0] }}
                    </div>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-800 leading-tight">{{ item.name }}</h3>
                    <p class="text-xs text-gray-400 font-medium">{{ item.variant }} × {{ item.quantity }}</p>
                  </div>
                </div>
                <span class="font-black text-[#0a4d1e]">${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>

            <div class="space-y-3 pt-6 border-t border-gray-100 mb-8">
              <div class="flex justify-between text-sm font-semibold text-gray-400">
                <span>Subtotal</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm font-semibold text-gray-400">
                <span>Delivery Fee</span>
                <span>${{ deliveryFee.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-end pt-4">
                <span class="text-lg font-bold text-[#0a4d1e]">Total Price</span>
                <span class="text-4xl font-black text-[#0a4d1e] tracking-tighter">${{ total.toFixed(2) }}</span>
              </div>
            </div>

            <div class="space-y-4 mb-8">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Payment Method</p>
              
              <label v-for="option in paymentOptions" :key="option.value" 
                class="flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all"
                :class="selectedPayment === option.value ? 'border-[#0a4d1e] bg-[#f7fdf4]' : 'border-gray-100 hover:border-gray-200'"
              >
                <div>
                  <p class="font-bold text-sm text-[#0a4d1e] leading-tight">{{ option.label }}</p>
                  <p class="text-[10px] text-gray-400 font-medium">{{ option.desc }}</p>
                </div>
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  :class="selectedPayment === option.value ? 'border-[#0a4d1e]' : 'border-gray-200'"
                >
                  <div v-if="selectedPayment === option.value" class="w-2.5 h-2.5 bg-[#0a4d1e] rounded-full"></div>
                </div>
                <input type="radio" :value="option.value" v-model="selectedPayment" class="hidden" />
              </label>
            </div>

            <button class="w-full bg-[#0a4d1e] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-[#083d18] transition-all flex items-center justify-center gap-3 group active:scale-95">
              Place Order
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Your existing state logic
interface CartItem {
  id: number
  name: string
  variant: string
  price: number
  quantity: number
}

// Example cart data if cart state is empty
const cart = useState<CartItem[]>('cart', () => [
  { id: 1, name: 'Heirloom Tomatoes', variant: '1.5kg', price: 4.50, quantity: 1 },
  { id: 2, name: 'Organic Curly Kale', variant: '2 Bunches', price: 3.00, quantity: 2 },
  { id: 3, name: 'Baby Dutch Carrots', variant: '1 Bag', price: 4.25, quantity: 1 }
])

const form = reactive({
  name: 'Johnathan Doe',
  phone: '+1(555)000-0000',
  email: 'john@harvest.com',
  address: '123 Orchard Lane',
  city: 'Greenville',
  province: 'Ontario',
  postal: 'K1A 0B1',
  notes: ''
})

const selectedPayment = ref('card')

const paymentOptions = [
  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay at your doorstep' },
  { value: 'card', label: 'Credit/Debit Card', desc: 'Secure online payment' },
  { value: 'mobile', label: 'Mobile Payment', desc: 'Apple Pay, Google Pay' }
]

const subtotal = computed(() => cart.value?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0)
const deliveryFee = 5.00
const total = computed(() => subtotal.value + deliveryFee)
</script>

<script lang="ts">
export default {
  components: {
    Input: {
      props: ['modelValue', 'label'],
      emits: ['update:modelValue'],
      template: `
        <div>
          <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-4">{{ label }}</label>
          <input
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            class="w-full bg-[#f9fcf7] border-none rounded-full py-4 px-8 text-[#0a4d1e] font-bold focus:ring-2 focus:ring-[#0a4d1e]/10 outline-none"
          />
        </div>
      `
    }
  }
}
</script>

<style scoped>
/* Custom styling for the dropdown arrow to match the design */
.select-custom {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%230a4d1e' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 1.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}
</style>