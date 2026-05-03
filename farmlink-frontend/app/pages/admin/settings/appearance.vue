<template>
  <div class="min-h-screen bg-[#f7fdf4] flex font-sans text-slate-900">
    <aside class="w-64 bg-white border-r border-gray-100 flex flex-col p-6 sticky top-0 h-screen">
      <div class="flex items-center gap-2 mb-10 px-2">
        <div class="w-8 h-8 bg-[#00c853] rounded-lg flex items-center justify-center text-white">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <span class="text-xl font-black text-[#0a4d1e] tracking-tight">FarmLink</span>
      </div>

      <nav class="space-y-2 flex-1">
        <a v-for="item in navItems" :key="item.name" href="#" 
           class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all"
           :class="item.active ? 'bg-[#0a4d1e] text-white shadow-lg shadow-green-900/20' : 'text-gray-400 hover:bg-gray-50 hover:text-[#0a4d1e]'">
          <component :is="item.icon" class="w-5 h-5" />
          {{ item.name }}
        </a>
      </nav>

      <div class="bg-[#f9fcf7] rounded-3xl p-5 border border-gray-100 space-y-4">
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Status Overview</p>
        <div v-for="status in statusOverview" :key="status.label" class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div :class="status.bg" class="w-8 h-8 rounded-full flex items-center justify-center">
              <component :is="status.icon" class="w-4 h-4" :class="status.text" />
            </div>
            <div>
              <p class="text-[11px] font-bold text-gray-800 leading-tight">{{ status.label }}</p>
              <p class="text-[9px] text-gray-400">{{ status.sub }}</p>
            </div>
          </div>
          <span class="text-sm font-black text-gray-800" :class="status.label === 'System Health' ? 'text-green-500' : ''">
            {{ status.value }}
          </span>
        </div>
      </div>
    </aside>

    <main class="flex-1 p-10">
      <header class="flex justify-between items-center mb-10">
        <h1 class="text-3xl font-black text-[#0a4d1e]">Setting Profile</h1>
        <div class="flex items-center gap-6">
          <div class="relative">
            <input type="text" placeholder="Search" class="bg-white border-none rounded-xl py-3 pl-12 pr-6 w-80 shadow-sm text-sm focus:ring-2 focus:ring-[#0a4d1e]/10" />
            <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <button class="relative p-2 text-gray-400 hover:text-[#0a4d1e]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f7fdf4]"></span>
          </button>
          <div class="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer group">
            <img src="https://i.pravatar.cc/100?img=12" class="w-10 h-10 rounded-full border-2 border-white shadow-md" />
            <div class="text-left">
              <p class="text-sm font-black text-gray-800 flex items-center gap-1">
                Channary Sok
                <svg class="w-4 h-4 text-gray-400 group-hover:text-[#0a4d1e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
              </p>
            </div>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-12 gap-10">
        <div class="col-span-3 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 h-fit">
          <nav class="space-y-1">
            <a v-for="sub in settingsNav" :key="sub.name" href="#" 
               class="block px-6 py-4 rounded-2xl font-bold text-sm transition-all"
               :class="sub.active ? 'bg-[#0a4d1e] text-white' : 'text-gray-400 hover:text-[#0a4d1e]'">
              {{ sub.name }}
            </a>
          </nav>
        </div>

        <div class="col-span-9 bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-50">
          <h2 class="text-2xl font-black text-[#0a4d1e] mb-10">Appearance</h2>

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

const activeTheme = ref('light')
const selectedCurrency = ref('usd')

const navItems = [
  { name: 'Dashboard', icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-5 h-5' }, [h('path', { 'stroke-width': '2', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' })]), active: false },
  { name: 'Order', icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-width': '2', d: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' })]), active: false },
  { name: 'Product', icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-width': '2', d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' })]), active: false },
  { name: 'User', icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-width': '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197' })]), active: false },
  { name: 'Farmer', icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })]), active: false },
  { name: 'Setting Profile', icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }), h('circle', { cx: '12', cy: '12', r: '3', 'stroke-width': '2' })]), active: true },
]

const settingsNav = [
  { name: 'Personal Info', active: false },
  { name: 'Security', active: false },
  { name: 'Notifications', active: false },
  { name: 'Appearance', active: true },
  { name: 'Team', active: false },
]

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