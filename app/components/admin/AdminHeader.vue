<template>
    <header class="flex justify-between items-center mb-10">
        <h1 class="text-3xl font-black text-[#15803d]">{{ title }}</h1>
        <div class="flex items-center gap-6">
            <div class="relative">
                <input type="text" placeholder="Search" class="bg-white border-none rounded-xl py-3 pl-12 pr-6 w-80 shadow-sm text-sm focus:ring-2 focus:ring-[#0a4d1e]/10" />
                <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <div class="relative" id="profile-menu">
                <button @click.stop="toggleProfile" class="flex items-center space-x-1 cursor-pointer group focus:outline-none">
                    <img src="https://i.pravatar.cc/100?img=12" class="w-10 h-10 rounded-full border-2 border-white shadow-md" />
                    <div class="text-left">
                        <p class="text-sm font-black text-gray-800 flex items-center gap-1">
                            Channary Sok
                            <svg class="w-4 h-4 text-gray-400 group-hover:text-[#0a4d1e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                        </p>
                    </div>
                </button>

                <div v-show="profileOpen" class="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div class="p-3 border-b">
                        <ul>
                            <li><NuxtLink to="/admin/settings/profile" class="block p-2 hover:bg-gray-100">Profile</NuxtLink></li>
                            <li><NuxtLink to="/admin/settings/security" class="block p-2 hover:bg-gray-100">Security</NuxtLink></li>
                            <li><NuxtLink to="/admin/settings/notifications" class="block p-2 hover:bg-gray-100">Notification</NuxtLink></li>
                            <li><NuxtLink to="/admin/settings/appearance" class="block p-2 hover:bg-gray-100">Appearance</NuxtLink></li>
                            <li><NuxtLink to="/admin/settings/team" class="block p-2 hover:bg-gray-100">Team</NuxtLink></li>
                            <li><NuxtLink to="#" class="block p-2 hover:bg-gray-100">Logout</NuxtLink></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
const props = defineProps({
    title: { type: String, default: 'Setting Profile' }
})
const { title } = props

const profileOpen = ref(false)


const toggleProfile = () => {
  profileOpen.value = !profileOpen.value}

</script>
