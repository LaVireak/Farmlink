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
                    Login to Your Account
                </span>

                <h1 class="text-3xl font-serif text-slate-900">Welcome Back</h1>
                <p class="text-sm text-slate-600 mb-6">Looking for some fresh vegetable</p>
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
                    </div>
                    <input
                    v-model="form.password"
                    type="password"
                    class="w-full mt-1 bg-[#f7efcf] px-3 py-2 rounded-md outline-none"
                    placeholder="Enter your password"
                    required
                    />
                </div>

                <div class="flex items-center justify-between text-sm text-slate-700">
                    <label class="flex items-center gap-2">
                        <input type="checkbox" class="accent-emerald-700" />
                        Remember Me
                    </label>
                    <NuxtLink to="/auth/forgot-password" class="text-emerald-700 font-semibold">
                        Forgot Password?
                    </NuxtLink>
                </div>

                <p v-if="errorMessage" class="text-sm text-red-600">
                    {{ errorMessage }}
                </p>

                <button
                    type="submit"
                    :disabled="submitting"
                    class="w-full bg-green-800 text-white py-3 rounded-full tracking-widest text-sm hover:bg-green-900 transition"
                >
                    {{ submitting ? 'Signing in...' : 'ENTER TO YOUR ACCOUNT →' }}
                </button>

                <div class="flex items-center gap-3">
                    <span class="h-px flex-1 bg-slate-200"></span>
                    <span class="text-xs text-slate-400">OR</span>
                    <span class="h-px flex-1 bg-slate-200"></span>
                </div>

                <div class="flex flex-col items-center gap-2">
                    <div ref="googleButton" class="w-full flex justify-center"></div>
                    <p v-if="googleSubmitting" class="text-xs text-slate-500">
                        Signing in with Google...
                    </p>
                    <p v-if="googleError" class="text-xs text-red-600">
                        {{ googleError }}
                    </p>
                </div>
                </form>

                <p class="mt-6 text-center text-sm text-slate-600">
                    New in Here?
                    <NuxtLink to="/auth/signup" class="text-emerald-700 font-semibold">
                        Apply for an Account
                    </NuxtLink>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const { signIn, signInWithGoogle, getPostSignInRoute } = useAuth();

const submitting = ref(false);
const errorMessage = ref('');
const googleSubmitting = ref(false);
const googleError = ref('');
const googleButton = ref<HTMLDivElement | null>(null);
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

const form = reactive({
  email: '',
  password: '',
});

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
        });

    await router.push(getPostSignInRoute(result.user.role));
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Unable to sign in.';
  } finally {
    submitting.value = false;
  }
};

const handleGoogleCredential = async (credential?: string) => {
    if (!credential) {
        googleError.value = 'Google sign-in failed to return credentials.';
        return;
    }

    googleSubmitting.value = true;
    googleError.value = '';

    try {
        const result = await signInWithGoogle(credential);
        await router.push(getPostSignInRoute(result.user.role));
    } catch (error) {
        googleError.value = error instanceof Error ? error.message : 'Unable to sign in with Google.';
    } finally {
        googleSubmitting.value = false;
    }
};

const initializeGoogle = () => {
    if (!googleButton.value) return;
    const google = (window as typeof window & { google?: any }).google;

    if (!google?.accounts?.id) {
        return false;
    }

    google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response: { credential?: string }) => handleGoogleCredential(response.credential),
    });

    googleButton.value.innerHTML = '';
    google.accounts.id.renderButton(googleButton.value, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        width: 320,
        text: 'signin_with',
    });

    return true;
};

onMounted(() => {
    if (!googleClientId) {
        googleError.value = 'Google sign-in is not configured.';
        return;
    }

    let attempts = 0;
    const maxAttempts = 25;
    const tryInit = () => {
        attempts += 1;
        if (initializeGoogle()) {
            return;
        }

        if (attempts >= maxAttempts) {
            googleError.value = 'Google sign-in failed to load.';
            return;
        }

        setTimeout(tryInit, 200);
    };

    tryInit();
});
</script>
