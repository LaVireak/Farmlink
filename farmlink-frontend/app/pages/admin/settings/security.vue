<template>
  <div class="min-h-screen bg-[#f7fdf4] flex font-sans text-slate-900">
    <main class="flex-1 p-10">
      <AdminProfileDropdown/>
      <div class="grid grid-cols-12 gap-10">
        
        <div class="col-span-9 bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-50">
          <h2 class="text-2xl font-black text-[#15803d] mb-6">Security Settings</h2>

          <form @submit.prevent="saveSecurity" class="space-y-6">
            <div>
              <label class="block text-sm font-semibold mb-2">Change Password</label>
              <input v-model="currentPassword" type="password" placeholder="Current Password" class="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm" />
            </div>

            <div>
              <label class="block text-sm font-semibold mb-2">New Password</label>
              <input v-model="newPassword" type="password" placeholder="New Password" class="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm" />

              <div class="mt-3">
                <div class="flex items-center gap-2">
                  <div v-for="n in 5" :key="n" class="w-1/5 h-2 rounded-full" :class="n <= strengthSegments ? 'bg-green-800' : 'bg-gray-200'"></div>
                </div>
                <div class="text-sm text-green-800 font-medium mt-2" v-if="strengthLabel">{{ strengthLabel }}</div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold mb-2">Confirm Password</label>
              <input v-model="confirmPassword" type="password" placeholder="Confirm Password" class="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 px-4 text-sm" />
            </div>

            <div class="pt-4 border-t">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold">Two-Factor Authentication</h3>
                  <p class="text-sm text-gray-500">Enable two-factor authentication for enhanced account security. Follow setup steps.</p>
                </div>
                <label class="inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="twoFactor" class="sr-only" />
                  <span :class="['w-11 h-6 flex items-center rounded-full p-1 transition-colors', twoFactor ? 'bg-green-700' : 'bg-gray-200']">
                    <span :class="['bg-white w-4 h-4 rounded-full shadow transform transition-transform', twoFactor ? 'translate-x-5' : 'translate-x-0']"></span>
                  </span>
                </label>
              </div>
            </div>

            <div class="pt-6">
              <h4 class="font-semibold mb-3">Active Sessions</h4>
              <div class="border rounded-lg overflow-hidden">
                <table class="w-full text-sm">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="text-left p-4">DEVICE</th>
                      <th class="text-left p-4">BROWSER</th>
                      <th class="text-left p-4">LOCATION</th>
                      <th class="text-left p-4">LAST ACTIVE</th>
                      <th class="text-left p-4">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(s, idx) in sessions" :key="s.id" class="border-t">
                      <td class="p-4">{{ s.device }}</td>
                      <td class="p-4">{{ s.browser }}</td>
                      <td class="p-4">{{ s.location }}</td>
                      <td class="p-4">{{ s.lastActive }}</td>
                      <td class="p-4"><button type="button" @click="logoutSession(idx)" class="text-red-500">Logout</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="flex justify-end">
              <button type="submit" class="bg-green-700 text-white px-6 py-3 rounded-lg">Save Security Settings</button>
            </div>
          </form>
          </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

definePageMeta({
  layout: 'admin'
})

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const twoFactor = ref(true)

const sessions = ref([
  { id: 1, device: 'Desktop', browser: 'Chrome', location: 'Phnom Penh, Cambodia', lastActive: 'Just now' }
])

const strengthScore = computed(() => {
  const pwd = newPassword.value || ''
  let score = 0
  if (pwd.length >= 8) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return score
})

const strengthSegments = computed(() => Math.min(5, strengthScore.value))

const strengthLabel = computed(() => {
  const s = strengthScore.value
  if (s >= 4) return 'Strong'
  if (s === 3) return 'Good'
  if (s === 2) return 'Weak'
  if (s <= 1 && newPassword.value.length > 0) return 'Very Weak'
  return ''
})

function saveSecurity() {
  // basic validation
  if (newPassword.value && newPassword.value !== confirmPassword.value) {
    alert('New password and confirm password do not match.')
    return
  }
  // pretend to save
  alert('Security settings saved')
}

function logoutSession(index: number) {
  sessions.value.splice(index, 1)
}

watch(newPassword, (v) => {
  // placeholder: could trigger live checks or API
})

</script>
