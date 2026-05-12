<script setup lang="ts">
import CommonAppSidebar from '../../../components/common/AppSidebar.vue';
definePageMeta({
  layout: 'user',
});

useHead({
  title: 'Delete Address Confirmation | FarmLink',
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#fbf9f6] text-zinc-900">
    <CommonAppHeader />

    <main class="max-w-7xl mx-auto w-full pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex-1">
      <div class="flex flex-col md:flex-row gap-8 md:gap-10">
        <CommonAppSidebar active="address" />

        <section class="flex-1 relative">
          <div class="opacity-35 blur-[2px] pointer-events-none select-none">
            <header class="mb-12">
              <span class="text-[#006e1c] font-bold text-[10px] tracking-[0.25em] uppercase mb-2 block">Shipping & Logistics</span>
              <h1 class="text-5xl font-black text-[#154212] font-[Manrope,sans-serif] tracking-tight">Saved Addresses</h1>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-white rounded-xl p-8 border border-[#c2c9bb]/15">
                <div class="flex justify-between items-start mb-6">
                  <span class="bg-[#91f78e] text-[#00731e] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tighter">Primary Origin</span>
                  <div class="flex gap-2">
                    <span class="material-symbols-outlined text-[#72796e]">edit</span>
                    <span class="material-symbols-outlined text-[#ba1a1a]">delete</span>
                  </div>
                </div>
                <h3 class="text-xl font-bold text-[#154212] mb-2">Home Sanctuary</h3>
                <p class="text-[#42493e] leading-relaxed">No. 42, St. 310, Boeung Keng Kang I,<br />Phnom Penh, Cambodia</p>
              </div>

              <div class="bg-[#efeeea] rounded-xl p-8 border-2 border-[#ba1a1a]/20 ring-4 ring-[#ba1a1a]/5">
                <div class="flex justify-between items-start mb-6">
                  <span class="bg-[#e9e8e5] text-[#42493e] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tighter">Warehouse</span>
                  <div class="flex gap-2">
                    <span class="material-symbols-outlined text-[#72796e]">edit</span>
                    <span class="material-symbols-outlined text-[#ba1a1a]">delete</span>
                  </div>
                </div>
                <h3 class="text-xl font-bold text-[#154212] mb-2">Battambang Depot</h3>
                <p class="text-[#42493e] leading-relaxed">Highway 5, Sangkat Svay Pao,<br />Battambang City, Cambodia</p>
              </div>
            </div>
          </div>

          <div class="fixed inset-0 z-50 flex items-center justify-center bg-[#fbf9f6]/20 backdrop-blur-md p-4">
            <div class="bg-white w-full max-w-xl rounded-xl shadow-2xl p-10 border border-[#c2c9bb]/20">
              <div class="flex flex-col items-center text-center">
                <div class="w-16 h-16 bg-[#ffdad6] rounded-full flex items-center justify-center mb-6">
                  <span class="material-symbols-outlined text-[#ba1a1a] text-3xl" style="font-variation-settings: 'FILL' 1;">warning</span>
                </div>
                <span class="text-[10px] uppercase tracking-[0.2em] text-[#563000] font-bold mb-3 block">Security Confirmation</span>
                <h2 class="text-3xl font-black font-[Manrope,sans-serif] text-[#154212] mb-4 leading-tight">Are you sure you want to delete this address?</h2>
                <p class="text-[#42493e] mb-8 max-w-sm">This action will permanently remove <span class="font-bold text-[#154212]">Battambang Depot</span> from your digital ledger. This cannot be undone.</p>

                <div class="w-full bg-[#f5f3f0] rounded-lg p-6 mb-10 text-left border-l-4 border-[#ba1a1a]/50">
                  <p class="text-sm font-bold text-[#154212] uppercase tracking-widest mb-2">Address Details</p>
                  <p class="text-[#42493e] font-medium">Highway 5, Sangkat Svay Pao, Battambang City, Cambodia</p>
                </div>

                <div class="flex flex-col sm:flex-row gap-4 w-full">
                  <button class="flex-1 bg-[#ba1a1a] hover:bg-[#8f1010] text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2" type="button">
                    <span class="material-symbols-outlined text-xl">delete_forever</span>
                    Delete Address
                  </button>
                  <NuxtLink class="flex-1 border-2 border-[#c2c9bb]/20 hover:border-[#154212]/50 text-[#154212] font-bold py-4 px-8 rounded-lg transition-all active:scale-95" to="/user/settings/address">
                    Keep Address
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <div class="fixed bottom-0 right-0 -z-10 w-1/3 h-1/2 opacity-10 pointer-events-none">
      <img alt="farmland background" class="object-cover w-full h-full grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqRi0A_SI9CWPDWbKbN566XIqEcZ6laM5uurz_xf3yyW-790sf9Yz7qbMtpvNrC_BFA1FH14NhB5epbjhQzlIa_w4ygr9kG3aXItmyUBb4MJaPiMXef0iBHGliHFfRtqWiltVis5u7BGb1bjE-6AV1FhtboLEGr9s6xzmdmrVIuUaIMVsm0npwiiFxQMIWXYfVfdebPnKB-3sAvUjNv4hquPdkarC0nToxP_3G-TzJtk5lCOSS-86mDms7GPW3HTtkkz1BYgZcfzM" />
    </div>
  </div>
</template>
