<script setup lang="ts">
import CommonAppSidebar from '../../../components/common/AppSidebar.vue';
import { useAddress } from '~/composables/useAddress';

definePageMeta({
  middleware: 'user',
  layout: 'user',
});

useHead({
  title: 'Saved Addresses | FarmLink Cambodia',
});

const { addressData, loading, hasAddress, fullAddress, recipientName, fetchAddress, deleteAddress } = useAddress();

const deleting = ref(false);
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' });
let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(message: string, type: 'success' | 'error' = 'success') {
  if (toastTimer) clearTimeout(toastTimer);
  toast.value = { show: true, message, type };
  toastTimer = setTimeout(() => { toast.value.show = false; }, 3000);
}

async function handleDelete() {
  if (!confirm('Are you sure you want to remove this address?')) return;
  deleting.value = true;
  const ok = await deleteAddress();
  deleting.value = false;
  if (ok) showToast('Address removed');
  else showToast('Failed to remove address', 'error');
}

onMounted(fetchAddress);
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#fbf9f6] text-zinc-900">
    <CommonAppHeader />

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show"
        class="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium"
        :class="toast.type === 'success' ? 'bg-[#2d5a27] text-white' : 'bg-red-600 text-white'">
        <span>{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        {{ toast.message }}
      </div>
    </transition>

    <main class="max-w-[1550px] mx-auto w-full pt-16 sm:pt-16 pb-16 px-4 sm:px-16 lg:px-8 flex-1">
      <div class="flex flex-col md:flex-row gap-8 md:gap-10">
        <CommonAppSidebar active="address" />

        <section class="flex-1 space-y-10">
          <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span class="text-[#006e1c] font-bold text-[10px] tracking-[0.25em] uppercase mb-2 block">Shipping Destinations</span>
              <h1 class="text-5xl font-black text-[#154212] font-[Manrope,sans-serif] tracking-tight leading-tight">Saved Addresses</h1>
            </div>

            <NuxtLink
              v-if="!hasAddress"
              to="/user/settings/add-address"
              class="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#154212] to-[#2d5a27] text-white font-bold py-3 px-5 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] w-fit"
            >
              <span class="material-symbols-outlined text-sm">add_location_alt</span>
              Add New Address
            </NuxtLink>
          </header>

          <!-- Loading skeleton -->
          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div v-for="i in 2" :key="i" class="h-64 rounded-xl bg-gray-100 animate-pulse" />
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">

            <!-- Address card (dynamic) -->
            <div v-if="hasAddress" class="group relative bg-white rounded-xl p-8 border border-[#c2c9bb]/10 shadow-sm hover:shadow-lg transition-all duration-300">
              <div class="absolute top-6 right-6 flex gap-2">
                <span class="bg-[#91f78e] text-[#00731e] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Default</span>
              </div>
              <div class="mb-6">
                <span class="material-symbols-outlined text-[#154212] text-3xl mb-4 block" style="font-variation-settings: 'FILL' 1;">home</span>
                <h3 class="font-[Manrope,sans-serif] text-xl font-bold text-[#154212] mb-1">Home</h3>
                <p class="text-sm text-[#42493e] font-medium">{{ recipientName }}</p>
              </div>
              <div class="space-y-2 mb-8">
                <p class="text-sm text-[#1b1c1a] leading-relaxed">{{ fullAddress || '—' }}</p>
                <p v-if="addressData.phoneNumber" class="text-sm text-[#1b1c1a] flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">phone</span>
                  {{ addressData.phoneNumber }}
                </p>
              </div>
              <div class="flex items-center gap-4 border-t border-[#efeeea] pt-6">
                <NuxtLink
                  to="/user/settings/edit-address"
                  class="text-[#154212] font-[Inter,sans-serif] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
                >
                  <span class="material-symbols-outlined text-base">edit</span>
                  Edit
                </NuxtLink>
                <button
                  @click="handleDelete"
                  :disabled="deleting"
                  class="text-[#ba1a1a] font-[Inter,sans-serif] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 hover:underline disabled:opacity-50"
                >
                  <span class="material-symbols-outlined text-base">delete</span>
                  {{ deleting ? 'Removing…' : 'Delete' }}
                </button>
              </div>
            </div>

            <!-- Empty state -->
            <div v-else class="col-span-full text-center py-16 text-[#72796e]">
              <span class="material-symbols-outlined text-5xl mb-4 block" style="font-variation-settings: 'FILL' 1;">location_off</span>
              <p class="text-base font-semibold">No address saved yet.</p>
              <p class="text-sm mt-1">Add one to speed up your checkout.</p>
            </div>

            <!-- Add New Address tile -->
            <NuxtLink
              to="/user/settings/add-address"
              class="group bg-[#efeeea]/30 border-2 border-dashed border-[#c2c9bb]/30 rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:border-[#154212]/50 hover:bg-[#efeeea]/50 transition-all duration-300 h-full min-h-[200px]"
            >
              <div class="w-16 h-16 rounded-full bg-[#fbf9f6] flex items-center justify-center text-[#2d5a27] group-hover:scale-110 transition-transform shadow-sm">
                <span class="material-symbols-outlined text-3xl">add_circle</span>
              </div>
              <div class="text-center">
                <span class="font-[Manrope,sans-serif] text-lg font-bold text-[#154212] block">
                  {{ hasAddress ? 'Update Address' : 'Add New Address' }}
                </span>
                <span class="text-sm text-[#42493e]">Ship to a new location</span>
              </div>
            </NuxtLink>

            <!-- Info card -->
            <div class="relative overflow-hidden rounded-xl bg-[#154212] text-white p-8 flex flex-col justify-between min-h-[200px]">
              <div class="relative z-10">
                <span class="bg-[#563000] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4 inline-block">Sustainability Note</span>
                <h4 class="font-[Manrope,sans-serif] text-2xl font-bold mb-4 italic leading-tight">Farmer-to-Fork Efficiency</h4>
                <p class="text-sm text-white/80 leading-relaxed mb-6">
                  Accurate addresses help our local couriers reduce carbon emissions by optimizing delivery routes across the Kingdom.
                </p>
              </div>
              <div class="relative z-10 text-xs font-bold tracking-widest text-[#91f78e]">
                CULTIVATING FUTURE © 2024
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
.toast-enter-active, .toast-leave-active { transition: all .25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
