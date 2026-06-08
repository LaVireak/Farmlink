<template>
  <div class="min-h-screen bg-[#f7fdf4] flex font-sans text-slate-900">
    <main class="flex-1 p-10">
      <AdminProfileDropdown/>
      <div class="grid grid-cols-12 gap-10">
        
        <div class="col-span-9 bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-50">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-black text-[#15803d]">Team Management</h2>
            <button @click="openInvite" class="bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <span class="text-2xl leading-none">+</span>
              <span>Invite New Admin</span>
            </button>
          </div>

          <div class="overflow-hidden rounded-lg border border-gray-100">
            <table class="w-full text-sm">
              <thead class="bg-white">
                <tr class="text-left text-gray-500">
                  <th class="p-4">Name</th>
                  <th class="p-4">Role</th>
                  <th class="p-4">Joined Date</th>
                  <th class="p-4">Status</th>
                  <th class="p-4">Action</th>
                </tr>
              </thead>
              <tbody class="bg-white">
                <tr v-for="member in members" :key="member.id" class="border-t">
                  <td class="p-4 flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full overflow-hidden bg-green-100 flex items-center justify-center text-green-900 text-xs font-bold">
                      <img v-if="member.avatar" :src="member.avatar" class="w-full h-full object-cover" />
                      <span v-else>{{ memberInitials(member) }}</span>
                    </div>
                    <div>
                      <div class="font-semibold">{{ member.name }}</div>
                      <div class="text-xs text-gray-500">{{ member.email }}</div>
                    </div>
                  </td>
                  <td class="p-4">
                    <span :class="['px-3 py-1 rounded-full text-xs font-bold', roleClass(member.role)]">{{ member.role }}</span>
                  </td>
                  <td class="p-4 text-gray-600">{{ member.joined }}</td>
                  <td class="p-4">
                    <span class="flex items-center gap-2">
                      <span :class="member.active ? 'w-2 h-2 rounded-full bg-green-500 inline-block' : 'w-2 h-2 rounded-full bg-gray-300 inline-block'"></span>
                      <span class="text-sm">{{ member.active ? 'Active' : 'Inactive' }}</span>
                    </span>
                  </td>
                  <td class="p-4 text-sm text-green-700">
                    <button @click="editMember(member.id)" class="mr-4">Edit</button>
                    <button @click="removeMember(member.id)" class="text-gray-400">Remove</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Invite Modal -->
          <div v-if="showInvite" class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="absolute inset-0 bg-black/40" @click="closeInvite"></div>
            <div class="bg-white rounded-xl p-8 w-full max-w-lg z-10 shadow-xl">
              <h3 class="text-xl font-bold mb-4">Invite New Admin</h3>

              <form @submit.prevent="sendInvite" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Full Name</label>
                  <input v-model="inviteForm.name" type="text" placeholder="e.g., John Doe" class="w-full border border-gray-200 rounded-lg px-4 py-3" />
                </div>

                <div>
                  <label class="block text-sm font-medium mb-1">Email Address</label>
                  <input v-model="inviteForm.email" type="email" placeholder="e.g., john.doe@farmlink.com" class="w-full border border-gray-200 rounded-lg px-4 py-3" />
                </div>

                <div>
                  <label class="block text-sm font-medium mb-1">Role</label>
                  <div class="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-sm text-gray-600">Admin</div>
                </div>

                <div class="flex items-center gap-3">
                  <input type="checkbox" v-model="inviteForm.allPermissions" class="sr-only" id="allPerm" />
                  <label for="allPerm" class="inline-flex items-center gap-3 cursor-pointer">
                    <span :class="['w-11 h-6 flex items-center rounded-full p-1 transition-colors', inviteForm.allPermissions ? 'bg-green-700' : 'bg-gray-200']">
                      <span :class="['bg-white w-4 h-4 rounded-full shadow transform transition-transform', inviteForm.allPermissions ? 'translate-x-5' : 'translate-x-0']"></span>
                    </span>
                    <span>Enable all permissions</span>
                  </label>
                </div>

                <div class="flex justify-end gap-4 mt-4">
                  <button type="button" @click="closeInvite" class="px-4 py-2 border rounded-lg">Cancel</button>
                  <button type="submit" class="px-4 py-2 bg-green-700 text-white rounded-lg">Send Invite</button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth.store'

const config = useRuntimeConfig()
const baseURL = config.public.apiUrl
const auth = useAuthStore()
const staticBase = baseURL.replace(/\/api\/?$/, '')

type TeamMember = {
  id: string | number
  name: string
  email: string
  role: string
  joined: string
  active: boolean
  avatar: string
}

const showInvite = ref(false)

const members = ref<TeamMember[]>([])

const inviteForm = ref({ name: '', email: '', allPermissions: false })

const resolveAvatarUrl = (url?: string | null): string => {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:')) return url
  const normalized = url.replace(/^\/+/, '')
  return `${staticBase}/${normalized}`
}

const mapAdminUser = (user: any): TeamMember => {
  const name = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.email || 'Unknown'
  const avatarValue = user?.avatarUrl ?? user?.avatar_url ?? ''
  return {
    id: user?.id,
    name,
    email: user?.email ?? '—',
    role: 'Admin',
    joined: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—',
    active: String(user?.status ?? '').toLowerCase() === 'active',
    avatar: resolveAvatarUrl(avatarValue),
  }
}

const memberInitials = (member: TeamMember) => {
  const parts = member.name.trim().split(' ').filter(Boolean)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : ''
  const initials = `${first}${last}`.trim()
  if (initials) return initials.toUpperCase()
  return (member.email || 'FM').slice(0, 2).toUpperCase()
}

async function fetchAdmins() {
  const res = await $fetch(`${baseURL}/admin/users`, {
    params: { role: 'admin', take: 1000, skip: 0 },
    headers: auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : undefined,
  })
  const payload = Array.isArray(res)
    ? res
    : ((res as { data?: unknown[] })?.data ?? [])
  members.value = (payload as any[]).map(mapAdminUser)
}

function openInvite() {
  showInvite.value = true
}

function closeInvite() {
  showInvite.value = false
}

function sendInvite() {
  if (!inviteForm.value.name || !inviteForm.value.email) {
    alert('Please enter name and email')
    return
  }
  // add member locally (in real app, call API)
  const id = Date.now()
  members.value.push({ id, name: inviteForm.value.name, email: inviteForm.value.email, role: 'Admin', joined: new Date().toLocaleDateString(), active: true, avatar: '' })
  // reset and close
  inviteForm.value = { name: '', email: '', allPermissions: false }
  showInvite.value = false
  alert('Invite sent')
}

function editMember(id: string | number) {
  alert('Edit member ' + id)
}

function removeMember(id: string | number) {
  members.value = members.value.filter(m => m.id !== id)
}

function roleClass(role: string) {
  if (role === 'Admin') return 'bg-blue-100 text-blue-600'
  return 'bg-gray-100 text-gray-700'
}

onMounted(async () => {
  await auth.hydrate()

  if (!auth.accessToken) {
    await navigateTo('/auth/signin')
    return
  }

  await fetchAdmins()
})

</script>
