<script setup lang="ts">
import CommonAppSidebar from '../../../components/common/AppSidebar.vue';
definePageMeta({
  layout: 'user',
});

useHead({
  title: 'Edit Payment Method | FarmLink Cambodia',
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#fbf9f6] text-on-background">
    <CommonAppHeader />

    <main class="max-w-7xl mx-auto w-full pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex-1">
      <div class="flex flex-col md:flex-row gap-8 md:gap-10">
        <CommonAppSidebar active="payment" />

        <section class="flex-1">
          <div class="mb-10">
            <div class="flex items-center gap-2 text-[11px] font-bold text-[#5a5b58] uppercase tracking-wider mb-2">
              <span>Settings</span>
              <span class="material-symbols-outlined text-xs">chevron_right</span>
              <span>Payments</span>
              <span class="material-symbols-outlined text-xs">chevron_right</span>
              <span class="text-[#154212]">Edit Card</span>
            </div>
            <h1 class="text-4xl font-[Manrope,sans-serif] font-extrabold text-[#154212] tracking-tight">Update Payment Method</h1>
            <p class="text-[#42493e] mt-2 max-w-lg leading-relaxed">Ensure your billing information is accurate to keep your farm-to-table deliveries flowing without interruption.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
            <div class="min-w-0 space-y-8">
              <section class="bg-white p-8 rounded-xl shadow-sm border border-[#c2c9bb]/30">
                <h3 class="text-lg font-[Manrope,sans-serif] font-bold text-[#154212] mb-6 flex items-center gap-2">
                  <span class="material-symbols-outlined">lock</span>
                  Secure Card Details
                </h3>

                <form class="space-y-6">
                  <div class="space-y-2">
                    <label class="block text-[11px] font-semibold uppercase tracking-wider text-[#72796e]">Cardholder Name</label>
                    <input class="w-full px-4 py-3 rounded-lg bg-[#e9e8e5] border-none focus:ring-2 focus:ring-[#154212] text-[#1b1c1a] font-body" type="text" value="Sophal Rattanak" />
                  </div>

                  <div class="space-y-2">
                    <label class="block text-[11px] font-semibold uppercase tracking-wider text-[#72796e]">Card Number</label>
                    <div class="relative">
                      <input class="w-full px-4 py-3 rounded-lg bg-[#dbdad7]/60 border-none text-[#42493e] font-mono cursor-not-allowed pr-12" disabled type="text" value="•••• •••• •••• 4242" />
                      <span class="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#154212]">credit_card</span>
                    </div>
                    <p class="text-[10px] text-[#72796e] italic">For security, card numbers cannot be changed. Please add a new card if the number has changed.</p>
                  </div>

                  <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label class="block text-[11px] font-semibold uppercase tracking-wider text-[#72796e]">Expiry Date</label>
                      <input class="w-full px-4 py-3 rounded-lg bg-[#e9e8e5] border-none focus:ring-2 focus:ring-[#154212] text-[#1b1c1a] font-body" type="text" value="09 / 26" />
                    </div>
                    <div class="space-y-2">
                      <label class="block text-[11px] font-semibold uppercase tracking-wider text-[#72796e]">CVV</label>
                      <input class="w-full px-4 py-3 rounded-lg bg-[#e9e8e5] border-none focus:ring-2 focus:ring-[#154212] text-[#1b1c1a] font-body" type="password" value="•••" />
                    </div>
                  </div>

                  <div class="flex items-center gap-3 py-2">
                    <input id="default_payment" checked class="rounded text-[#154212] focus:ring-[#154212] border-[#c2c9bb] h-5 w-5" type="checkbox" />
                    <label class="text-sm text-[#1b1c1a]" for="default_payment">Set as default payment method for all harvests</label>
                  </div>

                  <div class="pt-4 flex items-center gap-4">
                    <button class="flex-1 py-4 bg-gradient-to-br from-[#154212] to-[#2d5a27] text-white font-[Manrope,sans-serif] font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity" type="submit">
                      Update Card Details
                    </button>
                    <NuxtLink class="px-6 py-4 border border-[#c2c9bb]/40 text-[#1b1c1a] font-[Manrope,sans-serif] font-bold rounded-lg hover:bg-[#efeeea] transition-colors" to="/user/settings/payment">
                      Cancel
                    </NuxtLink>
                  </div>
                </form>
              </section>

              <div class="p-6 rounded-xl border-2 border-[#ba1a1a]/10 bg-[#ffdad6]/20">
                <div class="flex items-start gap-4">
                  <div class="p-2 bg-[#ffdad6] rounded-lg">
                    <span class="material-symbols-outlined text-[#93000a]">delete</span>
                  </div>
                  <div>
                    <h4 class="font-[Manrope,sans-serif] font-bold text-[#93000a]">Remove Payment Method</h4>
                    <p class="text-sm text-[#42493e] mb-4">Once removed, this card will no longer be available for checkout. Pending orders will not be affected.</p>
                    <button class="text-[#ba1a1a] text-sm font-bold underline hover:no-underline">Remove Card Permanently</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4 md:sticky md:top-28 md:justify-self-end md:w-full md:max-w-[300px] lg:max-w-[320px]">
              <div class="relative w-full aspect-[1.6/1] bg-gradient-to-br from-[#154212] to-[#2d5a27] rounded-2xl p-5 text-white shadow-2xl overflow-hidden group">
                <div class="absolute -right-12 -bottom-12 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                <div class="absolute -left-12 -top-12 w-40 h-40 bg-[#91f78e]/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                <div class="relative flex flex-col h-full justify-between">
                  <div class="flex justify-between items-start">
                    <div class="flex flex-col">
                      <span class="text-[10px] font-label tracking-widest uppercase opacity-70">Harvest Trust Member</span>
                      <span class="font-[Manrope,sans-serif] font-extrabold text-lg">The Digital Agrarian</span>
                    </div>
                    <span class="material-symbols-outlined text-3xl opacity-90">contactless</span>
                  </div>
                  <div class="space-y-1">
                    <div class="text-[15px] tracking-[0.2em] font-mono">•••• •••• •••• 4242</div>
                    <div class="flex gap-8">
                      <div class="flex flex-col">
                        <span class="text-[8px] font-label uppercase opacity-60">Holder</span>
                        <span class="text-sm">Sophal Rattanak</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-[8px] font-label uppercase opacity-60">Expires</span>
                        <span class="text-sm">09 / 26</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-[#ffdcbe] p-5 rounded-xl border border-[#563000]/10">
                <h4 class="font-[Manrope,sans-serif] font-bold text-[#2c1600] mb-2 flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">info</span>
                  Payment Security
                </h4>
                <p class="text-xs text-[#693c00] leading-relaxed">
                  Your payment data is encrypted with 256-bit SSL technology. We never store your full card number on our servers. All transactions are processed through local Cambodian banking partners compliant with international security standards.
                </p>
              </div>

              <div class="rounded-xl overflow-hidden aspect-video relative group">
                <img alt="Rice fields" class="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc0_CGid2mLyrFtJBBZKQVWIPz4HY9W9BAjn9gkbSVbOJ26TmZ3wYTU75wSv5RFOlCba9SV41pykV6-cfziPWPfE76Kc-3dTZYz8pxeSYpSBHwO1WSiJGSZdsMSdORKoOgVlVYO8k89rC09K5MiF0MwR7u2yfE4fRoHrYXTAqzWVYj0_2hzZdIZt_-M0t7uR7w596qiNX355hvq4fbrLiatmHmCaTzpPq7OOr0sWrlG2vvYNZ7u6KySaAJIj1BdzPWX6LoMVB-d8I" />
                <div class="absolute inset-0 bg-[#154212]/20 mix-blend-multiply group-hover:bg-transparent transition-colors"></div>
                <div class="absolute bottom-4 left-4 text-white">
                  <span class="px-2 py-1 bg-[#91f78e] text-[#00731e] text-[10px] rounded-full font-bold uppercase tracking-wider">Battambang Province</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <CommonAppFooter />
  </div>
</template>