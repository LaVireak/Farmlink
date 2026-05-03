<script setup lang="ts">
import CommonAppSidebar from '../../../components/common/AppSidebar.vue';
definePageMeta({
  layout: 'user',
});

useHead({
  title: 'Edit Profile - Remove Photo | FarmLink Cambodia',
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
            <h1 class="text-4xl font-extrabold text-[#154212] font-[Manrope,sans-serif] mb-2">Personal Info</h1>
            <p class="text-zinc-500 font-medium">Update your photo and personal details here.</p>
          </header>

          <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div class="md:col-span-1">
              <h3 class="font-[Manrope,sans-serif] text-lg font-bold text-zinc-900 mb-2">Your Photo</h3>
              <p class="text-sm text-zinc-500 leading-relaxed">This will be displayed on your profile and next to your activities.</p>
            </div>
            <div class="md:col-span-2 flex items-center gap-8 bg-[#efeeea] rounded-2xl p-8 border border-zinc-200/50">
              <img
                class="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                alt="Profile image"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAujS53ZwSWwbtYjoA-HvqMd_4sdPsSnNU8490o9hichROUdMwqdwfbZgvaPmYTBFi2lHt0_JOvKyBOrEaYwJ24phMW5FL-Qq0iNPz5W3KBZPTiRtrrlFNibRt-3A3qnaEXnWQoFuRMNufNyeF5y_Ds1iQTQeTged_yiYlU3UwFjQ5P6pV0acYFu3FWXbTYHaHwzcm3lz75sFGPwy-Jt96rsgcxo0fRIXUVap0GUNLDhn0TSXn2oMW-U6m-oxw7EPb345v-Vrcjl44"
              />
              <div class="flex flex-col gap-3">
                <NuxtLink to="/user/settings/photo" class="px-5 py-2.5 bg-[#154212] text-white rounded-lg font-bold text-sm text-center">
                  Change Photo
                </NuxtLink>
                <button class="px-5 py-2.5 border border-[#ba1a1a]/20 text-[#ba1a1a] rounded-lg font-bold text-sm">
                  Remove Photo
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>

    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-zinc-200/30">
        <div class="flex flex-col items-center text-center">
          <div class="w-16 h-16 rounded-full bg-[#ffdad6] flex items-center justify-center mb-6">
            <span class="material-symbols-outlined text-[#ba1a1a] text-3xl">delete_forever</span>
          </div>

          <h3 class="font-[Manrope,sans-serif] text-xl font-bold text-zinc-900 mb-2">Are you sure you want to remove your profile photo?</h3>
          <p class="text-zinc-500 text-sm mb-8 leading-relaxed">This action cannot be undone. You will revert to a default placeholder avatar.</p>

          <div class="flex gap-3 w-full">
            <NuxtLink
              to="/user/settings/edit"
              class="flex-1 px-6 py-3 rounded-lg font-semibold text-zinc-600 bg-[#e9e8e5] hover:bg-[#e3e2df] transition-colors text-center"
            >
              Cancel
            </NuxtLink>
            <button class="flex-1 px-6 py-3 rounded-lg font-semibold text-white bg-[#ba1a1a] hover:opacity-90 transition-opacity">
              Remove
            </button>
          </div>
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
