<script setup lang="ts">
import CommonAppSidebar from '../../../components/common/AppSidebar.vue';
definePageMeta({
  layout: 'user',
});

useHead({
  title: 'Security Settings - Change Phone Number | FarmLink Cambodia',
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
              <p class="text-[10px] font-bold text-[#1a5423] uppercase tracking-[0.2em] mb-2">Security Settings</p>
              <h1 class="font-[Manrope,sans-serif] text-4xl md:text-5xl font-black text-[#1a5423] mb-4">Account Access</h1>
              <p class="text-sm text-black/60 max-w-md leading-relaxed">
                Update your contact details and secure your account credentials to keep your FarmLink experience seamless.
              </p>
            </div>
            <div class="absolute -right-16 top-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-black/10" />
          </div>

          <div class="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-black/5">
            <div class="rounded-[1.15rem] bg-[#b0b0b0] p-1.5 grid grid-cols-1 sm:grid-cols-3 gap-1 mb-8">
              <NuxtLink
                to="/user/settings/edit"
                class="h-12 flex items-center justify-center text-white/80 font-bold text-xs rounded-xl hover:bg-white/10 transition-all"
              >
                Change Password
              </NuxtLink>
              <NuxtLink
                to="/user/settings/email"
                class="h-12 flex items-center justify-center text-white/80 font-bold text-xs rounded-xl hover:bg-white/10 transition-all"
              >
                Change Email
              </NuxtLink>
              <button class="h-12 flex items-center justify-center text-white font-bold text-xs rounded-xl bg-[#154212] shadow-sm transition-all">
                Change Phone Number
              </button>
            </div>

            <div class="max-w-2xl mx-auto space-y-8">
              <p class="text-[#154212]/50 text-xs text-center leading-relaxed italic">
                To update your contact information, we'll send a verification code to your new mobile number. This helps ensure your account remains secure.
              </p>

              <form class="space-y-8" @submit.prevent>
                <div class="space-y-3">
                  <label class="text-[10px] font-bold text-[#154212]/70 uppercase tracking-wider ml-1">Current Phone Number</label>
                  <input class="w-full h-12 bg-[#f4f2ee] border-none rounded-xl py-3 px-6 text-sm text-[#154212]/40 font-medium" readonly type="text" value="+855 12 345 678" />
                </div>

                <div class="space-y-3">
                  <label class="text-[10px] font-bold text-[#154212]/70 uppercase tracking-wider ml-1">New Phone Number</label>
                  <input class="w-full h-12 bg-[#f4f2ee] border-none rounded-xl py-3 px-6 text-sm text-[#154212] font-semibold placeholder:text-[#154212]/20 focus:ring-1 focus:ring-[#154212]/10" placeholder="+855 (___) ___-____" type="tel" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-3">
                    <label class="text-[10px] font-bold text-[#154212]/70 uppercase tracking-wider ml-1">Verification Code</label>
                    <input class="w-full h-12 bg-[#f4f2ee] border-none rounded-xl py-3 px-6 text-sm font-bold tracking-[0.25em] text-center placeholder:text-[#154212]/30 focus:ring-1 focus:ring-[#154212]/10" placeholder="6-digit code" type="text" />
                  </div>
                  <div class="flex items-end">
                    <button class="w-full h-12 text-[11px] font-bold uppercase tracking-wider text-[#154212] border-2 border-[#154212]/10 rounded-xl hover:bg-[#154212]/5 transition-all" type="button">
                      Send Code
                    </button>
                  </div>
                </div>

                <div class="pt-4 flex items-center justify-end gap-6">
                  <button class="text-[11px] font-bold uppercase tracking-wider text-[#154212]/40 hover:text-[#154212] transition-colors" type="button">
                    Cancel
                  </button>
                  <button class="bg-[#4a3419] text-white py-3.5 px-8 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-[#4a3419]/20 hover:bg-[#3d2b14] transition-all flex items-center gap-3" type="submit">
                    <span class="material-symbols-outlined text-[18px]">save</span>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 rounded-[2rem] overflow-hidden relative h-56 group">
              <img
                alt="Farms"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgL6vBVfH9_zUrcPY0Lf785P_Wnm0NIyUqo_dhIuM5cjTqbgW6wqywM3ctlpjGXo7P6Q97n_qMGzkWPlJWGYv83Z-Xp05hFKDYEuHIncsLLRudkjs2mdDpsAwg7Cq_eEfH-9z-Rk-fRvayHzGUcKmuDzYGmg4fDNnfN-nMy0mMpyvCGEvYQLP3d-dQffcJKG7f1O7NRccPRscG6JvtqIKcnTvOPruzIVljcOSgtvqLvwk0_dt_z_V9g5n8ptOkexJaCz__8pd_o3I"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#154212]/80 to-transparent flex flex-col justify-end p-8">
                <p class="text-[9px] font-bold uppercase tracking-[0.3em] text-white/70">Our Impact</p>
                <h4 class="text-white text-xl font-bold mt-1">Supported 14 Small-Scale Farms in 2023</h4>
              </div>
            </div>

            <div class="bg-[#2e522a] rounded-[2rem] p-8 flex flex-col items-center justify-center text-center space-y-3">
              <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <span class="material-symbols-outlined text-white/80 text-[20px]">eco</span>
              </div>
              <div class="leading-none">
                <span class="text-white text-2xl font-bold">8.4kg</span>
                <p class="text-[8px] font-bold uppercase tracking-widest text-white/50 mt-1">Organic Waste Diverted</p>
              </div>
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

