<script setup lang="ts">
import CommonAppSidebar from '../../../components/common/AppSidebar.vue';
definePageMeta({
  layout: 'user',
});

useHead({
  title: 'Add New Address | FarmLink Cambodia',
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#fbf9f6] text-zinc-900">
    <CommonAppHeader />

    <main class="max-w-7xl mx-auto w-full pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex-1">
      <div class="flex flex-col md:flex-row gap-8 md:gap-10">
        <CommonAppSidebar active="address" />

        <section class="flex-1 space-y-12">
          <header>
            <span class="text-[#006e1c] font-bold text-[10px] tracking-[0.25em] uppercase mb-2 block">Secure Delivery</span>
            <h1 class="text-5xl font-black text-[#154212] font-[Manrope,sans-serif] tracking-tight leading-tight">Add New Address</h1>
            <div class="mt-4 flex items-center gap-2">
              <span class="w-8 h-[2px] bg-[#563000]"></span>
              <p class="text-[#42493e] font-medium">Ensure your fresh harvest reaches you exactly where you are. Pin your location for our local delivery partners.</p>
            </div>
          </header>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div class="lg:col-span-7">
              <div class="bg-white p-8 rounded-xl shadow-sm border border-zinc-100">
                <form class="space-y-8">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label class="block font-[Inter,sans-serif] text-[11px] font-semibold uppercase tracking-wider text-[#72796e] px-1">Recipient Name</label>
                      <input class="w-full bg-[#efeeea] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#006e1c]/20 transition-shadow text-[#1b1c1a]" placeholder="e.g. Sophal Meas" type="text" />
                    </div>
                    <div class="space-y-2">
                      <label class="block font-[Inter,sans-serif] text-[11px] font-semibold uppercase tracking-wider text-[#72796e] px-1">Phone Number</label>
                      <input class="w-full bg-[#efeeea] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#006e1c]/20 transition-shadow text-[#1b1c1a]" placeholder="+855 000 000 000" type="tel" />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block font-[Inter,sans-serif] text-[11px] font-semibold uppercase tracking-wider text-[#72796e] px-1">Province / City</label>
                    <div class="relative">
                      <select class="w-full appearance-none bg-[#efeeea] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#006e1c]/20 text-[#1b1c1a] pr-10">
                        <option>Phnom Penh</option>
                        <option>Siem Reap</option>
                        <option>Battambang</option>
                        <option>Kampot</option>
                      </select>
                      <span class="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-[#72796e]">expand_more</span>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <label class="block font-[Inter,sans-serif] text-[11px] font-semibold uppercase tracking-wider text-[#72796e] px-1">District</label>
                      <input class="w-full bg-[#efeeea] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#006e1c]/20 transition-shadow text-[#1b1c1a]" placeholder="e.g. Daun Penh" type="text" />
                    </div>
                    <div class="space-y-2">
                      <label class="block font-[Inter,sans-serif] text-[11px] font-semibold uppercase tracking-wider text-[#72796e] px-1">Sangkat / Commune</label>
                      <input class="w-full bg-[#efeeea] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#006e1c]/20 transition-shadow text-[#1b1c1a]" placeholder="e.g. Phsar Thmei" type="text" />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block font-[Inter,sans-serif] text-[11px] font-semibold uppercase tracking-wider text-[#72796e] px-1">Street Name & House Number</label>
                    <input class="w-full bg-[#efeeea] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#006e1c]/20 transition-shadow text-[#1b1c1a]" placeholder="House 123, St 51 (Pasteur)" type="text" />
                  </div>

                  <div class="space-y-2">
                    <label class="block font-[Inter,sans-serif] text-[11px] font-semibold uppercase tracking-wider text-[#72796e] px-1">Delivery Instructions (Optional)</label>
                    <textarea class="w-full bg-[#efeeea] border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#006e1c]/20 transition-shadow text-[#1b1c1a] resize-none" placeholder="e.g. Leave at the gate, building with the green roof..." rows="3"></textarea>
                  </div>

                  <div class="flex items-center gap-4 pt-4">
                    <button class="bg-gradient-to-br from-[#154212] to-[#2d5a27] text-white px-10 py-4 rounded-lg font-[Manrope,sans-serif] font-bold text-lg shadow-lg shadow-[#154212]/10 hover:shadow-[#154212]/20 transition-all active:scale-[0.98]" type="submit">
                      Save Address
                    </button>
                    <NuxtLink class="px-8 py-4 rounded-lg font-[Manrope,sans-serif] font-bold text-[#154212] hover:bg-[#e9e8e5] transition-colors" to="/user/settings/address">
                      Cancel
                    </NuxtLink>
                  </div>
                </form>
              </div>
            </div>

            <div class="lg:col-span-5 space-y-8">
              <div class="bg-[#f5f3f0] p-2 rounded-xl border border-[#c2c9bb]/15 overflow-hidden shadow-sm">
                <div class="relative aspect-square rounded-lg overflow-hidden group">
                  <img class="w-full h-full object-cover" alt="Location map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA43AbUoqI0aNItlfW-395k_Eqfj1TsgJIpCio0FojnavgJo_uvfJpxfA6KZ4wZZayA5Up2O5F9VDZuW5mDcIzyQA8m8vx8EeKoXIB6DDff41vBwIr2ODLQCOTHHa_VGwD4SYOgKDj48ozQNpVlWjKIjyyzb9ihehYq7arLa4WsYF9QE8rwJ0OXPpl-Z5DvTqoqHRa1G-6sy2g-iwOoKVvr4xvnzdBt_Iq4-2zoCuEULj-VQTifseRVDFRZqVQvVu0UqrMN1OS9GXQ" />
                  <div class="absolute inset-0 bg-[#154212]/5 group-hover:bg-transparent transition-colors"></div>
                  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span class="material-symbols-outlined text-[#006e1c] text-5xl" style="font-variation-settings: 'FILL' 1;">location_on</span>
                  </div>
                  <div class="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-lg flex items-center justify-between">
                    <span class="text-xs font-bold text-[#154212]">Confirm location marker</span>
                    <button class="text-[#006e1c] text-xs font-black uppercase tracking-widest" type="button">Adjust</button>
                  </div>
                </div>
              </div>

              <div class="bg-[#774400] text-[#ffb870] p-8 rounded-xl relative overflow-hidden">
                <div class="relative z-10">
                  <h3 class="font-[Manrope,sans-serif] text-xl font-extrabold mb-3">Harvest Trust</h3>
                  <p class="text-sm leading-relaxed opacity-90">Our logistics network uses specialized cool-chain transport to ensure your Battambang oranges and Kampot peppers arrive with field-fresh crispness.</p>
                  <div class="mt-6 flex items-center gap-3">
                    <span class="material-symbols-outlined text-[#ffdcbe]">verified_user</span>
                    <span class="text-xs font-bold uppercase tracking-widest">100% Secure Delivery</span>
                  </div>
                </div>
                <div class="absolute -bottom-4 -right-4 opacity-10">
                  <span class="material-symbols-outlined text-[120px]">local_shipping</span>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <span class="bg-[#91f78e] text-[#00731e] px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">Primary Hub: Phnom Penh</span>
                <span class="bg-[#e3e2df] text-[#42493e] px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">Rural Express</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <CommonAppFooter />
  </div>
</template>
