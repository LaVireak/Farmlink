<template>
  <div class="min-h-screen bg-[#f7fdf4] flex font-sans text-slate-900">
    <main class="flex-1 p-10">
      <AdminProfileDropdown/>
      <div class="grid grid-cols-12 gap-10">
        <div class="col-span-9 bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-50">
          <h2 class="text-2xl font-black text-[#15803d] mb-10">Appearance</h2>

          <div class="space-y-12">
            <div>
              <p class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Theme Selector</p>
              <div class="grid grid-cols-3 gap-6">
                <div v-for="theme in themes" :key="theme.id" 
                     @click="activeTheme = theme.id"
                     class="cursor-pointer group">
                  <div class="relative aspect-video rounded-3xl overflow-hidden border-4 transition-all"
                       :class="activeTheme === theme.id ? 'border-[#00c853]' : 'border-gray-100 group-hover:border-gray-200'">
                    <img :src="theme.preview" class="w-full h-full object-cover" />
                    <div v-if="activeTheme === theme.id" class="absolute top-3 right-3 w-6 h-6 bg-[#00c853] rounded-full flex items-center justify-center text-white">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                    </div>
                  </div>
                  <p class="text-center mt-4 text-xs font-black uppercase tracking-widest" :class="activeTheme === theme.id ? 'text-[#0a4d1e]' : 'text-gray-400'">
                    {{ theme.name }}
                  </p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-x-12 gap-y-10">
              <div>
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Language</label>
                <select class="w-full bg-[#f9fcf7] border-none rounded-2xl py-4 px-6 font-bold text-[#0a4d1e] focus:ring-2 focus:ring-[#0a4d1e]/10 appearance-none select-custom">
                  <option>English (US)</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Date & Time Format</label>
                  <select class="w-full bg-[#f9fcf7] border-none rounded-2xl py-4 px-6 font-bold text-[#0a4d1e] select-custom">
                    <option>Jan 17, 2024</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Time Style</label>
                  <select class="w-full bg-[#f9fcf7] border-none rounded-2xl py-4 px-6 font-bold text-[#0a4d1e] select-custom">
                    <option>Time - 09:30</option>
                  </select>
                </div>
              </div>

              <div class="col-span-2">
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-6 ml-2">Currency display</label>
                <div class="flex flex-wrap gap-8">
                  <label v-for="cur in currencies" :key="cur.id" class="flex items-center gap-3 cursor-pointer group">
                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                         :class="selectedCurrency === cur.id ? 'border-[#0a4d1e]' : 'border-gray-200 group-hover:border-gray-300'">
                      <div v-if="selectedCurrency === cur.id" class="w-2.5 h-2.5 bg-[#0a4d1e] rounded-full"></div>
                    </div>
                    <input type="radio" :value="cur.id" v-model="selectedCurrency" class="hidden" />
                    <span class="text-sm font-bold text-gray-600 transition-colors" :class="selectedCurrency === cur.id ? 'text-[#0a4d1e]' : ''">
                      {{ cur.name }}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-6">
              <button class="bg-[#0a4d1e] text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-green-900/20 hover:bg-[#083d18] transition-all active:scale-95">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { h } from 'vue'

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const activeTheme = ref('light')
const selectedCurrency = ref('usd')

const themes = [
  { id: 'light', name: 'Light Mode', preview: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=400' },
  { id: 'dark', name: 'Dark Mode', preview: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400' },
  { id: 'system', name: 'System Mode', preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400' }
]

const currencies = [
  { id: 'usd', name: 'USD - US Dollar' },
  { id: 'gw', name: 'USD - GW Dollar' },
  { id: 'eur', name: 'EUR - Dollar' },
  { id: 'cham', name: 'USD - Chamany display' }
]

const statusOverview = [
  { label: 'Live Deliveries', sub: '24 deliveries', value: '24', icon: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [h('path', { d: 'M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' })]), bg: 'bg-[#e8f5e9]', text: 'text-green-600' },
  { label: 'Pending Orders', sub: '12 pending orders', value: '12', icon: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [h('path', { d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' })]), bg: 'bg-[#fff8e1]', text: 'text-yellow-600' },
  { label: 'System Health', sub: 'Good', value: 'Good', icon: () => h('svg', { fill: 'currentColor', viewBox: '0 0 20 20' }, [h('path', { d: 'M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' })]), bg: 'bg-[#e3f2fd]', text: 'text-blue-600' }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

:deep(body) {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.select-custom {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%230a4d1e' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 1.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

/* Custom Scrollbar for sidebar */
aside::-webkit-scrollbar {
  width: 4px;
}
aside::-webkit-scrollbar-thumb {
  background: #f1f1f1;
  border-radius: 10px;
}
</style>