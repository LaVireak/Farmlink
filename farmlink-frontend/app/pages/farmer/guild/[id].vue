<template>
  <main class="max-canvas bg-[#f7fdf4] px-4 py-8">
    <div class="flex gap-6">
      <FarmerSideBar />

      <aside class="flex-1">
        <FarmerHeader title="Guild Book" />

        <h2 class="text-3xl italic font-semibold mb-2">{{ entry.name }}</h2>
        <div v-if="entry" class="mt-6 bg-white p-6 rounded-md border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          
          <p class="text-gray-700 mb-4">{{ entry.description }}</p>
          <p class="text-sm text-gray-500">Last updated: {{ entry.lastUpdated }}</p>
          <div class="mt-4">
            <NuxtLink to="/farmer/guild/guildbook" class="inline-block px-3 py-1 bg-gray-100 rounded">Back to Guild</NuxtLink>
          </div>
        </div>

        <div v-else class="mt-6 text-gray-600">Entry not found.</div>
      </aside>
    </div>
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'

// local copy of sample entries (should be replaced by API/shared store in production)
const entries = [
  { id: 'apple', name: 'Apple', description: 'Sweet red apple', lastUpdated: '2026-05-01' },
  { id: 'avocado', name: 'Avocado', description: 'Creamy and nutritious', lastUpdated: '2026-04-28' },
  { id: 'azrmor', name: 'Azrmor', description: 'Protective gear', lastUpdated: '2026-04-28' },
  { id: 'banana', name: 'Banana', description: 'Tropical yellow fruit', lastUpdated: '2026-03-12' },
  { id: 'beetroot', name: 'Beetroot', description: 'Root vegetable', lastUpdated: '2026-02-20' },
  { id: 'carrot', name: 'Carrot', description: 'Crunchy orange veggie', lastUpdated: '2026-01-05' },
  { id: 'cucumber', name: 'Cucumber', description: 'Cool and refreshing', lastUpdated: '2025-12-11' },
  { id: 'date', name: 'Date', description: 'Sweet dried fruit', lastUpdated: '2025-11-02' },
  { id: 'daikon', name: 'Daikon', description: 'Large white radish', lastUpdated: '2025-10-09' }
]

const route = useRoute()
const id = route.params.id
const entry = entries.find(e => e.id === id) || null
</script>

<style scoped>
/* small page-specific styles if needed */
</style>