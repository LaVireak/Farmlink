<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import CommonAppSidebar from '../../../components/common/AppSidebar.vue';
import { useAuthStore } from '../../../stores/auth.store';
import { getAccessToken } from '../../../services/auth.service';

definePageMeta({
  middleware: 'user',
  layout: 'user',
});

useHead({
  title: 'Edit Profile | FarmLink Cambodia',
});

type ProfileForm = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  languagePref: string;
};

const config = useRuntimeConfig();
const auth = useAuthStore();
const loading = ref(true);
const saving = ref(false);
const message = ref('');
const errorMessage = ref('');

const form = ref<ProfileForm>({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  languagePref: 'kh',
});

const profile = computed(() => auth.user);

const avatarInitials = computed(() => {
  const firstName = form.value.firstName.trim();
  const lastName = form.value.lastName.trim();
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.trim();
  if (initials) return initials.toUpperCase();
  return profile.value?.email?.slice(0, 2).toUpperCase() || 'FM';
});

const avatarUrl = computed(() => auth.pendingAvatarUrl || profile.value?.avatarUrl || auth.user?.avatarUrl || '');

const getAuthHeaders = async () => {
  const accessToken = await getAccessToken();
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

const readResponseError = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    const data = await response.json().catch(() => ({}));
    return data?.message || 'Unable to save profile';
  }

  const text = await response.text().catch(() => '');
  return text || 'Unable to save profile';
};

const unwrapApiData = <T = any>(payload: any): T => (payload?.data ?? payload) as T;

const loadProfile = async () => {
  await auth.hydrate();

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${config.public.apiUrl}/users/profile`, { headers });
    if (!response.ok) {
      throw new Error('Unable to load profile');
    }

    const data = unwrapApiData(await response.json());
    form.value = {
      firstName: data?.firstName ?? profile.value?.firstName ?? '',
      lastName: data?.lastName ?? profile.value?.lastName ?? '',
      phoneNumber: data?.phoneNumber ?? '',
      languagePref: data?.languagePref ?? 'kh',
    };
  } catch {
    form.value = {
      firstName: profile.value?.firstName ?? '',
      lastName: profile.value?.lastName ?? '',
      phoneNumber: '',
      languagePref: 'kh',
    };
    message.value = '';
  } finally {
    loading.value = false;
  }
};

const saveProfile = async () => {
  saving.value = true;
  message.value = '';
  errorMessage.value = '';

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${config.public.apiUrl}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        firstName: form.value.firstName.trim(),
        lastName: form.value.lastName.trim(),
        phoneNumber: form.value.phoneNumber.trim(),
        languagePref: form.value.languagePref.trim(),
        avatarDataUrl: auth.pendingAvatarUrl ?? undefined,
      }),
    });

    if (!response.ok) {
      throw new Error(await readResponseError(response));
    }

    const data = unwrapApiData(await response.json());
    message.value = 'Profile saved successfully.';
    auth.updateUserProfile({
      firstName: data.firstName ?? form.value.firstName,
      lastName: data.lastName ?? form.value.lastName,
      createdAt: data.createdAt ?? auth.user?.createdAt,
      updatedAt: data.updatedAt ?? auth.user?.updatedAt,
      email: data.email ?? auth.user?.email ?? '',
      id: data.id ?? auth.user?.id ?? '',
      role: data.role ?? auth.user?.role ?? 'consumer',
      status: data.status ?? auth.user?.status,
      avatarUrl: data.avatarUrl ?? auth.pendingAvatarUrl ?? auth.user?.avatarUrl,
    });
    auth.clearPendingAvatarUrl();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to save profile';
  } finally {
    saving.value = false;
  }
};

const resetForm = () => {
  if (!profile.value) return;
  form.value = {
    firstName: profile.value.firstName ?? '',
    lastName: profile.value.lastName ?? '',
    phoneNumber: '',
    languagePref: 'kh',
  };
  auth.clearPendingAvatarUrl();
  message.value = '';
  errorMessage.value = '';
};

onMounted(() => {
  void loadProfile();
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#fbf9f6] text-zinc-900">
    <CommonAppHeader />

    <main class="max-w-[1550px] mx-auto w-full pt-16 sm:pt-16 pb-16 px-4 sm:px-16 lg:px-8 flex-1">
      <div class="flex flex-col md:flex-row gap-8 md:gap-10">
        <CommonAppSidebar active="edit" />

        <section class="flex-1 space-y-8 min-w-0">
          <div class="bg-[#f2efe8] rounded-3xl p-8 md:p-10 relative overflow-hidden min-h-[220px] flex flex-col justify-center">
            <div class="relative z-10">
              <p class="text-[10px] font-bold text-[#1a5423] uppercase tracking-[0.2em] mb-2">Account Settings</p>
              <h1 class="font-[Manrope,sans-serif] text-4xl md:text-5xl font-black text-[#1a5423] mb-4">Edit Profile</h1>
              <p class="text-sm text-black/60 max-w-lg leading-relaxed">
                Update your personal details and secure your account credentials to keep your FarmLink experience seamless.
              </p>
            </div>
            <div class="absolute -right-16 top-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-black/10" />
          </div>

          <div class="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-black/5">
            <div class="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 mb-10">
              <div class="relative">
                <div v-if="avatarUrl" class="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-[#f2efe8]">
                  <img :src="avatarUrl" alt="User Avatar" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-[#154212] via-[#1f7a2e] to-[#006e1c] flex items-center justify-center text-white">
                  <span class="text-2xl font-black font-[Manrope,sans-serif]">{{ avatarInitials }}</span>
                </div>
              </div>
              <div>
                <h3 class="font-[Manrope,sans-serif] font-bold text-lg mb-1">Profile Picture</h3>
                <p class="text-xs text-black/40 mb-4">JPG, GIF or PNG. Max size of 2MB</p>
                <div class="flex gap-4">
                  <NuxtLink to="/user/settings/photo" class="bg-[#f2efe8] text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Change Photo
                  </NuxtLink>
                  <NuxtLink to="/user/settings/remove-photo" class="text-[#ba1a1a] text-[10px] font-bold uppercase tracking-wider">
                    Remove
                  </NuxtLink>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <h3 class="font-[Manrope,sans-serif] text-xl font-bold mb-6">Personal Information</h3>

              <form class="space-y-8" @submit.prevent="saveProfile">
                <div v-if="message" class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  {{ message }}
                </div>

                <div v-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {{ errorMessage }}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">First Name</label>
                    <input v-model="form.firstName" class="w-full h-12 bg-[#f2efe8] border-none rounded-2xl py-3 px-6 text-sm font-medium focus:ring-2 focus:ring-[#1a5423]/20 transition-all placeholder-black/30" placeholder="Enter first name" type="text" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Last Name</label>
                    <input v-model="form.lastName" class="w-full h-12 bg-[#f2efe8] border-none rounded-2xl py-3 px-6 text-sm font-medium focus:ring-2 focus:ring-[#1a5423]/20 transition-all placeholder-black/30" placeholder="Enter last name" type="text" />
                  </div>

                  <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Phone Number</label>
                    <input v-model="form.phoneNumber" class="w-full h-12 bg-[#f2efe8] border-none rounded-2xl py-3 px-6 text-sm font-medium focus:ring-2 focus:ring-[#1a5423]/20 transition-all placeholder-black/30" placeholder="Enter phone number" type="tel" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Language</label>
                    <select v-model="form.languagePref" class="w-full h-12 bg-[#f2efe8] border-none rounded-2xl py-3 px-6 text-sm font-medium focus:ring-2 focus:ring-[#1a5423]/20 transition-all">
                      <option value="kh">Khmer</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div class="space-y-2 md:col-span-2">
                    <label class="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Email Address</label>
                    <input :value="profile?.email || auth.user?.email || ''" class="w-full h-12 bg-[#e9e7e1] border-none rounded-2xl py-3 px-6 text-sm font-medium text-black/50" disabled type="email" />
                  </div>
                </div>

                <div class="pt-4 border-t border-black/5 flex flex-col sm:flex-row gap-4 items-center justify-end">
                  <button class="px-8 py-3.5 bg-white border border-black/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#f2efe8] transition-all" type="button" @click="resetForm">
                    Cancel
                  </button>
                  <button :disabled="loading || saving" class="flex items-center gap-3 px-8 py-3.5 bg-[#563000] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#402400] shadow-lg transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed" type="submit">
                    <span class="material-symbols-outlined text-[18px]">save</span>
                    {{ saving ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 rounded-[2rem] overflow-hidden relative h-56 group">
              <img
                alt="Farms"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYwJIlblEgU2cmWyGK1ENbv3RIPEGntkz2bZWDu4uI9jpZ082Q15ICwtzbhEnY3emt8m6bCZyvkzenEYm67xLj4nBCwrcvf7iSxJ461p6XNKO6K3Ehs_o5ShlIJLBlwwDn08yGq9qosubZ6nDl6KQz_d2Ze0JHHn7hHC3i56_S9_CU0scYYTOrXOciSgG5GsOOBIyIEh8eXr8VXyvlDmZYxE8x8J-NtMu8hrptW_m7EPI_Q-oWeshtvseqRKGD7R4H9TGvOTYkwnY"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <p class="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">Our Impact</p>
                <h4 class="text-white text-2xl font-black font-[Manrope,sans-serif]">Supported 14 Small-Scale Farms in 2023</h4>
              </div>
            </div>

            <div class="bg-[#1a5423] rounded-[2rem] p-8 flex flex-col items-center justify-center text-center text-white relative overflow-hidden h-56">
              <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <span class="material-symbols-outlined">eco</span>
              </div>
              <h2 class="text-4xl font-black font-[Manrope,sans-serif] mb-1">8.4kg</h2>
              <p class="text-[10px] font-bold uppercase tracking-widest opacity-60">Organic Waste Diverted</p>
            </div>
          </div>
        </section>
      </div>
    </main>

    <CommonAppFooter />
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24;
}
</style>
