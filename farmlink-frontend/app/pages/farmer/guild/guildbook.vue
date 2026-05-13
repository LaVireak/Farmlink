<template>
  

  <main class="max-canvas bg-[#f7fdf4] px-4 py-8">
    
    <div class="flex gap-6">
      <FarmerSideBar />

      <aside class="flex-1">
        <FarmerHeader title="Guild Book" />

        <!-- Search & Sort Controls -->
        <div class="mt-4 flex items-center gap-3">
          <input v-model="search" placeholder="Search guild entries..." class="flex-1 border rounded-full px-4 py-2" />
          <div class="flex items-center gap-2">
            <button @click="setSort('asc')" :class="sortOrder === 'asc' ? activeSortClass : inactiveSortClass" class="px-3 py-2 rounded">A→Z</button>
            <button @click="setSort('desc')" :class="sortOrder === 'desc' ? activeSortClass : inactiveSortClass" class="px-3 py-2 rounded">Z→A</button>
          </div>
        </div>

        <!-- Grouped List A-D -->
        <div class="mt-6 space-y-6">
          <section v-for="group in grouped" :key="group.letter">
            <h4 class="text-3xl italic font-bold mb-2">Category {{ group.letter }}</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div v-for="entry in group.items" :key="entry.name" class="bg-white border-2 border-black rounded-md p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 active:translate-y-1 transition-all">
                <h3 class="text-lg font-bold mb-2">{{ entry.name }}</h3>
                <p class="text-gray-600 mb-4">{{ entry.description }}</p>
                <div class="flex items-center gap-4">
                  <span class="text-sm text-gray-500">Last updated: {{ entry.lastUpdated }}</span>
                  <NuxtLink :to="`/farmer/guild/${entry.id}`" class="ml-auto bg-[#1f7a2e] text-white px-3 py-1 rounded uppercase text-xs inline-flex items-center justify-center">View Details</NuxtLink>
                </div>
              </div>
              
            </div>
            <div class="mt-10 border-b-2 border-black"></div>
          </section>
          
        </div>

      </aside>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const sortOrder = ref('asc')

const activeSortClass = 'bg-[#1f7a2e] text-white'
const inactiveSortClass = 'bg-white text-gray-700 border'

function setSort(o) {
  sortOrder.value = o
}

// sample entries: categories A-D, two items each
const guildEntries = ref([
  { id: 'apple', name: 'Apple', description: 'Sweet red apple', lastUpdated: '2026-05-01', letter: 'A' },
  { id: 'avocado', name: 'Avocado', description: 'Creamy and nutritious', lastUpdated: '2026-04-28', letter: 'A' },
  { id: 'azrmor', name: 'Azrmor', description: 'Protective gear', lastUpdated: '2026-04-28', letter: 'A' },
  { id: 'banana', name: 'Banana', description: 'Tropical yellow fruit', lastUpdated: '2026-03-12', letter: 'B' },
  { id: 'beetroot', name: 'Beetroot', description: 'Root vegetable, great for salads', lastUpdated: '2026-02-20', letter: 'B' },
  { id: 'carrot', name: 'Carrot', description: 'Crunchy orange veggie', lastUpdated: '2026-01-05', letter: 'C' },
  { id: 'cucumber', name: 'Cucumber', description: 'Cool and refreshing', lastUpdated: '2025-12-11', letter: 'C' },
  { id: 'date', name: 'Date', description: 'Sweet dried fruit', lastUpdated: '2025-11-02', letter: 'D' },
  { id: 'daikon', name: 'Daikon', description: 'Large white radish', lastUpdated: '2025-10-09', letter: 'D' }
])

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return guildEntries.value.filter(e => {
    if (!q) return true
    return e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
  })
})

// derive letters from data and sort letters according to sortOrder (A->Z or Z->A)
const grouped = computed(() => {
  const lettersSet = Array.from(new Set(filtered.value.map(e => e.letter)))
  lettersSet.sort((a, b) => {
    return sortOrder.value === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
  })

  return lettersSet.map(letter => ({
    letter,
    // items inside each letter are always sorted A->Z
    items: filtered.value
      .filter(e => e.letter === letter)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
  }))
})
</script>