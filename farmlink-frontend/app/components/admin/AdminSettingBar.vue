<template>
    <div class="col-span-3 bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-outline-variant h-fit">
        <nav class="space-y-1">
            <NuxtLink
                v-for="sub in settingsNav"
                :key="sub.name"
                :to="sub.to"
                class="block px-6 py-4 rounded-2xl font-bold text-sm transition-all"
                :class="route.path === sub.to ? 'bg-secondary text-white' : 'text-on-surface-variant hover:bg-surface-container'">
                {{ sub.name }}
            </NuxtLink>
        </nav>
    </div>
</template>

<script setup lang="ts">
const settingsNav = [
  { name: 'Personal Info', active: false, to: '/admin/settings/profile' },
  { name: 'Security', active: false, to: '/admin/settings/security' },
  { name: 'Notifications', active: false, to: '/admin/settings/notifications' },
  { name: 'Appearance', active: false, to: '/admin/settings/appearance' },
  { name: 'Team', active: false, to: '/admin/settings/team' },
]

import { useRoute } from 'vue-router'
const route = useRoute()
</script>