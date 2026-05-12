<script setup lang="ts">
import CommonAppSidebar from '../../../components/common/AppSidebar.vue';
definePageMeta({
  layout: 'user',
});

useHead({
  title: 'Edit Profile - Change Photo | FarmLink Cambodia',
});
</script>

<template>
  <div class="min-h-screen bg-[#fbf9f6] text-zinc-900 font-[Inter,sans-serif] overflow-hidden">
    <CommonAppHeader />

    <div class="pt-24 flex flex-col md:flex-row min-h-[calc(100vh-96px)] gap-8 md:gap-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <CommonAppSidebar active="edit" />

      <main class="flex-1 p-10 overflow-y-auto bg-stone-50/50 relative rounded-2xl">
        <div class="absolute inset-0 bg-stone-900/10 z-10" />

        <div class="max-w-4xl mx-auto space-y-10 relative z-0">
          <header>
            <span class="text-[10px] font-bold tracking-[0.2em] text-[#006e1c] uppercase">Account Management</span>
            <h1 class="text-5xl font-extrabold text-[#154212] font-[Manrope,sans-serif] mt-2 tracking-tight">Personal Details</h1>
          </header>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-1">
              <div class="aspect-square rounded-2xl bg-[#e9e8e5] overflow-hidden">
                <img
                  class="w-full h-full object-cover"
                  alt="Profile image"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa3VshPy0gbuZ6FQYP5J1UCTwCrG2jmdBoSptCyfqW0HXb8T2q8dd2ayAQCIMyjZ7mENPrgPAgKKkp2FnsRMp8bvXdKDsHbhjM89pTZBwB5ZGhO5n0ySn3H5_-cMxN4ppdGTqVM06Y_i4UUXg91UytDpMAfaAm3HVeDjWZRMfc4sE68VaJHlvbwC-9CPeeJxBLWEJPhTuDK6F13Zv6IBEdoWwLGmQ7s3ZnV66xR1fSit-HmGCmWtmlnnVXLEtkE6nom5ZTLS1J6qk"
                />
              </div>
            </div>
            <div class="md:col-span-2 space-y-8">
              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-zinc-500 ml-1">First Name</label>
                  <div class="h-12 w-full rounded-lg bg-[#efeeea] px-4 flex items-center text-zinc-500">Sophal</div>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-zinc-500 ml-1">Last Name</label>
                  <div class="h-12 w-full rounded-lg bg-[#efeeea] px-4 flex items-center text-zinc-500">Saman</div>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-bold text-zinc-500 ml-1">Bio</label>
                <div class="h-32 w-full rounded-lg bg-[#efeeea] p-4 text-zinc-500">Passionate about sustainable farming practices and local produce networks.</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#154212]/20 backdrop-blur-sm">
      <div class="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
        <div class="p-8 space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-extrabold text-[#154212] font-[Manrope,sans-serif]">Upload Photo</h2>
            <NuxtLink to="/user/settings/edit" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors">
              <span class="material-symbols-outlined text-stone-400">close</span>
            </NuxtLink>
          </div>

          <div class="group relative flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 rounded-3xl p-12 bg-[#f5f3f0]/70 hover:bg-[#f5f3f0] transition-all cursor-pointer">
            <div class="w-20 h-20 rounded-full bg-[#91f78e] flex items-center justify-center mb-4">
              <span class="material-symbols-outlined text-[#00731e] text-4xl">cloud_upload</span>
            </div>
            <p class="text-zinc-800 font-semibold">Drag and drop your image here</p>
            <p class="text-xs text-zinc-500 mt-2">Supports JPG, PNG (Max 5MB)</p>
            <div class="mt-6">
              <span class="px-6 py-2 bg-white text-[#154212] text-xs font-bold border border-zinc-300 rounded-full shadow-sm">Browse Files</span>
            </div>
          </div>

          <div class="flex gap-4 pt-2">
            <NuxtLink to="/user/settings/edit" class="flex-1 py-4 text-sm font-bold text-stone-600 hover:text-[#154212] transition-colors text-center">
              Cancel
            </NuxtLink>
            <button class="flex-1 py-4 bg-gradient-to-br from-[#154212] to-[#2d5a27] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#154212]/20 active:scale-[0.98] transition-all">
              Upload
            </button>
          </div>
        </div>

        <div class="bg-[#efeeea] px-8 py-4 flex items-center gap-3">
          <span class="material-symbols-outlined text-[#006e1c] text-sm">lightbulb</span>
          <p class="text-[11px] text-zinc-600 font-medium">Tip: Use a bright, clear photo of yourself to build trust with fellow farmers.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24;
}
</style>
