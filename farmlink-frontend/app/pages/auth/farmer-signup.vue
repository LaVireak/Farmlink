<template>
  <div class="min-h-screen bg-[#f5f6f3] px-4 py-10 flex justify-center">
    <div class="w-full max-w-6xl grid md:grid-cols-2 gap-10">
      <div class="bg-white rounded-3xl shadow-md overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef"
          class="h-[420px] w-full object-cover"
        >

        <div class="p-6">
          <h2 class="text-xl font-semibold text-slate-800">
            Precision Ecology for the modern farmer
          </h2>

          <p class="text-sm text-slate-500 mt-2">
            Join the most advanced digital network connecting sustainable harvests.
          </p>

          <div class="flex gap-4 mt-4">
            <div class="bg-slate-100 px-4 py-3 rounded-xl text-sm">
              <strong>4.2k</strong><br>Active Farms
            </div>
            <div class="bg-slate-100 px-4 py-3 rounded-xl text-sm">
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
          <input v-model="form.name" placeholder="Full Name" class="input">
          <input v-model="form.phone" placeholder="Phone Number" class="input">
        </div>

        <div class="card">
          <h3 class="section-title">Verification Hub</h3>

          <div class="grid grid-cols-2 gap-4 mt-4">
            <div class="upload-box">ID Photo</div>
            <div class="upload-box">Farm Deed</div>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title">Farm Logistics</h3>
          <input v-model="form.address" placeholder="Farm Address" class="input mt-3">
        </div>

        <div class="card flex items-center justify-between">
          <div>
            <p class="font-medium text-sm">Upload Aerial or Field Photo</p>
            <p class="text-xs text-slate-500">Recommended for verification</p>
          </div>
          <button class="btn-secondary" type="button">Select</button>
        </div>

        <div class="card">
          <h3 class="section-title">Product Catalog</h3>

          <div class="flex flex-wrap gap-2 mt-3">
            <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <div class="flex gap-2 mt-3">
            <input v-model="newTag" placeholder="Add product" class="input flex-1">
            <button @click="addTag" class="btn-secondary" type="button">Add</button>
          </div>
        </div>

        <label class="flex gap-2 text-sm mt-4">
          <input type="checkbox" v-model="form.agree">
          I confirm the accuracy of submitted data
        </label>

        <p v-if="errorMessage" class="text-red-600 text-sm mt-2">
          {{ errorMessage }}
        </p>

        <button
          @click="onSubmit"
          class="w-full bg-green-800 text-white py-3 rounded-xl mt-4 hover:bg-green-900"
        >
          Initialize Partner Account
        </button>
        <p class="text-center text-sm text-slate-600 mt-6">
					Already have an account?
					<NuxtLink to="/auth/signin" class="text-emerald-700 font-semibold">
						Log in here
					</NuxtLink>
				</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
  name: '',
  phone: '',
  address: '',
  agree: false,
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

  if (!form.agree) {
    errorMessage.value = 'Please confirm your data.';
    return;
  }

  console.log({ ...form, tags: tags.value });
  await router.push('/auth/signin?role=farmer');
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid #cbd5e1;
  font-size: 0.875rem;
  outline: none;
}

.card {
  background: #ffffff;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  margin-top: 1rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

.upload-box {
  border: 2px dashed #cbd5e1;
  border-radius: 0.75rem;
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: #94a3b8;
}

.btn-secondary {
  background: #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.btn-secondary:hover {
  background: #cbd5e1;
}

.tag {
  background: #d1fae5;
  color: #047857;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
}

.input:focus {
  box-shadow: 0 0 0 2px #10b981;
}
</style>