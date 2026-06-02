<template>
    <div class="min-h-screen flex bg-[#f7fdf4] font-sans text-gray-800">
      <main class="flex-1 p-10">
        <AdminProfileDropdown />
        <div class="grid grid-cols-12 gap-10">
          <div class="col-span-9 bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-50">
            <section class="flex-1">
              <h2 class="text-2xl font-black text-[#15803d] mb-10">Personal Information</h2>

              <div class="flex flex-col items-center space-y-3 mb-8">
                <div class="rounded-full w-24 h-24 shadow-md overflow-hidden bg-green-100 flex items-center justify-center text-green-900 font-semibold">
                  <img
                    v-if="avatarDisplayUrl"
                    :src="avatarDisplayUrl"
                    alt="Profile Photo"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-2xl">{{ initials }}</span>
                </div>
                <input ref="avatarInputRef" type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    class="bg-green-700 text-white rounded px-5 py-2 hover:bg-green-800 transition disabled:opacity-60"
                    :disabled="loading || saving"
                    @click="triggerAvatarInput"
                  >
                    Change Photo
                  </button>
                  <button
                    type="button"
                    class="text-sm text-gray-500 hover:underline disabled:opacity-60"
                    :disabled="loading || saving || !avatarDisplayUrl"
                    @click="removeAvatarImage"
                  >
                    Remove
                  </button>
                </div>
                <p class="text-xs text-gray-400">JPG, PNG, or WEBP. Max 2MB.</p>
              </div>

              <form @submit.prevent="saveChanges" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="md:col-span-2">
                  <div v-if="message" class="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                    {{ message }}
                  </div>
                  <div v-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {{ errorMessage }}
                  </div>
                </div>

                <div>
                  <label for="firstName" class="block text-sm mb-1 font-medium text-gray-700">First Name</label>
                  <input id="firstName" v-model="form.firstName" type="text" class="input-field" :disabled="loading || saving" />
                </div>

                <div>
                  <label for="lastName" class="block text-sm mb-1 font-medium text-gray-700">Last Name</label>
                  <input id="lastName" v-model="form.lastName" type="text" class="input-field" :disabled="loading || saving" />
                </div>

                <div>
                  <label for="email" class="block text-sm mb-1 font-medium text-gray-700">Email</label>
                  <input id="email" v-model="form.email" type="email" class="input-field" :disabled="loading || saving" />
                  <p class="text-xs text-gray-400 mt-1">Changing email will send a confirmation link.</p>
                </div>

                <div>
                  <label for="phone" class="block text-sm mb-1 font-medium text-gray-700">Phone Number</label>
                  <input id="phone" v-model="form.phone" type="tel" class="input-field" :disabled="loading || saving" />
                </div>

                <div class="md:col-span-2 text-right">
                  <button
                    type="submit"
                    class="bg-green-700 px-6 py-2 rounded text-white font-semibold hover:bg-green-800 transition disabled:opacity-60"
                    :disabled="loading || saving"
                  >
                    {{ saving ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  </template>

  <script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { getAccessToken, supabase } from '../../../services/auth.service'
  import { useAuthStore } from '../../../stores/auth.store'

definePageMeta({
  middleware: 'admin',
  layout: 'admin'
})

const auth = useAuthStore()
const config = useRuntimeConfig()
const apiBase = config.public.apiUrl
const staticBase = apiBase.replace(/\/api\/?$/, '')

const loading = ref(true)
const saving = ref(false)
const message = ref('')
const errorMessage = ref('')

const avatarInputRef = ref<HTMLInputElement | null>(null)
const avatarPreview = ref('')
const avatarDataUrl = ref('')
const removeAvatar = ref(false)

const currentEmail = ref('')

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  avatarUrl: '',
})

const initials = computed(() => {
  const first = form.value.firstName.trim()
  const last = form.value.lastName.trim()
  const combined = `${first[0] ?? ''}${last[0] ?? ''}`.trim()
  if (combined) return combined.toUpperCase()
  return (form.value.email || auth.user?.email || 'FM').slice(0, 2).toUpperCase()
})

const avatarDisplayUrl = computed(() => {
  const raw = avatarPreview.value || form.value.avatarUrl || ''
  if (!raw) return ''
  if (raw.startsWith('http') || raw.startsWith('data:')) return raw
  return `${staticBase}/${raw.replace(/^\/+/, '')}`
})

const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024

const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result || ''))
  reader.onerror = () => reject(new Error('Unable to read the image file.'))
  reader.readAsDataURL(file)
})

const triggerAvatarInput = () => {
  avatarInputRef.value?.click()
}

const onAvatarChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Please select a valid image file.'
    return
  }

  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    errorMessage.value = 'Image size must be 2MB or less.'
    return
  }

  try {
    const dataUrl = await readFileAsDataUrl(file)
    avatarPreview.value = dataUrl
    avatarDataUrl.value = dataUrl
    removeAvatar.value = false
    message.value = ''
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to read image.'
  }
}

const removeAvatarImage = () => {
  avatarPreview.value = ''
  avatarDataUrl.value = ''
  form.value.avatarUrl = ''
  removeAvatar.value = true
}

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const accessToken = await getAccessToken()
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
}

const readResponseError = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const data = await response.json().catch(() => ({}))
    return data?.message || 'Unable to save profile'
  }
  const text = await response.text().catch(() => '')
  return text || 'Unable to save profile'
}

const loadProfile = async () => {
  loading.value = true
  message.value = ''
  errorMessage.value = ''

  await auth.hydrate()

  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBase}/users/profile`, { headers })
    if (!response.ok) throw new Error('Unable to load profile.')

    const data = await response.json().catch(() => null)

    form.value = {
      firstName: data?.firstName ?? auth.user?.firstName ?? '',
      lastName: data?.lastName ?? auth.user?.lastName ?? auth.user?.lastname ?? '',
      email: data?.email ?? auth.user?.email ?? '',
      phone: data?.phoneNumber ?? '',
      avatarUrl: data?.avatarUrl ?? auth.user?.avatarUrl ?? '',
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to load profile.'
    form.value = {
      firstName: auth.user?.firstName ?? '',
      lastName: auth.user?.lastName ?? auth.user?.lastname ?? '',
      email: auth.user?.email ?? '',
      phone: '',
      avatarUrl: auth.user?.avatarUrl ?? '',
    }
  }

  currentEmail.value = form.value.email
  avatarPreview.value = ''
  avatarDataUrl.value = ''
  removeAvatar.value = false
  loading.value = false
}

const saveChanges = async () => {
  if (loading.value || saving.value) return

  saving.value = true
  message.value = ''
  errorMessage.value = ''

  try {
    const trimmedEmail = form.value.email.trim()
    const emailChanged = Boolean(trimmedEmail && trimmedEmail !== currentEmail.value)

    if (emailChanged) {
      const { error } = await supabase.auth.updateUser({ email: trimmedEmail })
      if (error) throw error
    }

    const profilePayload: {
      firstName?: string
      lastName?: string
      phoneNumber?: string
      avatarDataUrl?: string
      removeAvatar?: boolean
    } = {
      firstName: form.value.firstName.trim() || undefined,
      lastName: form.value.lastName.trim() || undefined,
      phoneNumber: form.value.phone.trim() || undefined,
    }

    if (avatarDataUrl.value) profilePayload.avatarDataUrl = avatarDataUrl.value
    if (removeAvatar.value) profilePayload.removeAvatar = true

    const headers = await getAuthHeaders()
    const response = await fetch(`${apiBase}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(profilePayload),
    })

    if (!response.ok) {
      throw new Error(await readResponseError(response))
    }

    const data = await response.json().catch(() => null)
    form.value.avatarUrl = data?.avatarUrl ?? (removeAvatar.value ? '' : form.value.avatarUrl)

    currentEmail.value = trimmedEmail || currentEmail.value

    auth.updateUserProfile({
      firstName: form.value.firstName.trim() || undefined,
      lastName: form.value.lastName.trim() || undefined,
      email: currentEmail.value || auth.user?.email || '',
      avatarUrl: form.value.avatarUrl || undefined,
    })

    avatarPreview.value = ''
    avatarDataUrl.value = ''
    removeAvatar.value = false

    message.value = emailChanged
      ? 'Profile saved. Please check your inbox to confirm the new email address.'
      : 'Profile saved successfully.'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to save profile.'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  void loadProfile()
})
  </script>
  
  <style scoped>
  .input-field {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db; /* gray-300 */
    border-radius: 0.375rem; /* rounded-md */
    font-size: 0.875rem; /* text-sm */
    line-height: 1.25rem;
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }
  
  .input-field:focus {
    border-color: #16a34a; /* green-600 */
    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.3);
    outline: none;
  }
  </style>