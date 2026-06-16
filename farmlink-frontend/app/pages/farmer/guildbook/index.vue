<template>
  <main class="px-6 py-8 md:px-10 bg-[#F5F7F3] min-h-screen font-sans antialiased">
    <FarmerHeader title="Guild Book" />

    <section class="mb-8 border-b border-gray-200/60 pb-6">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-xs font-extrabold uppercase tracking-widest text-[#2d6a4f]">Crop investment guide</p>
          <h2 class="mt-2 max-w-3xl text-3xl font-black tracking-tight text-gray-950">
            Practical crop guides for farmers planning the next profitable planting season.
          </h2>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Compare popular crops, review planting steps, buyer channels, harvest timing, and print any guide for field planning.
          </p>
        </div>

        <div class="grid grid-cols-3 gap-3 sm:min-w-[420px]">
          <div class="rounded-2xl border border-gray-200/60 bg-white p-4 shadow-xs">
            <p class="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Guides</p>
            <p class="mt-1 text-2xl font-black text-gray-900">{{ cropGuides.length }}</p>
          </div>
          <div class="rounded-2xl border border-gray-200/60 bg-white p-4 shadow-xs">
            <p class="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Fastest</p>
            <p class="mt-1 text-lg font-black text-emerald-700">Cucumber</p>
          </div>
          <div class="rounded-2xl border border-gray-200/60 bg-white p-4 shadow-xs">
            <p class="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Markets</p>
            <p class="mt-1 text-2xl font-black text-gray-900">12+</p>
          </div>
        </div>
      </div>
    </section>

    <div class="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
      <div class="relative">
        <Search class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Search by crop, market, category, or buyer..."
          class="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-800 shadow-xs transition focus:border-[#2d6a4f] focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
        />
      </div>

      <div class="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-200/70 bg-white p-1.5 shadow-xs">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          @click="selectedCategory = category"
          class="rounded-xl px-4 py-2 text-xs font-bold transition"
          :class="selectedCategory === category ? 'bg-[#2d6a4f] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <section class="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <article
        v-for="guide in filteredGuides"
        :key="guide.id"
        class="group overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20 hover:shadow-lg"
      >
        <div class="relative h-52 overflow-hidden bg-gray-100">
          <img :src="guide.image" :alt="`${guide.name} crop`" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" @error="useFallbackImage" />
          <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950/80 to-transparent p-4">
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#2d6a4f]">
                {{ guide.category }}
              </span>
              <span class="rounded-full bg-amber-100/95 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                {{ guide.marketSignal }}
              </span>
            </div>
          </div>
        </div>

        <div class="p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-xl font-black text-gray-950">{{ guide.name }}</h3>
              <p class="mt-1 text-sm leading-6 text-gray-500">{{ guide.description }}</p>
            </div>
            <button
              type="button"
              class="rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:border-[#2d6a4f] hover:bg-emerald-50 hover:text-[#2d6a4f]"
              :title="`Print ${guide.name} guide`"
              @click="printGuide(guide)"
            >
              <Printer class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-5 grid grid-cols-2 gap-3">
            <div class="rounded-xl bg-[#F5F7F3] p-3">
              <p class="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Crop Cycle</p>
              <p class="mt-1 text-sm font-black text-gray-800">{{ guide.estimatedCycle }}</p>
            </div>
            <div class="rounded-xl bg-[#F5F7F3] p-3">
              <p class="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Best Areas</p>
              <p class="mt-1 truncate text-sm font-black text-gray-800">{{ guide.bestAreas }}</p>
            </div>
          </div>

          <div class="mt-5">
            <p class="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">Why farmers watch it</p>
            <ul class="mt-2 space-y-2 text-sm text-gray-600">
              <li v-for="reason in guide.whyPopular.slice(0, 2)" :key="reason" class="flex gap-2 leading-5">
                <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-[#2d6a4f]" />
                <span>{{ reason }}</span>
              </li>
            </ul>
          </div>

          <div class="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
            <NuxtLink
              :to="`/farmer/guildbook/${guide.id}`"
              class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2d6a4f] px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#1b4332] active:scale-[0.98]"
            >
              View Full Guide
              <ArrowRight class="h-4 w-4" />
            </NuxtLink>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-gray-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-[#2d6a4f]"
              @click="printGuide(guide)"
            >
              PDF
            </button>
          </div>
        </div>
      </article>
    </section>

    <div v-if="filteredGuides.length === 0" class="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <p class="text-sm font-bold text-gray-700">No crop guides match your search.</p>
      <button type="button" class="mt-3 text-xs font-extrabold uppercase tracking-wider text-[#2d6a4f]" @click="resetFilters">
        Clear filters
      </button>
    </div>

    <section v-if="selectedPrintGuide" class="print-guide">
      <div class="print-cover">
        <p>Farm Link Guild Book</p>
        <h1>{{ selectedPrintGuide.name }}</h1>
        <span>{{ selectedPrintGuide.category }} | {{ selectedPrintGuide.estimatedCycle }}</span>
      </div>
      <img :src="selectedPrintGuide.image" :alt="`${selectedPrintGuide.name} guide image`" @error="useFallbackImage" />
      <h2>Why farmers choose it</h2>
      <ul>
        <li v-for="item in selectedPrintGuide.whyPopular" :key="item">{{ item }}</li>
      </ul>
      <h2>Planting steps</h2>
      <div v-for="step in selectedPrintGuide.steps" :key="step.title" class="print-step">
        <img :src="step.image" :alt="step.title" @error="useFallbackImage" />
        <div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.detail }}</p>
        </div>
      </div>
      <h2>Care plan</h2>
      <ul>
        <li v-for="item in selectedPrintGuide.care" :key="item">{{ item }}</li>
      </ul>
      <h2>Harvest window</h2>
      <p>{{ selectedPrintGuide.harvest }}</p>
      <h2>Where it sells best in Cambodia</h2>
      <ul>
        <li v-for="market in selectedPrintGuide.sellBest" :key="market">{{ market }}</li>
      </ul>
      <h2>Regular buyer contacts</h2>
      <table>
        <thead>
          <tr>
            <th>Buyer</th>
            <th>Role</th>
            <th>Location</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contact in selectedPrintGuide.contacts" :key="contact.phone">
            <td>{{ contact.name }}</td>
            <td>{{ contact.role }}</td>
            <td>{{ contact.location }}</td>
            <td>{{ contact.phone }}</td>
          </tr>
        </tbody>
      </table>
      <p class="print-note">Buyer contacts are sample Farm Link marketplace records for planning and demo use. Confirm price, volume, and delivery terms before planting at scale.</p>
    </section>
  </main>
</template>

<script setup>
definePageMeta({
  middleware: 'farmer',
  layout: 'farmer'
})

import { computed, nextTick, ref } from 'vue'
import { ArrowRight, CheckCircle2, Printer, Search } from 'lucide-vue-next'
import { cropGuides } from '~/data/cropGuides'

const search = ref('')
const selectedCategory = ref('All')
const selectedPrintGuide = ref(null)

const categories = computed(() => ['All', ...new Set(cropGuides.map((guide) => guide.category))])

const filteredGuides = computed(() => {
  const query = search.value.trim().toLowerCase()

  return cropGuides.filter((guide) => {
    const matchesCategory = selectedCategory.value === 'All' || guide.category === selectedCategory.value
    const searchable = [
      guide.name,
      guide.category,
      guide.description,
      guide.bestAreas,
      guide.marketSignal,
      ...guide.sellBest,
      ...guide.contacts.map((contact) => `${contact.name} ${contact.role} ${contact.location}`)
    ].join(' ').toLowerCase()

    return matchesCategory && (!query || searchable.includes(query))
  })
})

function resetFilters() {
  search.value = ''
  selectedCategory.value = 'All'
}

async function printGuide(guide) {
  selectedPrintGuide.value = guide
  await nextTick()
  window.print()
}

function useFallbackImage(event) {
  event.target.src = '/images/farm-banner.jpg'
}
</script>

<style scoped>
.print-guide {
  display: none;
}

@media print {
  main > :not(.print-guide) {
    display: none !important;
  }

  .print-guide {
    display: block;
    color: #111827;
    font-family: Arial, sans-serif;
    padding: 0;
  }

  .print-cover {
    border-bottom: 3px solid #2d6a4f;
    margin-bottom: 18px;
    padding-bottom: 14px;
  }

  .print-cover p {
    color: #2d6a4f;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.12em;
    margin: 0 0 6px;
    text-transform: uppercase;
  }

  .print-cover h1 {
    font-size: 30px;
    margin: 0 0 6px;
  }

  .print-cover span {
    color: #4b5563;
    font-size: 13px;
  }

  .print-guide > img {
    border-radius: 12px;
    height: 210px;
    margin-bottom: 16px;
    object-fit: cover;
    width: 100%;
  }

  .print-guide h2 {
    color: #1b4332;
    font-size: 17px;
    margin: 18px 0 8px;
  }

  .print-guide h3 {
    font-size: 14px;
    margin: 0 0 5px;
  }

  .print-guide p,
  .print-guide li,
  .print-guide td,
  .print-guide th {
    font-size: 12px;
    line-height: 1.45;
  }

  .print-step {
    align-items: center;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    display: grid;
    gap: 12px;
    grid-template-columns: 120px 1fr;
    margin-bottom: 10px;
    padding: 8px;
    break-inside: avoid;
  }

  .print-step img {
    border-radius: 8px;
    height: 82px;
    object-fit: cover;
    width: 120px;
  }

  .print-guide table {
    border-collapse: collapse;
    margin-top: 8px;
    width: 100%;
  }

  .print-guide th,
  .print-guide td {
    border: 1px solid #d1d5db;
    padding: 8px;
    text-align: left;
  }

  .print-guide th {
    background: #ecfdf5;
  }

  .print-note {
    border-top: 1px solid #d1d5db;
    color: #6b7280;
    margin-top: 16px;
    padding-top: 10px;
  }
}
</style>
