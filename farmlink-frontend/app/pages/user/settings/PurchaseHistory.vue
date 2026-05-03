<template>
  <div class="min-h-screen bg-[#f7fdf4] py-12 px-6 lg:px-16 font-sans text-slate-900">
    <div class="max-w-none w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      <aside class="lg:col-span-3">
        <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 flex flex-col items-start">
          <div class="flex items-center gap-4 mb-10">
            <div class="w-16 h-16 rounded-full bg-[#00c853] flex items-center justify-center overflow-hidden border-4 border-[#f7fdf4] shadow-md">
              <img src="https://i.pravatar.cc/150?u=sophan" alt="Sophal Saman" />
            </div>
            <div>
              <h2 class="text-xl font-black text-[#0a4d1e]">Sophal Saman</h2>
              <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Premium Member</p>
            </div>
          </div>

          <CommonAppHeader />
        </div>
      </aside>

      <main class="lg:col-span-9 space-y-8">
        
        <div class="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-50 relative overflow-hidden">
          <div class="relative z-10">
            <span class="inline-block bg-[#e8f5e9] text-[#0a4d1e] text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
              Account Overview
            </span>
            <h1 class="text-5xl font-black text-[#0a4d1e] mb-6">Purchase History</h1>
            <p class="max-w-xl text-gray-500 font-medium leading-relaxed">
              Track your recent orders from local Cambodian farms and manage your harvest subscriptions.
            </p>
          </div>
          <div class="absolute right-0 top-0 h-full opacity-10 pointer-events-none">
             <svg class="h-full w-auto" viewBox="0 0 100 100" fill="currentColor"><path d="M50 0C50 0 50 50 0 50C50 50 50 100 100 100C100 100 100 50 50 50C100 50 100 0 50 0Z"/></svg>
          </div>
        </div>

        <div class="space-y-6">
          <div v-for="order in orders" :key="order.id" 
               class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50 flex items-center justify-between group hover:shadow-md transition-shadow">
            
            <div class="flex items-center gap-8">
              <div :class="order.color" class="w-24 h-24 rounded-[2rem] flex items-center justify-center p-3 shadow-inner">
                <img :src="order.image" class="w-full h-full object-contain rounded-xl" />
              </div>

              <div>
                <div class="flex items-center gap-3 mb-2">
                  <span :class="order.statusClass" class="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    {{ order.status }}
                  </span>
                  <span class="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    Order {{ order.id }}
                  </span>
                </div>
                <h3 class="text-2xl font-black text-[#0a4d1e] mb-1">{{ order.farmName }}</h3>
                <p class="text-sm text-gray-400 font-bold">
                  {{ order.date }} • {{ order.items }} items
                </p>
              </div>
            </div>

            <div class="flex items-center gap-12 text-right">
              <div>
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                <p class="text-3xl font-black text-[#0a4d1e] tracking-tighter" :class="{'opacity-40': order.status === 'CANCELLED'}">
                  ${{ order.total }}
                </p>
              </div>
              <button class="bg-white border-2 border-gray-100 text-gray-500 hover:border-[#0a4d1e] hover:text-[#0a4d1e] px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2">
                View Details
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4 pt-10">
          <div class="flex-1 h-px bg-gray-100"></div>
          <button class="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-[#0a4d1e] transition-colors">
            Load More Traditions
          </button>
          <div class="flex-1 h-px bg-gray-100"></div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'

const navItems = [
  { name: 'Profile Info', active: false, icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-5 h-5' }, [h('path', { 'stroke-width': '2', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })]) },
  { name: 'Edit Profile', active: false, icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-width': '2', d: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' })]) },
  { name: 'Purchase History', active: true, icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' })]) },
  { name: 'Addresses', active: false, icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-width': '2', d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' })]) },
  { name: 'Payment Methods', active: false, icon: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-width': '2', d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' })]) },
]

const orders = [
  {
    id: '#FL-0021',
    farmName: 'Chrey Bak Community Farm',
    date: 'March 14, 2024',
    items: 4,
    total: '42.50',
    status: 'COMPLETED',
    statusClass: 'bg-[#00c853] text-white',
    color: 'bg-[#436423]',
    image: 'https://cdn-icons-png.flaticon.com/512/135/135620.png'
  },
  {
    id: '#FL-9044',
    farmName: 'Battambang Organic Collective',
    date: 'March 18, 2024',
    items: 7,
    total: '89.15',
    status: 'IN-TRANSIT',
    statusClass: 'bg-[#ffca28] text-gray-900',
    color: 'bg-[#f4511e]',
    image: 'https://cdn-icons-png.flaticon.com/512/3014/3014498.png'
  },
  {
    id: '#FL-8820',
    farmName: 'Mekong Riverside Gardens',
    date: 'February 28, 2024',
    items: 2,
    total: '15.00',
    status: 'CANCELLED',
    statusClass: 'bg-gray-100 text-gray-400',
    color: 'bg-gray-50',
    image: 'https://cdn-icons-png.flaticon.com/512/1048/1048953.png'
  }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

:deep(body) {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>