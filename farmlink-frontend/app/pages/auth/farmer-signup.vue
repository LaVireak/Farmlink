<template>
  <div class="auth-page">
    <div class="auth-shell">
      
      <!-- LEFT HERO -->
      <div class="hero-panel">
        <div class="hero-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80"
            alt="Modern farming"
            class="hero-image"
          >

          <div class="hero-overlay">
            <span class="eyebrow">Farmer Network</span>

            <h2>
              Grow your farm with
              the future of
              digital agriculture
            </h2>

            <p>
              Join FarmLink to manage harvests, connect with buyers,
              and unlock modern tools built for sustainable farming.
            </p>
          </div>
        </div>

        <div class="feature-grid">
          <div class="feature-card">
            <span class="feature-label">Smart Operations</span>

            <strong>Track every harvest</strong>

            <p>
              Monitor crops, inventory, and farm performance
              in one secure platform.
            </p>
          </div>

          <div class="feature-card">
            <span class="feature-label">Marketplace Access</span>

            <strong>Reach more buyers</strong>

            <p>
              Expand your agricultural business with direct
              access to trusted markets.
            </p>
          </div>
        </div>
      </div>

      <!-- RIGHT FORM -->
      <div class="form-panel">
        <div class="form-badge">Partner onboarding</div>

        <h1>Create Farmer Account</h1>

        <p class="form-intro">
          Digitize your operations and access professional-grade agricultural tools.
        </p>

        <!-- NAME -->
        <div class="name-grid">
          <div class="field">
            <label>First name</label>
            <input v-model="form.firstName" placeholder="Samuel">
          </div>

          <div class="field">
            <label>Last name</label>
            <input v-model="form.lastName" placeholder="Green">
          </div>
        </div>

        <div class="name-grid" style="margin-top:12px">
          <div class="field">
            <label>Phone Number</label>
            <input v-model="form.phone" placeholder="(+855) 000-000-000">
          </div>

          <div class="field">
            <label>Farm Name</label>
            <input v-model="form.farmName" placeholder="Green Valley Farm">
          </div>
        </div>

        <!-- EMAIL -->
        <div class="field">
          <label>Email Address</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="farmer@example.com"
          >
        </div>

        <!-- PASSWORD -->
        <div class="name-grid">
          <div class="field">
            <label>Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Enter password"
            >
          </div>

          <div class="field">
            <label>Confirm Password</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Confirm password"
            >
          </div>
        </div>

        <!-- FARM LOCATION -->
        <div class="location-section">
          <div class="location-header">
            <div class="location-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <div class="location-title">Farm Location</div>
              <div class="location-subtitle">Used for delivery routing &amp; map tracking</div>
            </div>
          </div>

          <div class="location-steps">
            <!-- Province -->
            <div class="loc-step">
              <div class="loc-step-num">1</div>
              <div class="loc-step-body">
                <label for="farmProvince" class="loc-label">Province / City</label>
                <div class="loc-select-wrap">
                  <select id="farmProvince" v-model="selectedProvince" class="loc-select">
                    <option value="">Choose your province...</option>
                    <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- District -->
            <div class="loc-step" :class="{ 'loc-step--locked': !selectedProvince }">
              <div class="loc-step-num">2</div>
              <div class="loc-step-body">
                <label for="farmDistrict" class="loc-label">District / Khan</label>
                <div class="loc-select-wrap">
                  <select id="farmDistrict" v-model="selectedDistrict" :disabled="!selectedProvince" class="loc-select">
                    <option value="">{{ selectedProvince ? 'Choose your district...' : 'Select province first' }}</option>
                    <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Commune -->
            <div class="loc-step" :class="{ 'loc-step--locked': !selectedDistrict }">
              <div class="loc-step-num">3</div>
              <div class="loc-step-body">
                <label for="farmCommune" class="loc-label">Commune / Sangkat</label>
                <div class="loc-select-wrap">
                  <select id="farmCommune" v-model="selectedCommune" :disabled="!selectedDistrict" class="loc-select">
                    <option value="">{{ selectedDistrict ? 'Choose your commune...' : 'Select district first' }}</option>
                    <option v-for="c in communes" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- summary chip -->
          <div v-if="selectedProvince" class="loc-summary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>{{ [selectedProvince, selectedDistrict, selectedCommune].filter(Boolean).join(' › ') }}</span>
          </div>
        </div>

        <!-- FILES -->
        <div class="upload-grid">
          <div>
            <label class="field-label">Farmer ID</label>

            <label class="upload-box">
              <input
                class="hidden"
                type="file"
                accept="image/*"
                @change="(event) => onFileChange(event, 'idPhoto')"
              >

              <img
                v-if="previews.idPhoto"
                :src="previews.idPhoto"
                class="preview-image"
              >

              <div v-else class="upload-inner">
                <div class="upload-title">Upload ID</div>
                <div class="upload-hint">PNG / JPG</div>
              </div>
            </label>
          </div>

          <div>
            <label class="field-label">Farm Deed</label>

            <label class="upload-box">
              <input
                class="hidden"
                type="file"
                accept="image/*"
                @change="(event) => onFileChange(event, 'farmDeed')"
              >

              <img
                v-if="previews.farmDeed"
                :src="previews.farmDeed"
                class="preview-image"
              >

              <div v-else class="upload-inner">
                <div class="upload-title">Upload Deed</div>
                <div class="upload-hint">PNG / JPG</div>
              </div>
            </label>
          </div>
        </div>

        <!-- TAGS -->
        <div class="field">
          <label>Product Catalog</label>

          <div class="tag-list">
            <span
              v-for="tag in tags"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>

          <div class="tag-input">
            <input
              v-model="newTag"
              placeholder="Add product"
            >

            <button
              type="button"
              class="tag-btn"
              @click="addTag"
            >
              Add
            </button>
          </div>
        </div>

        <!-- CHECKBOX -->
        <label class="policy-check">
          <input type="checkbox" v-model="form.agree">

          <span>
            I confirm the accuracy of submitted agricultural data and
            agree to the operational protocols and privacy policy.
          </span>
        </label>

        <!-- ERROR -->
        <p
          v-if="errorMessage"
          class="feedback feedback-error"
        >
          {{ errorMessage }}
        </p>

        <!-- BUTTON -->
        <button
          @click="onSubmit"
          class="primary-btn"
        >
          Create Farmer Account
        </button>

        <p class="footer-copy">
          Already have an account?
          <NuxtLink to="/auth/signin">
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
import { isValidEmail } from '../../utils/validation';
import { useCambodiaLocations } from '../../composables/useCambodiaLocations';

const router = useRouter();
const { requestSignupOtp } = useAuth();
const {
  selectedProvince,
  selectedDistrict,
  selectedCommune,
  provinces,
  districts,
  communes,
  fullAddress,
} = useCambodiaLocations();
const PROFILE_STORAGE_KEY = 'farmlink.farmer.profilePreview';
const ONBOARDING_STORAGE_KEY = 'farmlink.farmer.onboarding';

const dbName = 'farmlink_onboarding_db_v2';
const storeName = 'onboarding_store';

function saveToIndexedDB(key: string, value: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(storeName);
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.put(value, key);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
}

const form = reactive({
  firstName: '',
  lastName: '',
  farmName: '',
  phone: '',
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

  if (!form.firstName || !form.lastName || !form.phone || !form.email || !form.password || !form.confirmPassword) {
    errorMessage.value = 'Please complete all required fields.';
    return;
  }

  if (!isValidEmail(form.email)) {
    errorMessage.value = 'Please enter a valid email address.';
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

  const firstName = form.firstName.trim();
  const lastName = form.lastName.trim() || 'Farmer';
  const farmName = form.farmName.trim() || `${firstName} ${lastName}`;

  await persistOnboarding();

  await requestSignupOtp({
    firstName,
    lastName,
    email: form.email,
    password: form.password,
    role: 'farmer',
    phone: form.phone,
    farmName,
    province: selectedProvince.value || undefined,
    district: selectedDistrict.value || undefined,
    commune: selectedCommune.value || undefined,
    address: fullAddress.value || undefined,
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
    if (input) input.value = '';
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
    province: selectedProvince.value,
    district: selectedDistrict.value,
    commune: selectedCommune.value,
    address: fullAddress.value,
    farmName: form.farmName,
    tags: tags.value,
    idPhoto: await serializeFile(files.idPhoto),
    farmDeed: await serializeFile(files.farmDeed),
    profilePhoto: await serializeFile(files.profilePhoto),
  };

  // Convert the Vue proxy object payload to a plain vanilla JS object
  // so the browser's structured clone algorithm can store it in IndexedDB
  const plainPayload = JSON.parse(JSON.stringify(payload));

  try {
    await saveToIndexedDB(ONBOARDING_STORAGE_KEY, plainPayload);
    sessionStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
  } catch (err) {
    console.error('Failed to save onboarding to IndexedDB, falling back to sessionStorage:', err);
    try {
      sessionStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(payload));
    } catch (fallbackErr) {
      console.error('Fallback sessionStorage persistence failed:', fallbackErr);
    }
  }
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
:root {
	--bg: #f4f7f2;
	--card: rgba(255, 255, 255, 0.72);
	--border: rgba(255, 255, 255, 0.3);
	--text: #0f172a;
	--muted: #64748b;
	--green: #166534;
	--green-dark: #0f4f29;
}

* {
	box-sizing: border-box;
}

.auth-page {
	position: relative;
	min-height: 100vh;
	padding: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background:
		radial-gradient(circle at top left, rgba(22, 101, 52, 0.18), transparent 30%),
		radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.12), transparent 30%),
		linear-gradient(135deg, #f4f7f2, #eef3ea);
}

/* blur background */
.auth-page::before,
.auth-page::after {
	content: '';
	position: absolute;
	width: 420px;
	height: 420px;
	border-radius: 50%;
	filter: blur(90px);
	opacity: 0.4;
	z-index: 0;
}

.auth-page::before {
	top: -120px;
	left: -120px;
	background: #4ade80;
}

.auth-page::after {
	right: -120px;
	bottom: -120px;
	background: #86efac;
}

/* MAIN LAYOUT */
.auth-shell {
	position: relative;
	z-index: 2;
	width: min(1240px, 100%);
	display: grid;
	grid-template-columns: 1.08fr 0.92fr;
	gap: 28px;
	align-items: stretch;
}

/* GLASS */
.hero-panel,
.form-panel {
	position: relative;
	background: var(--card);
	backdrop-filter: blur(22px);
	-webkit-backdrop-filter: blur(22px);
	border: 1px solid var(--border);
	border-radius: 34px;
	box-shadow:
		0 10px 40px rgba(15, 23, 42, 0.06),
		0 2px 10px rgba(15, 23, 42, 0.04);
	overflow: hidden;
}

/* HERO */
.hero-panel {
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 18px;
}

.hero-image-wrap {
	position: relative;
	min-height: 500px;
	border-radius: 28px;
	overflow: hidden;
}

.hero-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transform: scale(1.02);
	transition: transform 0.8s ease;
}

.hero-panel:hover .hero-image {
	transform: scale(1.06);
}

/* OVERLAY */
.hero-overlay {
	position: absolute;
	inset: 0;
	padding: 36px;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	background:
		linear-gradient(
			180deg,
			rgba(15, 23, 42, 0.02),
			rgba(15, 23, 42, 0.78)
		);
	color: white;
}

.eyebrow,
.form-badge {
	display: inline-flex;
	align-items: center;
	width: fit-content;
	padding: 8px 14px;
	border-radius: 999px;
	font-size: 11px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.12em;
}

.eyebrow {
	background: rgba(255,255,255,0.14);
	border: 1px solid rgba(255,255,255,0.2);
	backdrop-filter: blur(10px);
}

.hero-overlay h2 {
	margin: 18px 0 12px;
	font-size: clamp(38px, 5vw, 56px);
	font-weight: 800;
	line-height: 0.95;
	max-width: 10ch;
	letter-spacing: -0.04em;
}

.hero-overlay p {
	max-width: 42ch;
	font-size: 15px;
	line-height: 1.7;
	color: rgba(255,255,255,0.84);
}

/* FEATURES */
.feature-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;
}

.feature-card {
	padding: 22px;
	border-radius: 24px;
	background: rgba(255,255,255,0.7);
	border: 1px solid rgba(255,255,255,0.45);
	backdrop-filter: blur(14px);
	transition: all 0.3s ease;
}

.feature-card:hover {
	transform: translateY(-4px);
	box-shadow: 0 10px 30px rgba(15,23,42,0.08);
}

.feature-label {
	display: inline-block;
	margin-bottom: 10px;
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: #64748b;
}

.feature-card strong {
	display: block;
	font-size: 20px;
	color: #0f172a;
	margin-bottom: 8px;
}

.feature-card p {
	color: #64748b;
	line-height: 1.6;
	font-size: 14px;
}

/* FORM */
.form-panel {
	padding: 44px;
	display: flex;
	flex-direction: column;
	gap: 18px;
	justify-content: center;
}

.form-badge {
	background: rgba(22,101,52,0.08);
	color: var(--green);
	border: 1px solid rgba(22,101,52,0.12);
}

.form-panel h1 {
	margin: 10px 0;
	font-size: clamp(40px, 5vw, 56px);
	font-weight: 800;
	line-height: 0.95;
	letter-spacing: -0.05em;
	color: var(--text);
}

.form-intro {
	font-size: 15px;
	line-height: 1.7;
	color: var(--muted);
	margin-bottom: 8px;
	max-width: 46ch;
}

/* INPUTS */
.name-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 14px;
}

.field {
	display: grid;
	gap: 8px;
}

.field label,
.field-label {
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: #475569;
}

.field input,
.tag-input input {
	width: 100%;
	height: 56px;
	padding: 0 18px;
	border-radius: 18px;
	border: 1px solid rgba(15,23,42,0.08);
	background: rgba(255,255,255,0.7);
	font-size: 15px;
	color: #0f172a;
	outline: none;
	transition: all 0.25s ease;
	backdrop-filter: blur(10px);
}

.field input::placeholder,
.tag-input input::placeholder {
	color: #94a3b8;
}

.field input:focus,
.tag-input input:focus {
	background: white;
	border-color: rgba(22,101,52,0.5);
	box-shadow:
		0 0 0 4px rgba(22,101,52,0.08),
		0 8px 20px rgba(22,101,52,0.08);
}

/* UPLOAD */
.upload-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;
}

.upload-box {
	height: 140px;
	border-radius: 24px;
	border: 2px dashed rgba(15,23,42,0.08);
	background: rgba(255,255,255,0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	cursor: pointer;
	transition: 0.25s ease;
}

.upload-box:hover {
	border-color: rgba(22,101,52,0.4);
	background: rgba(255,255,255,0.8);
}

.preview-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.upload-inner {
	text-align: center;
}

.upload-title {
	font-size: 14px;
	font-weight: 700;
	color: #0f172a;
	margin-bottom: 4px;
}

.upload-hint {
	font-size: 12px;
	color: #64748b;
}

/* TAGS */
.tag-list {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin-bottom: 12px;
}

.tag {
	padding: 8px 14px;
	border-radius: 999px;
	background: rgba(22,101,52,0.08);
	color: #166534;
	font-size: 13px;
	font-weight: 700;
}

.tag-input {
	display: flex;
	gap: 10px;
}

.tag-btn {
	height: 56px;
	padding: 0 20px;
	border: none;
	border-radius: 18px;
	background: rgba(22,101,52,0.08);
	color: #166534;
	font-weight: 700;
	cursor: pointer;
}

/* CHECK */
.policy-check {
	display: flex;
	gap: 12px;
	font-size: 14px;
	line-height: 1.6;
	color: #475569;
}

.policy-check input {
	accent-color: var(--green);
	margin-top: 4px;
}

/* ERROR */
.feedback {
	padding: 14px;
	border-radius: 16px;
	background: rgba(255,255,255,0.75);
	border: 1px solid rgba(15,23,42,0.06);
	font-size: 14px;
}

.feedback-error {
	color: #b42318;
	background: rgba(254,242,242,0.9);
	border-color: rgba(180,35,24,0.12);
}

/* BUTTON */
.primary-btn {
	height: 58px;
	border: none;
	border-radius: 18px;
	background:
		linear-gradient(
			135deg,
			#22c55e,
			#166534
		);
	color: white;
	font-size: 15px;
	font-weight: 700;
	cursor: pointer;
	transition: 0.25s ease;
	box-shadow:
		0 10px 25px rgba(22,101,52,0.22),
		0 2px 10px rgba(22,101,52,0.12);
}

.primary-btn:hover {
	transform: translateY(-2px);
	box-shadow:
		0 16px 34px rgba(22,101,52,0.3),
		0 6px 18px rgba(22,101,52,0.16);
}

/* FOOTER */
.footer-copy {
	text-align: center;
	font-size: 14px;
	color: var(--muted);
	margin-top: 8px;
}

.footer-copy a {
	color: var(--green);
	font-weight: 700;
	text-decoration: none;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
	.auth-shell {
		grid-template-columns: 1fr;
	}

	.hero-image-wrap {
		min-height: 360px;
	}
}

@media (max-width: 720px) {
	.auth-page {
		padding: 16px;
	}

	.hero-panel,
	.form-panel {
		padding: 20px;
		border-radius: 26px;
	}

	.name-grid,
	.feature-grid,
	.upload-grid {
		grid-template-columns: 1fr;
	}

	.hero-overlay {
		padding: 24px;
	}

	.hero-overlay h2,
	.form-panel h1 {
		font-size: 38px;
	}
}
/* ── Farm Location section redesign ─────────────────────────── */
.location-section {
	padding: 20px;
	background: linear-gradient(135deg, rgba(22,101,52,0.04), rgba(22,101,52,0.02));
	border: 1px solid rgba(22, 101, 52, 0.12);
	border-radius: 22px;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.location-header {
	display: flex;
	align-items: center;
	gap: 12px;
}

.location-icon {
	width: 36px;
	height: 36px;
	border-radius: 10px;
	background: rgba(22, 101, 52, 0.1);
	color: var(--green);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.location-title {
	font-size: 12px;
	font-weight: 800;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: var(--green);
	line-height: 1;
}

.location-subtitle {
	font-size: 12px;
	color: #94a3b8;
	margin-top: 3px;
	font-weight: 500;
}

.location-steps {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.loc-step {
	display: flex;
	align-items: center;
	gap: 12px;
	transition: opacity 0.2s ease;
}

.loc-step--locked {
	opacity: 0.45;
}

.loc-step-num {
	width: 26px;
	height: 26px;
	border-radius: 50%;
	background: rgba(22, 101, 52, 0.1);
	color: var(--green);
	font-size: 11px;
	font-weight: 800;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border: 1.5px solid rgba(22, 101, 52, 0.18);
}

.loc-step-body {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.loc-label {
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: #475569;
}

.loc-select-wrap {
	position: relative;
}

.loc-select {
	width: 100%;
	height: 48px;
	padding: 0 40px 0 16px;
	border-radius: 14px;
	border: 1px solid rgba(15, 23, 42, 0.08);
	background: rgba(255, 255, 255, 0.9);
	font-size: 14px;
	color: #0f172a;
	outline: none;
	cursor: pointer;
	transition: all 0.22s ease;
	appearance: none;
	-webkit-appearance: none;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: right 14px center;
	backdrop-filter: blur(8px);
	font-weight: 500;
}

.loc-select:hover:not(:disabled) {
	border-color: rgba(22, 101, 52, 0.25);
	background-color: white;
}

.loc-select:focus {
	background-color: white;
	border-color: rgba(22, 101, 52, 0.5);
	box-shadow: 0 0 0 4px rgba(22, 101, 52, 0.08), 0 4px 12px rgba(22,101,52,0.06);
}

.loc-select:disabled {
	cursor: not-allowed;
	background-color: rgba(241, 245, 249, 0.6);
	color: #94a3b8;
}

/* location summary breadcrumb */
.loc-summary {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 8px 14px;
	border-radius: 999px;
	background: rgba(22, 101, 52, 0.08);
	border: 1px solid rgba(22, 101, 52, 0.14);
	font-size: 12px;
	font-weight: 600;
	color: var(--green);
	align-self: flex-start;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>