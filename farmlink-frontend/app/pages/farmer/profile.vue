<template>
  <div class="dashboard-layout">
    <FarmerSideBar />

    <main class="px-8 py-8 w-full">
      <FarmerHeader title="Settings" />

      <div class="flex items-start justify-between mb-8">
        <div>
          <p class="text-gray-700 text-lg font-semibold mt-1.5 max-w-[600px] italic">
            Manage your profile information and settings.
          </p>
        </div>
      </div>

      <!-- Overview Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Account Information (Form Box) -->
        <section class="col-span-2 bg-white rounded-lg p-6 shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Account Information</h3>
          </div>

            <form @submit.prevent="saveAccount">
              <div class="flex items-start gap-4 mb-4">
                <div class="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img v-if="account.picturePreview" :src="account.picturePreview" alt="profile" class="w-full h-full object-cover" />
                  <span v-else class="text-gray-400">No Image</span>
                </div>
                <div class="flex-1">
                  <label class="block text-sm text-gray-600">Profile Photo</label>
                  <input type="file" accept="image/*" @change="onProfilePicChange" class="mt-1 text-sm" />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm text-gray-600">First Name</label>
                  <input :disabled="!editingAccount" v-model="account.firstName" class="mt-1 block w-full rounded border border-black bg-white px-2 py-1" />
                </div>

                <div>
                  <label class="block text-sm text-gray-600">Last Name</label>
                  <input :disabled="!editingAccount" v-model="account.lastName" class="mt-1 block w-full rounded border border-black bg-white px-2 py-1" />
                </div>

                <div>
                  <label class="block text-sm text-gray-600">Phone Number</label>
                  <input :disabled="!editingAccount" v-model="account.phone" class="mt-1 block w-full rounded border border-black bg-white px-2 py-1" />
                </div>

                <div>
                  <label class="block text-sm text-gray-600">Email</label>
                  <input :disabled="true" v-model="account.email" class="mt-1 block w-full rounded border border-black bg-white px-2 py-1" />
                </div>
              </div>
                <div class="flex items-end justify-end mt-3">
                <button type="button" @click="toggleEditAccount" class="text-sm px-3 py-1 border rounded" v-if="!editingAccount">Edit</button>
                <button type="button" @click="cancelEditAccount" class="text-sm px-3 py-1 border rounded" v-else>Save</button>
                </div>
              <!-- <div class="flex items-center justify-between mt-4">
                

                <div class="flex gap-3">
                  <button type="button" @click="changeEmail" class="text-sm text-primary-600">Change Email</button>
                  <button type="button" @click="changePhone" class="text-sm text-primary-600">Change Phone Number</button>
                  <button type="button" @click="changePassword" class="text-sm text-primary-600">Change Password</button>
                </div>
              </div> -->
            </form>
        </section>

        <!-- Farm Address (Form Box) -->
        <section class="col-span-2 bg-white rounded-lg p-6 shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Farm Address</h3>
            <div>
            </div>
          </div>

            <form @submit.prevent="saveFarmAddress">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm text-gray-600">Address Line 1</label>
                  <input :disabled="!editingFarm" v-model="farm.address.line1" class="mt-1 block w-full rounded border border-black bg-white px-2 py-1" />
                </div>

                <div>
                  <label class="block text-sm text-gray-600">City</label>
                  <input :disabled="!editingFarm" v-model="farm.address.city" class="mt-1 block w-full rounded border border-black bg-white px-2 py-1" />
                </div>

                <div>
                  <label class="block text-sm text-gray-600">State</label>
                  <input :disabled="!editingFarm" v-model="farm.address.state" class="mt-1 block w-full rounded border border-black bg-white px-2 py-1" />
                </div>

                <div>
                  <label class="block text-sm text-gray-600">Postal Code</label>
                  <input :disabled="!editingFarm" v-model="farm.address.postal" class="mt-1 block w-full rounded border border-black bg-white px-2 py-1" />
                </div>

                <div>
                  <label class="block text-sm text-gray-600">Country</label>
                  <input :disabled="!editingFarm" v-model="farm.address.country" class="mt-1 block w-full rounded border border-black bg-white px-2 py-1" />
                </div>
              </div>

              <div class="flex items-end justify-end mt-3">
                <button type="button" v-if="!editingFarm" @click="toggleEditFarm" class="text-sm px-3 py-1 border rounded">Edit</button>
                <div v-else class="flex gap-2">
                  <button type="submit" class="text-sm px-3 py-1 border rounded">Save</button>
                </div>
              </div>
            </form>
        </section>

        <!-- Farm Description -->
        <section class="col-span-1 lg:col-span-4 bg-white rounded-lg p-6 shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Farm Description</h3>
            <div>
              <button v-if="!editingDescription" @click="toggleEditDescription" class="text-sm px-3 py-1 border rounded">Edit</button>
              <div v-else class="flex gap-2">
                <button @click="saveDescription" class="text-sm px-3 py-1 border rounded">Save</button>
                <button @click="cancelDescription" class="text-sm px-3 py-1 border rounded">Cancel</button>
              </div>
            </div>
          </div>

          <div v-if="!editingDescription">
            <p class="text-gray-700 text-sm leading-relaxed">{{ farm.description }}</p>
          </div>

          <div v-else>
            <textarea v-model="farm.description" rows="4" class="w-full rounded border border-black p-3"></textarea>
          </div>
        </section>

        <!-- Farm Picture -->
        <section class="col-span-1 lg:col-span-4 bg-white rounded-lg p-6 shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Farm Pictures</h3>
          </div>

          <div class="flex items-center gap-4">
            <!-- Add button -->
            <div>
              <button @click="triggerFarmFileInput" type="button" class="w-[50px] h-[50px] rounded border flex items-center justify-center bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <input ref="farmPicInputRef" type="file" accept="image/*" @change="onFarmPicChange" class="hidden" />
            </div>

            <!-- Thumbnails (right-to-left) -->
            <div class="flex flex-row-reverse items-center gap-2">
              <div v-for="(pic, idx) in farm.pictures" :key="idx" class="relative w-[50px] h-[50px] rounded overflow-hidden border">
                <button @click.stop="removeFarmPicture(idx)" class="absolute -top-1 -right-1 z-10 w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs text-red-600 border">
                  ×
                </button>
                <div @click="selectFarmPicture(idx)" class="w-full h-full cursor-pointer">
                  <img :src="pic" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          <!-- Selected larger preview -->
          <div v-if="selectedFarmPicture !== null" class="mt-4">
            <img :src="farm.pictures[selectedFarmPicture]" class="w-full max-h-[500px] object-contain rounded border" />
          </div>
        </section>
          

        <!-- Product List -->
        <section class="col-span-1 lg:col-span-4 bg-white rounded-lg p-6 shadow">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Product List</h3>
            <button class="text-sm text-primary-600">Add Product</button>
          </div>

          <div v-if="products.length === 0" class="text-sm text-gray-600">No products yet.</div>

          <ul class="divide-y divide-gray-100">
            <li v-for="product in products" :key="product.id" class="py-4 flex items-center justify-between">
              <div>
                <div class="font-medium text-gray-800">{{ product.name }}</div>
                <div class="text-sm text-gray-600">{{ product.category }} — {{ product.unit }}</div>
              </div>
              <div class="text-sm text-gray-700">{{ formatPrice(product.price) }}</div>
            </li>
          </ul>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'farmer'
})

import { ref } from 'vue'

// Sample reactive data (replace with real API data)
const account = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1 555 1234',
  joined: '2024-02-12'
})

// local preview and file holder
account.value.picturePreview = ''
account.value.pictureFile = null

const editingAccount = ref(false)
const editingFarm = ref(false)

const farm = ref({
  description: 'Small family-run farm focusing on organic vegetables and seasonal fruits. We practice crop rotation and regenerative techniques to maintain soil health.',
  address: {
    line1: '123 Greenway Farm Rd',
    city: 'Springfield',
    state: 'IL',
    postal: '62704',
    country: 'USA'
  }
  ,
  pictures: [] as string[]
})

const products = ref([
  { id: 1, name: 'Tomatoes (kg)', category: 'Vegetables', unit: 'kg', price: 2.5 },
  { id: 2, name: 'Organic Eggs (dozen)', category: 'Poultry', unit: 'dozen', price: 4.0 },
  { id: 3, name: 'Honey 250g', category: 'Pantry', unit: 'jar', price: 6.75 }
])

const editingDescription = ref(false)
let originalDescription = ''
const selectedFarmPicture = ref<number | null>(null)

function formatPrice(v: number) {
  return `$${v.toFixed(2)}`
}

function toggleEditAccount() {
  editingAccount.value = !editingAccount.value
}

function cancelEditAccount() {
  // Reset or re-fetch original data in a real app. For now, just turn off editing.
  editingAccount.value = false
}

function saveAccount() {
  // TODO: call API to save account changes
  console.log('Saving account', account.value)
  if (account.value.pictureFile) {
    console.log('Would upload file:', account.value.pictureFile.name)
  }
  editingAccount.value = false
}

function changeEmail() {
  // Replace with modal or flow to change email
  console.log('Change email requested')
}

function changePhone() {
  // Replace with modal or flow to change phone number
  console.log('Change phone requested')
}

function changePassword() {
  // Replace with modal or flow to change password
  console.log('Change password requested')
}

function toggleEditDescription() {
  if (!editingDescription.value) {
    originalDescription = farm.value.description
  }
  editingDescription.value = !editingDescription.value
}

function cancelDescription() {
  farm.value.description = originalDescription
  editingDescription.value = false
}

function saveDescription() {
  // TODO: persist description to API
  console.log('Saving description', farm.value.description)
  editingDescription.value = false
}

function onProfilePicChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  const file = input.files[0]
  account.value.pictureFile = file

  const reader = new FileReader()
  reader.onload = () => {
    account.value.picturePreview = reader.result as string
  }
  reader.readAsDataURL(file)
}

function triggerFarmFileInput() {
  farmPicInputRef.value?.click()
}

const farmPicInputRef = ref<HTMLInputElement | null>(null)

function onFarmPicChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  const file = input.files[0]
  const reader = new FileReader()
  reader.onload = () => {
    // add to farm pictures array; newest will appear on the right due to flex-row-reverse
    farm.value.pictures.push(reader.result as string)
    // set selected to the newest (last pushed)
    selectedFarmPicture.value = farm.value.pictures.length - 1
  }
  reader.readAsDataURL(file)
  // reset file input so same file can be re-selected later
  input.value = ''
}

function selectFarmPicture(idx: number) {
  selectedFarmPicture.value = idx
}

function removeFarmPicture(idx: number) {
  // remove the picture from the array
  farm.value.pictures.splice(idx, 1)

  // adjust selected index
  if (selectedFarmPicture.value === null) return
  if (selectedFarmPicture.value === idx) {
    // if removed the selected, clear selection or move to previous
    const newIndex = Math.min(idx - 1, farm.value.pictures.length - 1)
    selectedFarmPicture.value = newIndex >= 0 ? newIndex : null
  } else if (selectedFarmPicture.value! > idx) {
    // shift selected index left by one
    selectedFarmPicture.value!--
  }
}

function toggleEditFarm() {
  editingFarm.value = !editingFarm.value
}

function cancelEditFarm() {
  // In a real app, re-fetch original farm address. For now just disable editing.
  editingFarm.value = false
}

function saveFarmAddress() {
  console.log('Saving farm address', farm.value.address)
  editingFarm.value = false
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  background: #f5f7f3;
  font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
}
</style>