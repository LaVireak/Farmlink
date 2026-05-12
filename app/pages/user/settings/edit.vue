<script setup lang="ts">
import CommonAppSidebar from '../../../components/common/AppSidebar.vue';
definePageMeta({
  layout: 'user',
});

useHead({
  title: 'Edit Profile | FarmLink Cambodia',
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
              <h1 class="font-[Manrope,sans-serif] text-4xl md:text-5xl font-black text-[#1a5423] mb-4">Edit Profile</h1>
              <p class="text-sm text-black/60 max-w-lg leading-relaxed">
                Update your personal details and secure your account credentials to keep your FarmLink experience seamless.
              </p>
            </div>
            <div class="absolute -right-16 top-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-black/10" />
          </div>

          <div class="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-black/5">
            <div class="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 mb-10">
              <div class="relative">
                <img
                  alt="User Avatar"
                  class="w-24 h-24 rounded-full border-4 border-white shadow-xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVT-FoW9Fe-yNUYj95BoUQevl1z-enhl5xKygCW5yREkbqpe0dMg2S7q8lyK0yQW_lDJ6_3Jvg292hLehmigOsuVzWb2Tzh1GhYogdAUO_DV3dMdWKrrXZc61EvyqLQsVai6fk06sdb9nl1n7rMyhLa5LGUxuFYx4_7zfFBUvTb84snyjBSn2ocBrOKc9vQD4t3sXqXbtM1z2j_60urGY1dT8yIUqzb6wZiDtuXFPUWeR2L5AMZ0J5WPXje4GGStJirCFtREPNtDU"
                />
                <button class="absolute bottom-0 right-0 bg-[#563000] text-white p-1.5 rounded-lg shadow-lg border-2 border-white">
                  <span class="material-symbols-outlined text-sm">photo_camera</span>
                </button>
              </div>
              <div>
                <h3 class="font-[Manrope,sans-serif] font-bold text-lg mb-1">Profile Picture</h3>
                <p class="text-xs text-black/40 mb-4">JPG, GIF or PNG. Max size of 2MB</p>
                <div class="flex gap-4">
                  <NuxtLink to="/user/settings/photo" class="bg-[#f2efe8] text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Change Photo
                  </NuxtLink>
                  <NuxtLink to="/user/settings/remove-photo" class="text-[#ba1a1a] text-[10px] font-bold uppercase tracking-wider">
                    Remove
                  </NuxtLink>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <h3 class="font-[Manrope,sans-serif] text-xl font-bold mb-6">Security Settings</h3>

              <div class="rounded-[1.15rem] bg-[#e3e2df] p-1.5 grid grid-cols-1 sm:grid-cols-3 gap-1 mb-8">
                <button class="h-12 flex items-center justify-center text-white font-bold text-xs rounded-xl bg-[#1a5423] shadow-sm transition-all">
                  Change Password
                </button>
                <NuxtLink
                  to="/user/settings/email"
                  class="h-12 flex items-center justify-center text-black/40 font-bold text-xs rounded-xl hover:bg-white/45 transition-all"
                >
                  Change Email
                </NuxtLink>
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
                    <label class="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Current Password</label>
                    <input class="w-full h-12 bg-[#f2efe8] border-none rounded-2xl py-3 px-6 text-sm font-medium focus:ring-2 focus:ring-[#1a5423]/20 transition-all placeholder-black/20" type="password" value="••••••••" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">New Password</label>
                    <input class="w-full h-12 bg-[#f2efe8] border-none rounded-2xl py-3 px-6 text-sm font-medium focus:ring-2 focus:ring-[#1a5423]/20 transition-all placeholder-black/30" placeholder="Leave blank to keep same" type="password" />
                  </div>
                </div>

                <div class="pt-4 border-t border-black/5 flex flex-col sm:flex-row gap-4 items-center justify-end">
                  <button class="px-8 py-3.5 bg-white border border-black/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#f2efe8] transition-all" type="button">
                    Cancel
                  </button>
                  <button class="flex items-center gap-3 px-8 py-3.5 bg-[#563000] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#402400] shadow-lg transition-all active:scale-95" type="submit">
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

