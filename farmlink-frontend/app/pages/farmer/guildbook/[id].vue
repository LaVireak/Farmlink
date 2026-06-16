<template>
  <main class="px-6 py-8 md:px-10 bg-[#F5F7F3] min-h-screen font-sans antialiased">
    <FarmerHeader title="Guild Book" />

    <div v-if="guide" class="space-y-8">
      <section class="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-xs">
        <div class="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div class="relative min-h-[360px] overflow-hidden bg-gray-100">
            <img :src="guide.image" :alt="`${guide.name} crop`" class="absolute inset-0 h-full w-full object-cover" @error="useFallbackImage" />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-950/10 to-transparent"></div>
            <NuxtLink
              to="/farmer/guildbook"
              class="absolute left-5 top-5 inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-gray-700 shadow-sm transition hover:text-[#2d6a4f]"
            >
              <ArrowLeft class="h-4 w-4" />
              Back
            </NuxtLink>
            <div class="absolute bottom-5 left-5 right-5 flex flex-wrap items-center gap-2">
              <span class="rounded-full bg-white/95 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#2d6a4f]">{{ guide.category }}</span>
              <span class="rounded-full bg-amber-100/95 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-800">{{ guide.marketSignal }}</span>
            </div>
          </div>

          <div class="p-6 md:p-8">
            <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p class="text-xs font-extrabold uppercase tracking-widest text-[#2d6a4f]">Crop investment guide</p>
                <h1 class="mt-2 text-4xl font-black tracking-tight text-gray-950">{{ guide.name }}</h1>
                <p class="mt-3 max-w-2xl text-sm leading-6 text-gray-500">{{ guide.description }}</p>
              </div>
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2d6a4f] px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#1b4332] active:scale-[0.98]"
                @click="printGuide"
              >
                <Printer class="h-4 w-4" />
                Print PDF
              </button>
            </div>

            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              <div v-for="item in quickFacts" :key="item.label" class="rounded-2xl border border-gray-100 bg-[#F5F7F3] p-4">
                <p class="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">{{ item.label }}</p>
                <p class="mt-1 text-sm font-black leading-5 text-gray-900">{{ item.value }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div class="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-xs">
          <div class="flex items-center gap-3">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-[#2d6a4f]">
              <TrendingUp class="h-5 w-5" />
            </span>
            <div>
              <p class="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Popularity reason</p>
              <h2 class="text-xl font-black text-gray-950">Why farmers watch this crop</h2>
            </div>
          </div>
          <ul class="mt-5 space-y-3">
            <li v-for="reason in guide.whyPopular" :key="reason" class="flex gap-3 rounded-xl bg-[#F5F7F3] p-4 text-sm leading-6 text-gray-600">
              <CheckCircle2 class="mt-0.5 h-5 w-5 shrink-0 text-[#2d6a4f]" />
              <span>{{ reason }}</span>
            </li>
          </ul>
        </div>

        <div class="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-xs">
          <div class="mb-5 flex items-center justify-between gap-4">
            <div>
              <p class="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Field method</p>
              <h2 class="text-xl font-black text-gray-950">How to plant it</h2>
            </div>
            <span class="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#2d6a4f]">
              {{ guide.steps.length }} steps
            </span>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <article v-for="(step, index) in guide.steps" :key="step.title" class="overflow-hidden rounded-2xl border border-gray-100 bg-[#F5F7F3]">
              <img :src="step.image" :alt="step.title" class="h-36 w-full object-cover" @error="useFallbackImage" />
              <div class="p-4">
                <span class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#2d6a4f] text-xs font-black text-white">{{ index + 1 }}</span>
                <h3 class="mt-3 text-sm font-black text-gray-900">{{ step.title }}</h3>
                <p class="mt-2 text-xs leading-5 text-gray-500">{{ step.detail }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="grid gap-8 xl:grid-cols-3">
        <div class="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-xs xl:col-span-2">
          <div class="flex items-center gap-3">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <Sprout class="h-5 w-5" />
            </span>
            <div>
              <p class="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Crop care</p>
              <h2 class="text-xl font-black text-gray-950">How to take care of it</h2>
            </div>
          </div>

          <div class="mt-5 grid gap-3 md:grid-cols-3">
            <div v-for="care in guide.care" :key="care" class="rounded-2xl border border-gray-100 bg-[#F5F7F3] p-4 text-sm leading-6 text-gray-600">
              {{ care }}
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200/60 bg-[#173827] p-6 text-white shadow-xs">
          <div class="flex items-center gap-3">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
              <CalendarDays class="h-5 w-5" />
            </span>
            <div>
              <p class="text-[10px] font-extrabold uppercase tracking-widest text-emerald-200/80">Harvest timing</p>
              <h2 class="text-xl font-black">When to harvest</h2>
            </div>
          </div>
          <p class="mt-5 text-sm leading-7 text-emerald-50/90">{{ guide.harvest }}</p>
        </div>
      </section>

      <section class="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div class="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-xs">
          <div class="flex items-center gap-3">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <MapPin class="h-5 w-5" />
            </span>
            <div>
              <p class="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Cambodia market</p>
              <h2 class="text-xl font-black text-gray-950">Where it sells best</h2>
            </div>
          </div>
          <ul class="mt-5 space-y-3">
            <li v-for="market in guide.sellBest" :key="market" class="rounded-xl bg-[#F5F7F3] p-4 text-sm font-semibold leading-6 text-gray-700">
              {{ market }}
            </li>
          </ul>
        </div>

        <div class="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-xs">
          <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Regular buyer contacts</p>
              <h2 class="text-xl font-black text-gray-950">Who accepts this crop often</h2>
            </div>
            <span class="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Demo records</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr class="border-b border-gray-100">
                  <th class="pb-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Buyer</th>
                  <th class="pb-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Role</th>
                  <th class="pb-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Location</th>
                  <th class="pb-3 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Contact</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="contact in guide.contacts" :key="contact.phone" class="group">
                  <td class="py-4 text-sm font-black text-gray-900">{{ contact.name }}</td>
                  <td class="py-4 text-sm text-gray-600">{{ contact.role }}</td>
                  <td class="py-4 text-sm text-gray-600">{{ contact.location }}</td>
                  <td class="py-4">
                    <a :href="`tel:${contact.phone.replaceAll(' ', '')}`" class="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black text-[#2d6a4f] transition group-hover:bg-emerald-100">
                      <Phone class="h-3.5 w-3.5" />
                      {{ contact.phone }}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
            Confirm price, volume, grading, and delivery date with the buyer before committing large planting area.
          </p>
        </div>
      </section>
    </div>

    <div v-else class="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <p class="text-lg font-black text-gray-900">Guide not found.</p>
      <NuxtLink to="/farmer/guildbook" class="mt-4 inline-flex items-center justify-center rounded-xl bg-[#2d6a4f] px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-white">
        Back to Guild Book
      </NuxtLink>
    </div>
  </main>
</template>

<script setup>
definePageMeta({
  middleware: 'farmer',
  layout: 'farmer'
})

import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Phone,
  Printer,
  Sprout,
  TrendingUp
} from 'lucide-vue-next'
import { findCropGuide } from '~/data/cropGuides'

const route = useRoute()
const guide = computed(() => findCropGuide(String(route.params.id)))

const quickFacts = computed(() => {
  if (!guide.value) return []

  return [
    { label: 'Best season', value: guide.value.season },
    { label: 'Crop cycle', value: guide.value.estimatedCycle },
    { label: 'Strong areas', value: guide.value.bestAreas },
    { label: 'Updated', value: guide.value.lastUpdated }
  ]
})

function printGuide() {
  window.print()
}

function useFallbackImage(event) {
  event.target.src = '/images/farm-banner.jpg'
}
</script>

<style scoped>
@media print {
  main {
    background: #fff !important;
    color: #111827;
    padding: 0 !important;
  }

  header,
  button,
  a[href="/farmer/guildbook"] {
    display: none !important;
  }

  section,
  article,
  div {
    box-shadow: none !important;
    break-inside: avoid;
  }

  section {
    border-color: #d1d5db !important;
    margin-bottom: 14px;
  }

  img {
    max-height: 220px;
  }
}
</style>
