<template>
	<div class="auth-page">
		<div class="auth-shell">
			<section class="hero-panel">
				<div class="hero-image-wrap">
					<img
						src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80"
						alt="Fresh produce and market goods"
						class="hero-image"
					>

					<div class="hero-overlay">
						<span class="eyebrow">Trusted marketplace</span>
						<h2>Join a modern farm-to-table experience.</h2>
						<p>Build your account, save favorites, and connect with verified farmers in one secure place.</p>
					</div>
				</div>

				<div class="feature-grid">
					<div class="feature-card">
						<span class="feature-label">Secure sign-up</span>
						<strong>OTP verification</strong>
						<p>Confirm your email with a code before activating your account.</p>
					</div>
					<div class="feature-card">
						<span class="feature-label">Personalized</span>
						<strong>Tailored profiles</strong>
						<p>Save your name and preferences for a smoother experience.</p>
					</div>
				</div>
			</section>

			<section class="form-panel">
				<div class="form-badge">Create account</div>
				<h1>Sign up for FarmLink</h1>
				<p class="form-intro">Get started with a polished account flow built for secure, professional onboarding.</p>

				<form class="auth-form" @submit.prevent="onSubmit">
					<div class="name-grid">
						<div class="field">
							<label for="firstName">First name</label>
							<input
								id="firstName"
								v-model.trim="form.firstName"
								type="text"
								placeholder="Julian"
								autocomplete="given-name"
								required
							>
						</div>

						<div class="field">
							<label for="lastName">Last name</label>
							<input
								id="lastName"
								v-model.trim="form.lastName"
								type="text"
								placeholder="Barnes"
								autocomplete="family-name"
								required
							>
						</div>
					</div>

					<div class="field">
						<label for="email">Email address</label>
						<input
							id="email"
							v-model.trim="form.email"
							type="email"
							placeholder="julian@field.com"
							autocomplete="email"
							required
						>
					</div>

					<div class="field">
						<label for="password">Password</label>
						<div class="input-wrap">
							<input
								id="password"
								v-model="form.password"
								:type="showPassword ? 'text' : 'password'"
								placeholder="Create a secure password"
								autocomplete="new-password"
								required
							>
							<button
								type="button"
								class="eye-btn"
								:aria-label="showPassword ? 'Hide password' : 'Show password'"
								@click="showPassword = !showPassword"
							>
								<svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
								</svg>
								<svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
								</svg>
							</button>
						</div>
					</div>

					<div class="field">
						<label for="confirmPassword">Confirm password</label>
						<div class="input-wrap">
							<input
								id="confirmPassword"
								v-model="form.confirmPassword"
								:type="showConfirmPassword ? 'text' : 'password'"
								placeholder="Re-enter your password"
								autocomplete="new-password"
								required
							>
							<button
								type="button"
								class="eye-btn"
								:aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
								@click="showConfirmPassword = !showConfirmPassword"
							>
								<svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
								</svg>
								<svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
									<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
								</svg>
							</button>
						</div>
					</div>

					<!-- LOCATION DROPDOWNS -->
					<div class="location-section">
						<div class="location-label">Delivery Location</div>
						<div class="location-grid">
							<div class="field">
								<label for="province">Province</label>
								<select id="province" v-model="selectedProvince" class="field-select">
									<option value="">Select Province</option>
									<option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
								</select>
							</div>
							<div class="field">
								<label for="district">District</label>
								<select id="district" v-model="selectedDistrict" :disabled="!selectedProvince" class="field-select">
									<option value="">Select District</option>
									<option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
								</select>
							</div>
							<div class="field">
								<label for="commune">Commune / Sangkat</label>
								<select id="commune" v-model="selectedCommune" :disabled="!selectedDistrict" class="field-select">
									<option value="">Select Commune</option>
									<option v-for="c in communes" :key="c" :value="c">{{ c }}</option>
								</select>
							</div>
						</div>
					</div>
		
					<p v-if="errorMessage" class="feedback feedback-error">{{ errorMessage }}</p>
					<p v-else class="helper-copy">Use at least 8 characters with a mix of letters, numbers, and symbols.</p>

					<div class="policy-row">
						<label class="policy-check">
							<input v-model="form.agree" type="checkbox">
							<span>I agree to the Terms of Service and Privacy Policy</span>
						</label>
					</div>

					
					<button type="submit" :disabled="submitting" class="primary-btn">
						{{ submitting ? 'Creating account...' : 'Create account' }}
					</button>

					<div class="divider">
						<span></span>
						<p>or continue with</p>
						<span></span>
					</div>

					<div class="social-row">
						<!-- GOOGLE -->
						<button
							type="button"
							class="social-btn"
							:disabled="googleSubmitting"
							@click="handleGoogleClick"
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
								<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
								<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
								<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
								<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
							</svg>
							{{ googleSubmitting ? 'Redirecting…' : 'Google' }}
						</button>

						<!-- FACEBOOK -->
						<button
							type="button"
							class="social-btn facebook-btn"
							:disabled="facebookSubmitting"
							@click="handleFacebook"
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="#1877F2" aria-hidden="true">
								<path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
							</svg>
							{{ facebookSubmitting ? 'Redirecting…' : 'Facebook' }}
						</button>
					</div>

					<p v-if="googleError" class="feedback feedback-error">{{ googleError }}</p>
					<p v-if="googleSubmitting" class="feedback">Redirecting to Google...</p>
					<p v-if="facebookError" class="feedback feedback-error">{{ facebookError }}</p>
				</form>

				<p class="footer-copy">
					Already have an account?
					<NuxtLink to="/auth/signin">Sign in</NuxtLink>
				</p>

				<p class="footer-copy">
					Want to be a farmer?
					<NuxtLink to="/auth/farmer-signup">Sign up as a farmer</NuxtLink>
				</p>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import { isValidEmail } from '../../utils/validation';
import { useCambodiaLocations } from '../../composables/useCambodiaLocations';

const router = useRouter();
const { requestSignupOtp, signInWithGoogle } = useAuth();
const {
	selectedProvince,
	selectedDistrict,
	selectedCommune,
	provinces,
	districts,
	communes,
	fullAddress,
} = useCambodiaLocations();

const submitting = ref(false);
const errorMessage = ref('');
const googleSubmitting = ref(false);
const googleError = ref('');
const facebookSubmitting = ref(false);
const facebookError = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

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

	if (!isValidEmail(form.email)) {
		errorMessage.value = 'Please enter a valid email address.';
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
			province: selectedProvince.value || undefined,
			district: selectedDistrict.value || undefined,
			commune: selectedCommune.value || undefined,
			address: fullAddress.value || undefined,
		});

		await router.push(`/auth/verify-code?email=${encodeURIComponent(form.email)}`);
	} catch {
		errorMessage.value = 'Signup failed';
	} finally {
		submitting.value = false;
	}
};

const handleGoogleClick = async () => {
	googleSubmitting.value = true;
	googleError.value = '';

	try {
		await signInWithGoogle();
	} catch (error) {
		googleError.value = error instanceof Error ? error.message : 'Unable to sign up with Google.';
		googleSubmitting.value = false;
	}
};

const handleFacebook = async () => {
	facebookSubmitting.value = true;
	facebookError.value = '';
	try {
		const { signInWithFacebook } = useAuth();
		await signInWithFacebook();
	} catch (error) {
		facebookError.value = error instanceof Error ? error.message : 'Unable to sign up with Facebook.';
		facebookSubmitting.value = false;
	}
};

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

/* floating blur background */
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

.auth-shell {
	position: relative;
	z-index: 2;
	width: min(1240px, 100%);
	display: grid;
	grid-template-columns: 1.08fr 0.92fr;
	gap: 28px;
	align-items: stretch;
}

/* glass cards */
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

/* hero section */
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

/* feature cards */
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

/* form side */
.form-panel {
	padding: 44px;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.form-badge {
	background: rgba(22,101,52,0.08);
	color: var(--green);
	border: 1px solid rgba(22,101,52,0.12);
}

.form-panel h1 {
	margin: 18px 0 12px;
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
	margin-bottom: 28px;
	max-width: 46ch;
}

.auth-form {
	display: grid;
	gap: 18px;
}

.name-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 14px;
}

.field {
	display: grid;
	gap: 8px;
}

.field label {
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: #475569;
}

.field input {
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

.field input::placeholder {
	color: #94a3b8;
}

.field input:hover {
	border-color: rgba(22,101,52,0.22);
}

.field input:focus {
	background: white;
	border-color: rgba(22,101,52,0.5);
	box-shadow:
		0 0 0 4px rgba(22,101,52,0.08),
		0 8px 20px rgba(22,101,52,0.08);
	transform: translateY(-1px);
}

.input-wrap {
	position: relative;
	display: flex;
	align-items: center;
}

.input-wrap input {
	width: 100%;
	height: 56px;
	padding: 0 52px 0 18px;
	border-radius: 18px;
	border: 1px solid rgba(15,23,42,0.08);
	background: rgba(255,255,255,0.7);
	font-size: 15px;
	color: #0f172a;
	outline: none;
	transition: all 0.25s ease;
	backdrop-filter: blur(10px);
}

.input-wrap input::placeholder {
	color: #94a3b8;
}

.input-wrap input:hover {
	border-color: rgba(22,101,52,0.22);
}

.input-wrap input:focus {
	background: white;
	border-color: rgba(22,101,52,0.5);
	box-shadow:
		0 0 0 4px rgba(22,101,52,0.08),
		0 8px 20px rgba(22,101,52,0.08);
	transform: translateY(-1px);
}

.eye-btn {
	position: absolute;
	right: 14px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 30px;
	height: 30px;
	border: none;
	background: transparent;
	color: #94a3b8;
	cursor: pointer;
	border-radius: 8px;
	transition: color 0.15s ease;
	padding: 0;
}

.eye-btn:hover {
	color: #475569;
}

/* checkbox */
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

/* helper text */
.helper-copy,
.feedback,
.footer-copy {
	font-size: 14px;
	line-height: 1.6;
	color: var(--muted);
}

.feedback {
	padding: 14px;
	border-radius: 16px;
	background: rgba(255,255,255,0.75);
	border: 1px solid rgba(15,23,42,0.06);
}

.feedback-error {
	color: #b42318;
	background: rgba(254,242,242,0.9);
	border-color: rgba(180,35,24,0.12);
}

/* premium button */
.primary-btn {
	position: relative;
	height: 56px;
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
	letter-spacing: 0.02em;
	cursor: pointer;
	overflow: hidden;
	transition: all 0.25s ease;
	box-shadow:
		0 10px 25px rgba(22,101,52,0.22),
		0 2px 10px rgba(22,101,52,0.12);
}

.primary-btn::before {
	content: '';
	position: absolute;
	inset: 0;
	background:
		linear-gradient(
			120deg,
			transparent,
			rgba(255,255,255,0.22),
			transparent
		);
	transform: translateX(-100%);
	transition: transform 0.8s ease;
}

.primary-btn:hover::before {
	transform: translateX(100%);
}

.primary-btn:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow:
		0 16px 34px rgba(22,101,52,0.3),
		0 6px 18px rgba(22,101,52,0.16);
}

.primary-btn:disabled {
	opacity: 0.75;
	cursor: not-allowed;
}

/* divider */
.divider {
	display: flex;
	align-items: center;
	gap: 14px;
	margin: 4px 0;
}

.divider span {
	flex: 1;
	height: 1px;
	background: rgba(15,23,42,0.08);
}

.divider p {
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.1em;
	text-transform: uppercase;
	color: #94a3b8;
	white-space: nowrap;
}

/* social buttons */
.social-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
}

.social-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	height: 48px;
	padding: 0 14px;
	border-radius: 999px;
	border: 1px solid rgba(15, 23, 42, 0.12);
	background: rgba(255, 255, 255, 0.9);
	color: #3c4043;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
	box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
	white-space: nowrap;
	overflow: hidden;
}

.social-btn:hover:not(:disabled) {
	background: #f8fafc;
	box-shadow: 0 3px 10px rgba(15, 23, 42, 0.12);
	transform: translateY(-1px);
}

.social-btn:disabled {
	opacity: 0.65;
	cursor: not-allowed;
}

/* footer */
.footer-copy {
	margin-top: 18px;
	text-align: center;
}

.footer-copy a {
	color: var(--green);
	font-weight: 700;
	text-decoration: none;
	position: relative;
}

.footer-copy a::after {
	content: '';
	position: absolute;
	left: 0;
	bottom: -2px;
	width: 100%;
	height: 2px;
	background: currentColor;
	transform: scaleX(0);
	transform-origin: right;
	transition: transform 0.3s ease;
}

.footer-copy a:hover::after {
	transform: scaleX(1);
	transform-origin: left;
}

/* responsive */
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
	.feature-grid {
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
/* location section */
.location-section {
	padding: 18px;
	background: rgba(22, 101, 52, 0.04);
	border: 1px solid rgba(22, 101, 52, 0.1);
	border-radius: 20px;
}

.location-label {
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: var(--green);
	margin-bottom: 14px;
	display: flex;
	align-items: center;
	gap: 6px;
}

.location-label::before {
	content: '📍';
	font-size: 14px;
}

.location-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 12px;
}

.field-select {
	width: 100%;
	height: 52px;
	padding: 0 14px;
	border-radius: 16px;
	border: 1px solid rgba(15, 23, 42, 0.08);
	background: rgba(255, 255, 255, 0.85);
	font-size: 14px;
	color: #0f172a;
	outline: none;
	cursor: pointer;
	transition: all 0.25s ease;
	appearance: none;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: right 12px center;
	padding-right: 36px;
}

.field-select:hover:not(:disabled) {
	border-color: rgba(22, 101, 52, 0.22);
}

.field-select:focus {
	background-color: white;
	border-color: rgba(22, 101, 52, 0.5);
	box-shadow: 0 0 0 4px rgba(22, 101, 52, 0.08);
}

.field-select:disabled {
	opacity: 0.45;
	cursor: not-allowed;
	background-color: rgba(241, 245, 249, 0.7);
}

@media (max-width: 720px) {
	.location-grid {
		grid-template-columns: 1fr;
	}
}
</style>