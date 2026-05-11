<template>
	<div class="min-h-screen bg-[#f7f5ef] flex items-center justify-center px-4 py-10">
		<div class="w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center">
			<div class="relative hidden md:block">
				<img
					src="https://images.unsplash.com/photo-1542838132-92c53300491e"
					class="rounded-3xl w-full h-[520px] object-cover shadow-md"
				>

				<div class="absolute bottom-6 right-6 bg-yellow-400 text-slate-800 px-5 py-4 rounded-2xl shadow-md text-sm italic">
					Rooted in community,<br>
					grown for you.
				</div>
			</div>

			<div>
				<span class="bg-emerald-800 text-white text-xs px-3 py-1 rounded-full">
					Register as a Customer
				</span>

				<h1 class="text-4xl font-serif mt-3 text-green-900">
					Create your account
				</h1>

				<p class="text-slate-600 mt-2 mb-6">
					Start your journey toward honest, farm-fresh sourcing today.
				</p>

				<form class="space-y-4" @submit.prevent="onSubmit">
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="text-xs text-slate-500">FIRST NAME</label>
							<input
								v-model="form.firstName"
								type="text"
								class="w-full mt-1 bg-[#f7efcf] px-3 py-2 rounded-md outline-none"
								placeholder="Julian"
								required
							>
						</div>

						<div>
							<label class="text-xs text-slate-500">LAST NAME</label>
							<input
								v-model="form.lastName"
								type="text"
								class="w-full mt-1 bg-[#f7efcf] px-3 py-2 rounded-md outline-none"
								placeholder="Barnes"
								required
							>
						</div>
					</div>

					<div>
						<label class="text-xs text-slate-500">EMAIL ADDRESS</label>
						<input
							v-model="form.email"
							type="email"
							class="w-full mt-1 bg-[#f7efcf] px-3 py-2 rounded-md outline-none"
							placeholder="julian@field.com"
							required
						>
					</div>

					<div>
						<label class="text-xs text-slate-500">PASSWORD</label>
						<input
							v-model="form.password"
							type="password"
							class="w-full mt-1 bg-[#f7efcf] px-3 py-2 rounded-md outline-none"
							placeholder="••••••••"
							required
						>
					</div>

					<div>
						<label class="text-xs text-slate-500">CONFIRM PASSWORD</label>
						<input
							v-model="form.confirmPassword"
							type="password"
							class="w-full mt-1 bg-[#f7efcf] px-3 py-2 rounded-md outline-none"
							placeholder="••••••••"
							required
						>
					</div>

					<label class="flex items-start gap-2 text-sm text-slate-600">
						<input v-model="form.agree" type="checkbox" class="mt-1 accent-emerald-700">
						<span>
							I agree to the
							<a href="#" class="text-emerald-700 underline">Terms of Service</a>
							and
							<a href="#" class="text-emerald-700 underline">Privacy Policy</a>
						</span>
					</label>

					<p v-if="errorMessage" class="text-sm text-red-600">
						{{ errorMessage }}
					</p>

					<button
						type="submit"
						:disabled="submitting"
						class="w-full bg-green-900 text-white py-3 rounded-full text-sm font-semibold hover:bg-green-800 transition"
					>
						{{ submitting ? 'Creating...' : 'Create Your Account' }}
					</button>

					<div class="flex items-center gap-3 my-4">
						<div class="flex-1 h-px bg-slate-300"></div>
						<span class="text-xs text-slate-400">OR JOIN WITH</span>
						<div class="flex-1 h-px bg-slate-300"></div>
					</div>

					<div class="flex flex-col items-center gap-2">
						<div ref="googleButton" class="w-full flex justify-center"></div>
						<p v-if="googleSubmitting" class="text-xs text-slate-500">
							Signing up with Google...
						</p>
						<p v-if="googleError" class="text-xs text-red-600">
							{{ googleError }}
						</p>
					</div>
				</form>

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
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const { requestSignupOtp, signInWithGoogle, getPostSignInRoute } = useAuth();

const submitting = ref(false);
const errorMessage = ref('');
const googleSubmitting = ref(false);
const googleError = ref('');
const googleButton = ref<HTMLDivElement | null>(null);
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

const form = reactive({
	firstName: '',
	lastName: '',
	email: '',
	password: '',
	confirmPassword: '',
	agree: false,
});

const onSubmit = async () => {
	errorMessage.value = '';

	if (!form.agree) {
		errorMessage.value = 'You must agree to the terms.';
		return;
	}

	if (form.password !== form.confirmPassword) {
		errorMessage.value = 'Passwords do not match.';
		return;
	}

	submitting.value = true;

	try {
		await requestSignupOtp({
			firstName: form.firstName,
			lastName: form.lastName,
			email: form.email,
			password: form.password,
			role: 'customer',
		});

		await router.push(`/auth/verify-code?email=${encodeURIComponent(form.email)}`);
	} catch {
		errorMessage.value = 'Signup failed';
	} finally {
		submitting.value = false;
	}
};

const handleGoogleCredential = async (credential?: string) => {
	if (!credential) {
		googleError.value = 'Google sign-up failed to return credentials.';
		return;
	}

	googleSubmitting.value = true;
	googleError.value = '';

	try {
		const result = await signInWithGoogle(credential);
		await router.push(getPostSignInRoute(result.user.role));
	} catch (error) {
		googleError.value = error instanceof Error ? error.message : 'Unable to sign up with Google.';
	} finally {
		googleSubmitting.value = false;
	}
};

const initializeGoogle = () => {
	if (!googleButton.value) return false;
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
		text: 'signup_with',
	});

	return true;
};

onMounted(() => {
	if (!googleClientId) {
		googleError.value = 'Google sign-up is not configured.';
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
			googleError.value = 'Google sign-up failed to load.';
			return;
		}

		setTimeout(tryInit, 200);
	};

	tryInit();
});
</script>
