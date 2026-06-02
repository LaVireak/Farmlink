<template>
  <div class="dashboard-layout">
    <FarmerSideBar />

    <main class="px-8 py-8 w-full min-h-screen" style="background:#f5f7f3;">
      <FarmerHeader title="Settings" />

      <div class="mb-8">
        <p class="text-gray-500 text-sm mt-1">Manage your profile, farm details, and listings.</p>
      </div>

      <!-- Toast -->
      <transition name="toast">
        <div v-if="toast.show"
          class="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium"
          :class="toast.type === 'success' ? 'bg-[#2d5a27] text-white' : 'bg-red-600 text-white'">
          <span>{{ toast.type === 'success' ? '✓' : '✕' }}</span>
          {{ toast.message }}
        </div>
      </transition>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <!-- Account Information -->
        <section class="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-base font-semibold text-gray-800">Account Information</h3>
            <div class="flex gap-2">
              <button v-if="!editingAccount" @click="startEditAccount"
                class="text-xs px-4 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition">Edit</button>
              <template v-else>
                <button @click="cancelAccount"
                  class="text-xs px-4 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button @click="saveAccount" :disabled="saving.account"
                  class="text-xs px-4 py-1.5 rounded-lg bg-[#2d5a27] text-white hover:bg-[#244a20] transition disabled:opacity-60">
                  {{ saving.account ? 'Saving…' : 'Save' }}
                </button>
              </template>
            </div>
          </div>

          <!-- Avatar -->
          <div class="flex items-center gap-4 mb-6">
            <div class="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0">
              <img v-if="account.picturePreview" :src="resolveUrl(account.picturePreview)" class="w-full h-full object-cover" alt="avatar" />
              <span v-else class="text-2xl font-semibold text-gray-400">{{ initials }}</span>
              <button v-if="editingAccount" @click="triggerAvatarInput"
                class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-medium hover:bg-black/50 transition">
                Change
              </button>
            </div>
            <input ref="avatarInputRef" type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
            <div v-if="editingAccount" class="text-xs text-gray-500">
              Click avatar to upload a new photo.<br />JPG, PNG or WEBP. Max 5MB.
            </div>
            <div v-else class="text-sm text-gray-600">
              <p class="font-medium text-gray-800">{{ account.firstName }} {{ account.lastName }}</p>
              <p class="text-gray-400 text-xs mt-0.5">{{ account.email }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs text-gray-500 mb-1">First Name</label>
              <input v-model="account.firstName" :disabled="!editingAccount" class="field"
                :class="editingAccount ? 'field-active' : 'field-disabled'" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Last Name</label>
              <input v-model="account.lastName" :disabled="!editingAccount" class="field"
                :class="editingAccount ? 'field-active' : 'field-disabled'" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Phone Number</label>
              <input v-model="account.phone" :disabled="!editingAccount" class="field"
                :class="editingAccount ? 'field-active' : 'field-disabled'" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Email</label>
              <input v-model="account.email" disabled class="field field-disabled" />
            </div>
          </div>
        </section>

        <!-- Farm Address -->
        <section class="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-base font-semibold text-gray-800">Farm Address</h3>
            <div class="flex gap-2">
              <button v-if="!editingFarm" @click="startEditFarm"
                class="text-xs px-4 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition">Edit</button>
              <template v-else>
                <button @click="cancelFarm"
                  class="text-xs px-4 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button @click="saveFarm" :disabled="saving.farm"
                  class="text-xs px-4 py-1.5 rounded-lg bg-[#2d5a27] text-white hover:bg-[#244a20] transition disabled:opacity-60">
                  {{ saving.farm ? 'Saving…' : 'Save' }}
                </button>
              </template>
            </div>
          </div>

          <div v-if="loadingFarm" class="space-y-3">
            <div v-for="i in 4" :key="i" class="h-10 rounded-xl bg-gray-100 animate-pulse" />
          </div>
          <div v-else class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-xs text-gray-500 mb-1">Address</label>
              <input v-model="farm.address.line1" :disabled="!editingFarm" class="field"
                :class="editingFarm ? 'field-active' : 'field-disabled'" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">District / City</label>
              <input v-model="farm.address.city" :disabled="!editingFarm" class="field"
                :class="editingFarm ? 'field-active' : 'field-disabled'" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Province / State</label>
              <input v-model="farm.address.state" :disabled="!editingFarm" class="field"
                :class="editingFarm ? 'field-active' : 'field-disabled'" />
            </div>
          </div>
        </section>

        <!-- Farm Description -->
        <section class="col-span-1 lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-semibold text-gray-800">Farm Description</h3>
            <div class="flex gap-2">
              <button v-if="!editingDescription" @click="startEditDescription"
                class="text-xs px-4 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition">Edit</button>
              <template v-else>
                <button @click="cancelDescription"
                  class="text-xs px-4 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button @click="saveDescription" :disabled="saving.description"
                  class="text-xs px-4 py-1.5 rounded-lg bg-[#2d5a27] text-white hover:bg-[#244a20] transition disabled:opacity-60">
                  {{ saving.description ? 'Saving…' : 'Save' }}
                </button>
              </template>
            </div>
          </div>
          <p v-if="!editingDescription" class="text-sm text-gray-600 leading-relaxed min-h-[48px]">
            {{ farm.description || 'No description yet.' }}
          </p>
          <textarea v-else v-model="farm.description" rows="4"
            class="w-full rounded-xl border border-gray-300 focus:border-[#2d5a27] focus:ring-1 focus:ring-[#2d5a27] p-3 text-sm text-gray-700 outline-none resize-none transition" />
        </section>

        <!-- Farm Photos -->
        <section class="col-span-1 lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-base font-semibold text-gray-800">Farm Photos</h3>
            <button @click="openPhotoModal"
              class="text-xs px-4 py-1.5 rounded-lg bg-[#2d5a27] text-white hover:bg-[#244a20] transition flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Manage Photos
            </button>
          </div>

          <div v-if="farm.pictures.length === 0"
            class="text-sm text-gray-400 py-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
            No photos yet. Click "Manage Photos" to add some.
          </div>
          <div v-else class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3">
            <div v-for="(pic, idx) in farm.pictures" :key="idx"
              class="relative aspect-square rounded-xl overflow-hidden cursor-pointer group border border-gray-100"
              @click="lightboxIndex = idx">
              <img :src="resolveUrl(pic.url)" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            </div>
          </div>

          <!-- Lightbox -->
          <div v-if="lightboxIndex !== null"
            class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            @click.self="lightboxIndex = null">
            <button @click="lightboxIndex = null"
              class="absolute top-4 right-4 text-white text-2xl w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full">×</button>
            <button v-if="lightboxIndex > 0" @click="lightboxIndex--"
              class="absolute left-4 text-white text-3xl w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full">‹</button>
            <img :src="resolveUrl(farm.pictures[lightboxIndex]?.url)" class="max-w-full max-h-[85vh] rounded-xl object-contain" />
            <button v-if="lightboxIndex < farm.pictures.length - 1" @click="lightboxIndex++"
              class="absolute right-4 text-white text-3xl w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full">›</button>
          </div>
        </section>

        <!-- Product List -->
        <section class="col-span-1 lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-base font-semibold text-gray-800">Product List</h3>
            <NuxtLink to="/farmer/products"
              class="text-xs px-4 py-1.5 rounded-lg bg-[#2d5a27] text-white hover:bg-[#244a20] transition flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </NuxtLink>
          </div>

          <div v-if="loadingProducts" class="space-y-3">
            <div v-for="i in 3" :key="i" class="h-14 rounded-xl bg-gray-100 animate-pulse" />
          </div>

          <div v-else-if="products.length === 0"
            class="text-sm text-gray-400 py-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
            No products yet.
            <NuxtLink to="/farmer/products" class="block mt-1 text-[#2d5a27] font-medium hover:underline">
              Go add your first product →
            </NuxtLink>
          </div>

          <ul v-else class="divide-y divide-gray-50">
            <li v-for="product in products" :key="product.id"
              class="py-3.5 flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                  <img v-if="product.thumbnailUrl" :src="resolveUrl(product.thumbnailUrl)" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-800">{{ product.nameEn }}</p>
                  <p class="text-xs text-gray-400">
                    {{ product.category?.nameEn ?? '—' }} · per {{ product.unit }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="text-sm font-semibold text-gray-800">
                  ${{ Number(product.pricePerUnit).toFixed(2) }}
                </span>
                <span class="text-xs px-2.5 py-0.5 rounded-full font-medium"
                  :class="product.stockQuantity > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'">
                  {{ product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock' }}
                </span>
                <span class="text-xs px-2.5 py-0.5 rounded-full font-medium bg-gray-100 text-gray-500 capitalize">
                  {{ product.status?.toLowerCase().replace('_', ' ') }}
                </span>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <!-- Photo Manager Modal -->
      <transition name="modal">
        <div v-if="photoModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          @click.self="closePhotoModal">
          <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h4 class="font-semibold text-gray-800">Manage Farm Photos</h4>
              <button @click="closePhotoModal"
                class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition">×</button>
            </div>

            <div class="p-6">
              <div @click="triggerFarmPhotoInput" @dragover.prevent @drop.prevent="onPhotoDropped"
                class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#2d5a27] hover:bg-green-50/30 transition group mb-4">
                <svg class="w-8 h-8 mx-auto text-gray-300 group-hover:text-[#2d5a27] transition mb-2" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p class="text-sm text-gray-500">Click or drag &amp; drop photos here</p>
                <p class="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP · Max 5MB each</p>
              </div>
              <input ref="farmPhotoInputRef" type="file" accept="image/*" multiple class="hidden"
                @change="onPhotosSelected" />

              <div v-if="farm.pictures.length > 0" class="grid grid-cols-4 gap-2">
                <div v-for="(pic, idx) in farm.pictures" :key="idx"
                  class="relative aspect-square rounded-lg overflow-hidden group border border-gray-100">
                  <img :src="resolveUrl(pic.url)" class="w-full h-full object-cover" />
                  <button @click="removePhoto(idx)"
                    class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xl">×</button>
                </div>
              </div>
              <p v-else class="text-sm text-gray-400 text-center py-2">No photos yet.</p>
            </div>

            <div class="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button @click="closePhotoModal"
                class="text-sm px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button @click="savePhotos" :disabled="saving.photos"
                class="text-sm px-4 py-2 rounded-lg bg-[#2d5a27] text-white hover:bg-[#244a20] transition disabled:opacity-60">
                {{ saving.photos ? 'Saving…' : 'Save Photos' }}
              </button>
            </div>
          </div>
        </div>
      </transition>

    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'farmer' })

import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth.store'

const authStore = useAuthStore()
const API = import.meta.env.VITE_API_BASE_URL
// Backend serves uploaded files as static assets from /uploads/
const STATIC_BASE = (import.meta.env.VITE_API_BASE_URL as string).replace('/api', '')

// Resolve relative upload paths (e.g. "uploads/avatars/xxx.jpg") to full URLs
function resolveUrl(url: string | undefined): string {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('data:')) return url
  return `${STATIC_BASE}/${url}`
}

// ── Toast ──────────────────────────────────────────────────────────────────
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' })
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(message: string, type: 'success' | 'error' = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}

// ── Template refs ──────────────────────────────────────────────────────────
const avatarInputRef    = ref<HTMLInputElement | null>(null)
const farmPhotoInputRef = ref<HTMLInputElement | null>(null)

// ── UI state ───────────────────────────────────────────────────────────────
const editingAccount     = ref(false)
const editingFarm        = ref(false)
const editingDescription = ref(false)
const photoModal         = ref(false)
const lightboxIndex      = ref<number | null>(null)
const loadingFarm        = ref(true)
const loadingProducts    = ref(true)
const saving = ref({ account: false, farm: false, description: false, photos: false })

// ── Account ────────────────────────────────────────────────────────────────
const account = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  picturePreview: '',   // shown in UI (may be data: URL or resolved path)
  pictureDataUrl: '',   // base64 to send to backend
})
let accountSnapshot = { ...account.value }

const initials = computed(() => {
  const f = account.value.firstName?.[0] ?? ''
  const l = account.value.lastName?.[0] ?? ''
  return (f + l).toUpperCase() || '?'
})

// ── Farm ───────────────────────────────────────────────────────────────────
const farm = ref({
  profileId: '',
  farmName: '',
  description: '',
  address: { line1: '', city: '', state: '' },
  // each picture: { url: string (path or data:), dataUrl?: string, isNew?: bool }
  pictures: [] as { url: string; dataUrl?: string; isNew?: boolean }[],
})
let farmSnapshot = JSON.parse(JSON.stringify(farm.value))
let descSnapshot = ''

// ── Products ───────────────────────────────────────────────────────────────
const products = ref<any[]>([])

// ── Auth helper ────────────────────────────────────────────────────────────
function authHeaders(json = false): Record<string, string> {
  const h: Record<string, string> = { Authorization: `Bearer ${authStore.accessToken}` }
  if (json) h['Content-Type'] = 'application/json'
  return h
}

// ── Mount ──────────────────────────────────────────────────────────────────
onMounted(async () => {
  const u = authStore.user
  if (u) {
    account.value.firstName      = u.firstName ?? ''
    account.value.lastName       = u.lastName  ?? ''
    account.value.email          = u.email     ?? ''
    account.value.picturePreview = u.avatarUrl ?? ''
  }
  await fetchFarmerProfile()
  await fetchProducts()
})

// ── Fetch profile ──────────────────────────────────────────────────────────
async function fetchFarmerProfile() {
  loadingFarm.value = true
  try {
    const userRes = await fetch(`${API}/users/profile`, { headers: authHeaders() })
    if (!userRes.ok) return
    const userData = await userRes.json()

    account.value.phone          = userData.phoneNumber ?? ''
    account.value.picturePreview = userData.avatarUrl   ?? account.value.picturePreview

    const fp = userData.farmerProfile
    if (!fp?.id) return
    farm.value.profileId = fp.id

    const farmRes = await fetch(`${API}/farmer/${fp.id}`, { headers: authHeaders() })
    if (!farmRes.ok) return
    const fd = await farmRes.json()

    farm.value.farmName        = fd.farmName      ?? ''
    farm.value.description     = fd.description   ?? ''
    farm.value.address.line1   = fd.addressDetail ?? ''
    farm.value.address.city    = fd.district      ?? ''
    farm.value.address.state   = fd.province      ?? ''

    if (fd.coverImageUrl) {
      farm.value.pictures = [{ url: fd.coverImageUrl }]
    }
  } catch (e) {
    console.error('fetchFarmerProfile error', e)
  } finally {
    loadingFarm.value = false
  }
}

// ── Fetch products ─────────────────────────────────────────────────────────
async function fetchProducts() {
  loadingProducts.value = true
  try {
    const farmerId = farm.value.profileId || authStore.user?.id || ''
    if (!farmerId) return
    const res = await fetch(`${API}/products?farmerId=${farmerId}`, { headers: authHeaders() })
    if (!res.ok) return
    const data = await res.json()
    products.value = Array.isArray(data) ? data : (data.items ?? [])
  } catch (e) {
    console.error('fetchProducts error', e)
  } finally {
    loadingProducts.value = false
  }
}

// ── Account edit ───────────────────────────────────────────────────────────
// PATCH /users/profile  →  { firstName, lastName, phoneNumber, avatarDataUrl? }
function startEditAccount() {
  accountSnapshot = JSON.parse(JSON.stringify(account.value))
  editingAccount.value = true
}
function cancelAccount() {
  Object.assign(account.value, accountSnapshot)
  editingAccount.value = false
}
async function saveAccount() {
  saving.value.account = true
  try {
    const body: Record<string, string> = {
      firstName:   account.value.firstName,
      lastName:    account.value.lastName,
      phoneNumber: account.value.phone,
    }
    // Include base64 avatar if a new one was selected
    if (account.value.pictureDataUrl) {
      body.avatarDataUrl = account.value.pictureDataUrl
    }

    const res = await fetch(`${API}/users/profile`, {
      method: 'PATCH',
      headers: authHeaders(true),
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error('Failed')
    const data = await res.json()

    // Update auth store so the header avatar updates too
    authStore.updateUserProfile({
      firstName: data.firstName ?? account.value.firstName,
      lastName:  data.lastName  ?? account.value.lastName,
      avatarUrl: data.avatarUrl ?? account.value.picturePreview,
    })

    // Refresh preview from what the server saved
    if (data.avatarUrl) account.value.picturePreview = data.avatarUrl
    account.value.pictureDataUrl = ''

    editingAccount.value = false
    showToast('Account updated')
  } catch {
    showToast('Failed to update account', 'error')
  } finally {
    saving.value.account = false
  }
}

function triggerAvatarInput() { avatarInputRef.value?.click() }
function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = reader.result as string
    account.value.picturePreview = dataUrl  // show immediately
    account.value.pictureDataUrl = dataUrl  // will be sent on save
  }
  reader.readAsDataURL(file)
}

// ── Farm address edit ──────────────────────────────────────────────────────
// PATCH /farmer/profile  →  { addressDetail, district, province }
function startEditFarm() {
  farmSnapshot = JSON.parse(JSON.stringify(farm.value))
  editingFarm.value = true
}
function cancelFarm() {
  farm.value.address = { ...farmSnapshot.address }
  editingFarm.value = false
}
async function saveFarm() {
  saving.value.farm = true
  try {
    const res = await fetch(`${API}/farmer/profile`, {
      method: 'PATCH',
      headers: authHeaders(true),
      body: JSON.stringify({
        addressDetail: farm.value.address.line1,
        district:      farm.value.address.city,
        province:      farm.value.address.state,
      }),
    })
    if (!res.ok) throw new Error('Failed')
    editingFarm.value = false
    showToast('Farm address updated')
  } catch {
    showToast('Failed to save address', 'error')
  } finally {
    saving.value.farm = false
  }
}

// ── Description edit ───────────────────────────────────────────────────────
// PATCH /farmer/profile  →  { description }
function startEditDescription() {
  descSnapshot = farm.value.description
  editingDescription.value = true
}
function cancelDescription() {
  farm.value.description = descSnapshot
  editingDescription.value = false
}
async function saveDescription() {
  saving.value.description = true
  try {
    const res = await fetch(`${API}/farmer/profile`, {
      method: 'PATCH',
      headers: authHeaders(true),
      body: JSON.stringify({ description: farm.value.description }),
    })
    if (!res.ok) throw new Error('Failed')
    editingDescription.value = false
    showToast('Description updated')
  } catch {
    showToast('Failed to save description', 'error')
  } finally {
    saving.value.description = false
  }
}

// ── Photo modal ────────────────────────────────────────────────────────────
// Saves the first photo as coverImageUrl via PATCH /farmer/profile { coverImageDataUrl }
function openPhotoModal()  { photoModal.value = true }
function closePhotoModal() { photoModal.value = false }
function triggerFarmPhotoInput() { farmPhotoInputRef.value?.click() }

function onPhotosSelected(e: Event) {
  addFiles(Array.from((e.target as HTMLInputElement).files ?? []))
  ;(e.target as HTMLInputElement).value = ''
}
function onPhotoDropped(e: DragEvent) {
  addFiles(Array.from(e.dataTransfer?.files ?? []))
}
function addFiles(files: File[]) {
  files.filter(f => f.type.startsWith('image/')).forEach(file => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      farm.value.pictures.push({ url: dataUrl, dataUrl, isNew: true })
    }
    reader.readAsDataURL(file)
  })
}
function removePhoto(idx: number) {
  farm.value.pictures.splice(idx, 1)
  if (lightboxIndex.value !== null) {
    if (lightboxIndex.value === idx) lightboxIndex.value = null
    else if (lightboxIndex.value > idx) lightboxIndex.value--
  }
}

// Save photos: send the first new photo as coverImageUrl (the entity only has one cover field).
// If your backend later supports multiple photo URLs, extend this to loop through all new ones.
async function savePhotos() {
  saving.value.photos = true
  try {
    const newPic = farm.value.pictures.find(p => p.isNew && p.dataUrl)
    if (newPic?.dataUrl) {
      const res = await fetch(`${API}/farmer/profile`, {
        method: 'PATCH',
        headers: authHeaders(true),
        body: JSON.stringify({ coverImageDataUrl: newPic.dataUrl }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      // Replace local state with saved URL so it persists on reload
      farm.value.pictures = farm.value.pictures.map(p =>
        p.isNew ? { url: data.coverImageUrl, isNew: false } : p
      )
    }
    photoModal.value = false
    showToast('Photos saved')
  } catch {
    showToast('Failed to save photos', 'error')
  } finally {
    saving.value.photos = false
  }
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
}
.field {
  width: 100%;
  border-radius: 0.75rem;
  border-width: 1px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #1f2937;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field-active { border-color: #d1d5db; background: #fff; }
.field-active:focus { border-color: #2d5a27; box-shadow: 0 0 0 1px #2d5a27; }
.field-disabled { border-color: transparent; background: #f9fafb; color: #6b7280; cursor: default; }

.toast-enter-active, .toast-leave-active { transition: all .25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-8px); }
.modal-enter-active, .modal-leave-active { transition: opacity .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>