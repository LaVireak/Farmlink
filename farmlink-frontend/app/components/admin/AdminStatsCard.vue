<template>
  <div class="bg-surface-container-lowest shadow rounded-2xl p-6 flex justify-between items-center">
    <div>
      <h3 class="text-on-surface-variant text-sm">{{ title }}</h3>
      <p class="text-secondary text-2xl font-bold">{{ value }}</p>

      <div class="flex items-center text-sm mt-1 gap-1">
        <component
          :is="isPositive ? ArrowUpRight : ArrowDownRight"
          :class="isPositive ? 'text-secondary' : 'text-error'"
          class="w-4 h-4"
        />
        <span :class="isPositive ? 'text-secondary' : 'text-error'">
          {{ percent }}%
        </span>
        <span class="text-on-surface-variant ml-1">vs last month</span>
      </div>
    </div>

    <div class="bg-surface-container p-3 rounded-xl">
      <component :is="icon" class="w-6 h-6 text-on-surface-variant" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowDownRight, ArrowUpRight } from 'lucide-vue-next'

const props = defineProps({
  title: String,
  value: String,
  percent: Number,
  icon: [Object, Function],
})

const isPositive = computed(() => (props.percent ?? 0) >= 0)
</script>