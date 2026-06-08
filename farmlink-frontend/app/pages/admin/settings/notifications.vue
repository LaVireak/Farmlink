<template>
  <div class="min-h-screen bg-[#f7fdf4] flex font-sans text-slate-900">
    <main class="flex-1 p-10">
      <AdminProfileDropdown/>
      <div class="grid grid-cols-12 gap-10">
        
        <div class="col-span-9 bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-50">
          <h2 class="text-2xl font-black text-[#15803d] mb-2">Notification Settings</h2>
          <p class="text-sm text-gray-500 mb-6">Manage how and when you receive platform alerts.</p>

          <form @submit.prevent="saveChanges" class="space-y-8">
            <section>
              <h3 class="text-base font-semibold mb-4">Notification Channels</h3>
              <div class="flex flex-col gap-4">
                <label class="inline-flex items-center gap-3">
                  <input type="checkbox" v-model="channels.email" class="sr-only" />
                  <span :class="['w-11 h-6 flex items-center rounded-full p-1 transition-colors', channels.email ? 'bg-green-700' : 'bg-gray-200']">
                    <span :class="['bg-white w-4 h-4 rounded-full shadow transform transition-transform', channels.email ? 'translate-x-5' : 'translate-x-0']"></span>
                  </span>
                  <span class="font-medium">Email</span>
                </label>

                <label class="inline-flex items-center gap-3">
                  <input type="checkbox" v-model="channels.inApp" class="sr-only" />
                  <span :class="['w-11 h-6 flex items-center rounded-full p-1 transition-colors', channels.inApp ? 'bg-green-700' : 'bg-gray-200']">
                    <span :class="['bg-white w-4 h-4 rounded-full shadow transform transition-transform', channels.inApp ? 'translate-x-5' : 'translate-x-0']"></span>
                  </span>
                  <span class="font-medium">In-App notifications</span>
                </label>
              </div>
            </section>

            <section>
              <h3 class="text-base font-semibold mb-4">Activity Alerts</h3>
              <div class="grid grid-cols-2 gap-6 bg-[#f9fdf8] p-6 rounded-lg">
                <label v-for="(opt, i) in activityOptions" :key="opt.key" class="flex items-center gap-4">
                    <input type="checkbox" v-model="activity[opt.key]" class="sr-only" />
                    <span :class="['w-10 h-5 flex items-center rounded-full p-1 transition-colors', activity[opt.key] ? 'bg-green-700' : 'bg-gray-200']">
                      <span :class="['bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform', activity[opt.key] ? 'translate-x-4' : 'translate-x-0']"></span>
                    </span>
                  <label class="inline-flex items-center cursor-pointer">
                    <div class="flex items-center gap-3">
                        <span class="text-sm">{{ opt.label }}</span>   
                    </div>
                  </label>
                </label>
              </div>
            </section>

            <section>
              <h3 class="text-base font-semibold mb-3">Frequency</h3>
              <div class="max-w-xs">
                <select v-model="frequency" class="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm">
                  <option value="instant">Instant</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </section>

            <div class="flex justify-end gap-4">
              <button type="submit" class="px-6 py-3 bg-green-700 text-white rounded-lg text-sm">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const channels = ref({ email: true, inApp: true })

const activityOptions = [
  { key: 'newFarmer', label: 'New Farmer Registration' },
  { key: 'productApproval', label: 'Product Approval' },
  { key: 'newDispute', label: 'New Dispute' },
  { key: 'lowStock', label: 'Low Stock Warnings' },
  { key: 'paymentIssues', label: 'Payment Issues' },
  { key: 'systemUpdates', label: 'System Updates' },
]

const activity = ref<Record<string, boolean>>({
  newFarmer: true,
  productApproval: true,
  newDispute: false,
  lowStock: true,
  paymentIssues: false,
  systemUpdates: true,
})

const frequency = ref('instant')

function saveChanges() {
  // placeholder: send to server
  alert('Notification settings saved')
}

function resetChanges() {
  // reset to defaults (could fetch original values instead)
  channels.value = { email: true, inApp: true }
  activity.value = {
    newFarmer: true,
    productApproval: true,
    newDispute: false,
    lowStock: true,
    paymentIssues: false,
    systemUpdates: true,
  }
  frequency.value = 'instant'
}

</script>

