<script setup lang="ts">
import CommonAppSidebar from '../../../components/common/AppSidebar.vue';
definePageMeta({
  layout: 'user',
});

useHead({
  title: 'Security Settings - Change Email | FarmLink Cambodia',
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#fbf9f6] text-zinc-900">
    <CommonAppHeader />

    <main class="max-w-7xl mx-auto w-full pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 flex-1">
      <div class="flex flex-col md:flex-row gap-8 md:gap-10">
        <CommonAppSidebar active="edit" />

        <section class="flex-1 space-y-8 min-w-0">
          <div class="bg-[#f2efe8] rounded-3xl p-8 md:p-10 relative overflow-hidden min-h-[220px] flex flex-col justify-center">
            <div class="relative z-10">
              <p class="text-[10px] font-bold text-[#1a5423] uppercase tracking-[0.2em] mb-2">Account Settings</p>
              <h1 class="font-[Manrope,sans-serif] text-4xl md:text-5xl font-black text-[#1a5423] mb-4">Security Settings</h1>
              <p class="text-sm text-black/60 max-w-xl leading-relaxed">
                Update your account access and verification details to keep your FarmLink experience secure and seamless.
              </p>
            </div>
            <div class="absolute -right-16 top-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-black/10" />
          </div>

          <div class="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-black/5">
            <div class="rounded-[1.15rem] bg-[#e3e2df] p-1.5 grid grid-cols-1 sm:grid-cols-3 gap-1 mb-8">
              <NuxtLink
                to="/user/settings/edit"
                class="h-12 flex items-center justify-center text-black/40 font-bold text-xs rounded-xl hover:bg-white/45 transition-all"
              >
                Change Password
              </NuxtLink>
              <button class="h-12 flex items-center justify-center text-white font-bold text-xs rounded-xl bg-[#1a5423] shadow-sm transition-all">
                Change Email
              </button>
              <NuxtLink
                to="/user/settings/phone"
                class="h-12 flex items-center justify-center text-black/40 font-bold text-xs rounded-xl hover:bg-white/45 transition-all"
              >
                Change Phone Number
              </NuxtLink>
            </div>

            <form class="space-y-8" @submit.prevent>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div class="space-y-2">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Current Email Address</label>
                  <div class="w-full h-12 bg-[#f2efe8] rounded-2xl px-6 text-sm text-black/50 font-semibold flex items-center justify-between">
                    <span>sophal.saman@farmlink.kh</span>
                    <span class="material-symbols-outlined text-base">lock</span>
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">New Email Address</label>
                  <input class="w-full h-12 bg-[#f2efe8] border-none rounded-2xl py-3 px-6 text-sm font-medium focus:ring-2 focus:ring-[#1a5423]/20 transition-all placeholder-black/30" placeholder="Enter your new email" type="email" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Verify Password</label>
                <div class="relative">
                  <input class="w-full h-12 bg-[#f2efe8] border-none rounded-2xl py-3 px-6 pr-12 text-sm font-medium focus:ring-2 focus:ring-[#1a5423]/20 transition-all placeholder-black/30" placeholder="Confirm with current password" type="password" />
                  <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">visibility_off</span>
                </div>
              </div>

              <div class="pt-4 border-t border-black/5 flex flex-col sm:flex-row gap-4 items-center justify-end">
                <button class="px-8 py-3.5 bg-white border border-black/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#f2efe8] transition-all" type="button">
                  Cancel
                </button>
                <button class="flex items-center gap-3 px-8 py-3.5 bg-[#563000] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#402400] shadow-lg transition-all active:scale-95" type="submit">
                  <span class="material-symbols-outlined text-[18px]">save</span>
                  Update Email Address
                </button>
              </div>
            </form>

            <div class="mt-10 pt-8 border-t border-black/5 flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-[#1a5423] text-white flex items-center justify-center shadow-sm">
                <span class="material-symbols-outlined text-lg">shield</span>
              </div>
              <div>
                <h3 class="font-[Manrope,sans-serif] text-xl font-black text-[#154212] mb-2">Why verify?</h3>
                <p class="text-sm text-black/60 leading-relaxed">
                  Changing your email is a sensitive action. To protect your order history and account access, verification with your current password is required before we send a confirmation link to your new address.
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 rounded-[2rem] overflow-hidden relative h-56 group">
              <img
                alt="Farms"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYwJIlblEgU2cmWyGK1ENbv3RIPEGntkz2bZWDu4uI9jpZ082Q15ICwtzbhEnY3emt8m6bCZyvkzenEYm67xLj4nBCwrcvf7iSxJ461p6XNKO6K3Ehs_o5ShlIJLBlwwDn08yGq9qosubZ6nDl6KQz_d2Ze0JHHn7hHC3i56_S9_CU0scYYTOrXOciSgG5GsOOBIyIEh8eXr8VXyvlDmZYxE8x8J-NtMu8hrptW_m7EPI_Q-oWeshtvseqRKGD7R4H9TGvOTYkwnY"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <p class="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">Our Impact</p>
                <h4 class="text-white text-2xl font-black font-[Manrope,sans-serif]">Supported 14 Small-Scale Farms in 2023</h4>
              </div>
            </div>

            <div class="bg-[#1a5423] rounded-[2rem] p-8 flex flex-col items-center justify-center text-center text-white relative overflow-hidden h-56">
              <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <span class="material-symbols-outlined">eco</span>
              </div>
              <h2 class="text-4xl font-black font-[Manrope,sans-serif] mb-1">8.4kg</h2>
              <p class="text-[10px] font-bold uppercase tracking-widest opacity-60">Organic Waste Diverted</p>
            </div>
          </div>
        </section>
      </div>
    </main>

    <CommonAppFooter />
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24;
}
</style>

