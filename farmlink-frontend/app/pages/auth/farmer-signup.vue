<template>
  <div class="min-h-screen bg-[#eef3ea] px-4 py-10 flex justify-center">
    <div class="w-full max-w-6xl grid md:grid-cols-2 gap-10">
      <div class="bg-white rounded-3xl shadow-md overflow-hidden border border-emerald-100">
        <div class="relative h-[420px]">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef"
            class="absolute inset-0 h-full w-full object-cover"
          >
          <div class="absolute inset-0 overlay-card">
            <span class="pill">Live Metrics</span>
            <div>
              <div class="text-sm font-semibold tracking-wide">Precision Farming</div>
              <h2 class="text-2xl font-semibold mt-2">
                Precision Ecology for
                the modern farmer
              </h2>
              <p class="text-xs opacity-90 mt-3">
                Join the most advanced digital network connecting sustainable harvests
                to the global marketplace.
              </p>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="flex gap-4">
            <div class="stat-card">
              <strong>4.2k</strong><br>Active Farms
            </div>
            <div class="stat-card">
              <strong>128TB</strong><br>Harvest Data
            </div>
          </div>
        </div>
      </div>

      <div>
        <span class="text-xs text-emerald-700 font-semibold">PARTNER ONBOARDING</span>
        <h1 class="text-3xl font-semibold mt-2 text-slate-900">
          Create Farmer Account
        </h1>
        <p class="text-sm text-slate-500 mb-6">
          Digitize your operations and access professional-grade tools.
        </p>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label class="field-label">Full Name</label>
            <input v-model="form.name" placeholder="Samuel Green" class="input">
          </div>
          <div>
            <label class="field-label">Phone Number</label>
            <input v-model="form.phone" placeholder="(+855) 000-000-000" class="input">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="col-span-2">
            <label class="field-label">Email Address</label>
            <input v-model="form.email" type="email" placeholder="farmer@example.com" class="input">
          </div>
          <div>
            <label class="field-label">Password</label>
            <input v-model="form.password" type="password" placeholder="Enter password" class="input">
          </div>
          <div>
            <label class="field-label">Confirm Password</label>
            <input v-model="form.confirmPassword" type="password" placeholder="Confirm password" class="input">
          </div>
        </div>

        <div class="card">
          <h3 class="section-title">Verification Hub</h3>

          <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label class="field-label">Farmer ID</label>
              <label class="upload-box cursor-pointer">
                <input
                  class="hidden"
                  type="file"
                  accept="image/*"
                  @change="(event) => onFileChange(event, 'idPhoto')"
                >
                <img
                  v-if="previews.idPhoto"
                  :src="previews.idPhoto"
                  alt="ID preview"
                  class="preview-image"
                >
                <div v-else class="upload-inner">
                  <div class="upload-title">ID Photo</div>
                  <div class="upload-hint">JPG, PNG 10MB</div>
                </div>
              </label>
            </div>
            <div>
              <label class="field-label">Ownership Deed</label>
              <label class="upload-box cursor-pointer">
                <input
                  class="hidden"
                  type="file"
                  accept="image/*"
                  @change="(event) => onFileChange(event, 'farmDeed')"
                >
                <img
                  v-if="previews.farmDeed"
                  :src="previews.farmDeed"
                  alt="Farm deed preview"
                  class="preview-image"
                >
                <div v-else class="upload-inner">
                  <div class="upload-title">Farm Deed</div>
                  <div class="upload-hint">JPG, PNG 10MB</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title">Farm Logistics</h3>
          <label class="field-label mt-3">Physical Address</label>
          <input v-model="form.address" placeholder="Operation HQ, GPS Coordinates or Street Address" class="input">
        </div>

        <div class="card flex items-center justify-between">
          <div>
            <p class="font-medium text-sm">Profile Visual</p>
            <p class="text-xs text-slate-500">Upload aerial or field photo for verification</p>
          </div>
          <label class="profile-upload cursor-pointer">
            <input
              class="hidden"
              type="file"
              accept="image/*"
              @change="(event) => onFileChange(event, 'profilePhoto')"
            >
            <img
              v-if="previews.profilePhoto"
              :src="previews.profilePhoto"
              alt="Profile preview"
              class="profile-preview"
            >
            <span v-else>Select</span>
          </label>
        </div>

        <div class="card">
          <h3 class="section-title">Product Catalog</h3>
          <div class="field-label mt-3">Inventory Tags</div>

          <div class="flex flex-wrap gap-2 mt-3">
            <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <div class="flex gap-2 mt-3">
            <input v-model="newTag" placeholder="Add product (e.g. Organic Carrots)" class="input flex-1">
            <button @click="addTag" class="btn-secondary" type="button">Deploy Tag</button>
          </div>
        </div>

        <label class="flex gap-2 text-xs mt-4 text-slate-600">
          <input type="checkbox" v-model="form.agree">
          I confirm the accuracy of all submitted agricultural data and agree to the
          <span class="link-inline">Operational Protocols</span> and
          <span class="link-inline">Privacy Framework</span>.
        </label>

        <p v-if="errorMessage" class="text-red-600 text-sm mt-2">
          {{ errorMessage }}
        </p>

        <button
          @click="onSubmit"
          class="btn-primary mt-4"
        >
          Initialize Partner Account
        </button>

        <p class="text-center text-sm text-slate-600 mt-6">
          Existing Partner?
          <NuxtLink to="/auth/signin" class="text-emerald-700 font-semibold">
            Sign in
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const { requestSignupOtp } = useAuth();
const PROFILE_STORAGE_KEY = 'farmlink.farmer.profilePreview';
const ONBOARDING_STORAGE_KEY = 'farmlink.farmer.onboarding';

const form = reactive({
  name: '',
  phone: '',
  address: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false,
});

const files = reactive<{ idPhoto: File | null; farmDeed: File | null; profilePhoto: File | null }>({
  idPhoto: null,
  farmDeed: null,
  profilePhoto: null,
});

const previews = reactive<{ idPhoto: string; farmDeed: string; profilePhoto: string }>({
  idPhoto: '',
  farmDeed: '',
  profilePhoto: '',
});

const newTag = ref('');
const tags = ref(['Rice', 'Poultry']);
const errorMessage = ref('');

const addTag = () => {
  const value = newTag.value.trim();
  if (!value) {
    return;
  }

  if (!tags.value.includes(value)) {
    tags.value.push(value);
  }
  newTag.value = '';
};

const onSubmit = async () => {
  errorMessage.value = '';

  if (!form.name || !form.phone || !form.email || !form.password || !form.confirmPassword) {
    errorMessage.value = 'Please complete all required fields.';
    return;
  }

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }

  if (!form.agree) {
    errorMessage.value = 'Please confirm your data.';
    return;
  }

  const nameParts = form.name.trim().split(/\s+/);
  const firstName = nameParts.shift() || form.name.trim();
  const lastName = nameParts.join(' ') || 'Farmer';

  await persistOnboarding();

  await requestSignupOtp({
    firstName,
    lastName,
    email: form.email,
    password: form.password,
    role: 'farmer',
  });

  await router.push(`/auth/verify-code?email=${encodeURIComponent(form.email)}`);
};

const onFileChange = async (event: Event, key: 'idPhoto' | 'farmDeed' | 'profilePhoto') => {
  const input = event.target as HTMLInputElement | null;
  const file = input?.files?.[0] ?? null;
  if (!file) {
    files[key] = null;
    revokePreview(key);
    return;
  }

  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Only image files are allowed in Verification Hub.';
    input.value = '';
    files[key] = null;
    revokePreview(key);
    return;
  }

  files[key] = file;
  errorMessage.value = '';
  if (key === 'profilePhoto') {
    const dataUrl = await readFileAsDataUrl(file);
    previews.profilePhoto = dataUrl;
    localStorage.setItem(PROFILE_STORAGE_KEY, dataUrl);
    return;
  }

  setPreview(key, file);
};

const serializeFile = async (file: File | null) => {
  if (!file) {
    return null;
  }

  return {
    name: file.name,
    type: file.type,
    dataUrl: await readFileAsDataUrl(file),
  };
};

const persistOnboarding = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  const payload = {
    email: form.email,
    phone: form.phone,
    address: form.address,
    farmName: form.name,
    tags: tags.value,
    idPhoto: await serializeFile(files.idPhoto),
    farmDeed: await serializeFile(files.farmDeed),
    profilePhoto: await serializeFile(files.profilePhoto),
  };

  sessionStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(payload));
};

const setPreview = (key: 'idPhoto' | 'farmDeed' | 'profilePhoto', file: File) => {
  revokePreview(key);
  previews[key] = URL.createObjectURL(file);
};

const revokePreview = (key: 'idPhoto' | 'farmDeed' | 'profilePhoto') => {
  if (previews[key]) {
    if (previews[key].startsWith('blob:')) {
      URL.revokeObjectURL(previews[key]);
    }
    previews[key] = '';
  }
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });

onMounted(() => {
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (stored) {
    previews.profilePhoto = stored;
  }
});

onBeforeUnmount(() => {
  revokePreview('idPhoto');
  revokePreview('farmDeed');
  revokePreview('profilePhoto');
});
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.65rem;
  border: 1px solid #d5dfd3;
  font-size: 0.875rem;
  outline: none;
  background: #f7f9f4;
}

.card {
  background: #ffffff;
  padding: 1rem 1.2rem;
  border-radius: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  margin-top: 1rem;
}

.section-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

.field-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7b8a76;
  margin-bottom: 0.35rem;
}

.upload-box {
  border: 2px dashed #cbd5e1;
  border-radius: 0.75rem;
  height: 6.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: #94a3b8;
  overflow: hidden;
  position: relative;
  background: #f8faf7;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-inner {
  text-align: center;
  font-size: 0.75rem;
  color: #8a9b86;
  line-height: 1.2;
}

.upload-title {
  font-weight: 700;
  color: #3d5340;
  margin-bottom: 0.2rem;
}

.upload-hint {
  font-size: 0.68rem;
  color: #94a3b8;
}

.btn-secondary {
  background: #e6efe0;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
  border: 1px solid #cfe0c7;
  color: #2f4f2f;
}

.btn-secondary:hover {
  background: #d7e7cf;
}

.tag {
  background: #dff4e5;
  color: #1b6b3c;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}

.input:focus {
  box-shadow: 0 0 0 2px #9fc8a2;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
}

.overlay-card {
  padding: 1.5rem;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(140deg, rgba(8, 68, 34, 0.8), rgba(13, 92, 46, 0.45));
}

.stat-card {
  background: #f1f6ef;
  border-radius: 0.85rem;
  padding: 0.8rem 1rem;
  font-size: 0.75rem;
  color: #3c4f3b;
  min-width: 120px;
}

.btn-primary {
  width: 100%;
  background: #0f6b2f;
  color: #ffffff;
  padding: 0.8rem 1rem;
  border-radius: 0.9rem;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background: #0c5a28;
}

.link-inline {
  color: #0f6b2f;
  font-weight: 600;
}

.enterprise-block {
  margin-top: 1.5rem;
  text-align: center;
}

.enterprise-title {
  font-size: 0.65rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #9aa89a;
  margin-bottom: 0.6rem;
}

.enterprise-btn {
  width: 100%;
  border: 1px solid #dfe6da;
  border-radius: 0.75rem;
  padding: 0.6rem 1rem;
  font-size: 0.85rem;
  background: #ffffff;
  color: #2f3f2f;
}

.profile-upload {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 9999px;
  border: 1px solid #cfe0c7;
  background: #e6efe0;
  color: #2f4f2f;
  font-size: 0.8rem;
  font-weight: 600;
  overflow: hidden;
}

.profile-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 9999px;
}
</style>