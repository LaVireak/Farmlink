<template>
    <div class="min-h-screen bg-[#f7f5ef] flex items-center justify-center px-4 py-8">
        <div class="w-full max-w-5xl bg-white rounded-3xl shadow-lg overflow-hidden grid md:grid-cols-2">
            <!-- LEFT IMAGE -->
            <div class="relative hidden md:block">
                <img 
                src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80" 
                class="h-full w-full object-cover"
                />
                <div class="absolute bottom-6 left-6 right-6 text-white">
                    <h2 class="text-2xl italic font-serif leading-snug">
                        Cultivating connections<br />
                        between soil and soul.
                    </h2>
                </div>
            </div>
             <!-- RIGHT FORM -->
            <div class="p-8 md:p-10 flex flex-col justify-center">
                <span class="bg-emerald-700 text-white text-xs px-3 py-1 rounded-full w-fit mb-4">
                    MEMBER PORTAL
                </span>

                <h1 class="text-3xl font-serif text-slate-900">Welcome Back</h1>
                <p class="text-sm text-slate-600 mb-6">Looking for some fresh vegetable</p>
                <!-- ROLE SWITCH -->
                 <div class="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                    <button
                    type="button"
                    class="rounded-lg px-3 py-2 text-sm font-medium transition"
                    :class="selectedRole === 'customer'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600'"
                    @click="selectedRole = 'customer'"
                >
                    User
                </button>

                <button
                    type="button"
                    class="rounded-lg px-3 py-2 text-sm font-medium transition"
                    :class="selectedRole === 'farmer'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600'"
                    @click="selectedRole = 'farmer'"
                >
                    Farmer
                </button>
                </div>
                <!-- FORM -->
                <form class="space-y-4" @submit.prevent="onSubmit">
                <div>
                    <label class="text-xs text-slate-500">EMAIL ADDRESS</label>
                    <input
                    v-model.trim="form.email"
                    type="email"
                    class="w-full mt-1 bg-[#f7efcf] px-3 py-2 rounded-md outline-none"
                    placeholder="you@example.com"
                    required
                    />
                </div>

                <div>
                    <div class="flex justify-between text-xs text-slate-500">
                    <label>PASSWORD</label>

					<NuxtLink to="/auth/forgot-password" class="text-emerald-700 font-semibold">
					Forgot Password?
					</NuxtLink>
				    
                    </div>
                    <input
                    v-model="form.password"
                    type="password"
                    class="w-full mt-1 bg-[#f7efcf] px-3 py-2 rounded-md outline-none"
                    placeholder="Enter your password"
                    required
                    />
                </div>

                <label class="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" class="accent-emerald-700" />
                    Remember Me
                </label>

                <p v-if="errorMessage" class="text-sm text-red-600">
                    {{ errorMessage }}
                </p>

                <button
                    type="submit"
                    :disabled="submitting"
                    class="w-full bg-green-800 text-white py-3 rounded-full tracking-widest text-sm hover:bg-green-900 transition"
                >
                    {{ submitting ? 'Signing in...' : 'ENTER GREENHOUSE →' }}
                </button>
                </form>

                <p class="mt-6 text-center text-sm text-slate-600">
                    New in Here?
                    <NuxtLink :to="selectedRole === 'farmer' ? '/auth/farmer-signup' : '/auth/signup'" class="text-emerald-700 font-semibold">
                        Apply for an Account
                    </NuxtLink>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import type { SignInPayload } from '../../types/auth.type';

const route = useRoute();
const router = useRouter();
const { signIn, getPostSignInRoute } = useAuth();

const selectedRole = ref<SignInPayload['expectedRole']>('customer');
const submitting = ref(false);
const errorMessage = ref('');

const form = reactive({
  email: '',
  password: '',
});

if (route.query.role === 'farmer') {
    selectedRole.value = 'farmer';
}

const onSubmit = async () => {
  errorMessage.value = '';

  if (!form.email || !form.password) {
    errorMessage.value = 'Email and password are required.';
    return;
  }

  submitting.value = true;

  try {
    const result = await signIn({
      email: form.email,
      password: form.password,
      expectedRole: selectedRole.value,
    });

    await router.push(getPostSignInRoute(result.user.role));
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to sign in.';
  } finally {
    submitting.value = false;
  }
};
</script>
