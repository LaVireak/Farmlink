<template>
	<div class="recover-page">
		<!-- background blobs -->
		<div class="bg-blob blob-1"></div>
		<div class="bg-blob blob-2"></div>

		<div class="recover-card">
			<!-- left side -->
			<div class="hero-side">
				<img
					src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80"
					alt="Farm fresh"
					class="hero-image"
				>

				<div class="hero-overlay">
					<span class="hero-badge">
						FarmLink Security
					</span>

					<h2>
						Recover your
						account securely.
					</h2>

					<p>
						We’ll send a secure verification code
						to your email to reset your password.
					</p>
				</div>
			</div>

			<!-- form side -->
			<div class="form-side">
				<div class="form-badge">
					Password Recovery
				</div>

				<h1>Forgot Password?</h1>

				<p class="form-intro">
					Enter your email address and
					we’ll send you a verification code.
				</p>

				<form
					class="recover-form"
					@submit.prevent="handleSubmit"
				>
					<div class="field">
						<label for="email">
							Email Address
						</label>

						<input
							id="email"
							type="email"
							v-model="email"
							placeholder="hello@garden.com"
							required
						>
					</div>

					<p
						v-if="error"
						class="error-message"
					>
						{{ error }}
					</p>

					<button
						type="submit"
						:disabled="loading"
						class="submit-btn"
					>
						<span v-if="loading">
							Sending...
						</span>

						<span v-else>
							Send Verification Code →
						</span>
					</button>
				</form>

				<button
					class="back-btn"
					@click="goBack"
				>
					← Back to Sign In
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { isValidEmail } from '../../utils/validation'

const email = ref('')
const loading = ref(false)
const error = ref('')

const router = useRouter()

const { requestPasswordResetOtp } = useAuth()

const handleSubmit = async () => {
	if (!email.value) return

	if (!isValidEmail(email.value)) {
		error.value = 'Please enter a valid email address.'
		return
	}

	loading.value = true
	error.value = ''

	try {
		await requestPasswordResetOtp(email.value)

		await router.push(
			`/auth/verify-code?email=${encodeURIComponent(email.value)}&mode=reset`
		)
	} catch (err: unknown) {
		error.value =
			err instanceof Error
				? err.message
				: 'Something went wrong.'
	} finally {
		loading.value = false
	}
}

const goBack = () => {
	router.push('/auth/signin')
}
</script>

<style scoped>
.recover-page {
	position: fixed;
	inset: 0;

	display: flex;
	align-items: center;
	justify-content: center;

	padding: 20px;
	overflow: hidden;

	background:
		linear-gradient(
			135deg,
			#f4f7f2,
			#edf3ea
		);
}

/* background blobs */
.bg-blob {
	position: absolute;
	border-radius: 999px;
	filter: blur(90px);
	z-index: 0;
}

.blob-1 {
	width: 260px;
	height: 260px;
	top: -80px;
	left: -80px;
	background: rgba(34, 197, 94, 0.18);
}

.blob-2 {
	width: 260px;
	height: 260px;
	bottom: -80px;
	right: -80px;
	background: rgba(16, 185, 129, 0.14);
}

.recover-card {
	position: relative;
	z-index: 2;

	width: 100%;
	max-width: 880px;

	display: grid;
	grid-template-columns: 1fr 1fr;

	background: rgba(255,255,255,0.78);

	backdrop-filter: blur(18px);
	-webkit-backdrop-filter: blur(18px);

	border: 1px solid rgba(255,255,255,0.4);

	border-radius: 26px;

	overflow: hidden;

	box-shadow:
		0 12px 40px rgba(15,23,42,0.06);
}

/* LEFT SIDE */
.hero-side {
	position: relative;
	min-height: 500px;
}

.hero-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.hero-overlay {
	position: absolute;
	inset: 0;

	padding: 34px;

	display: flex;
	flex-direction: column;
	justify-content: flex-end;

	background:
		linear-gradient(
			180deg,
			rgba(0,0,0,0.08),
			rgba(0,0,0,0.72)
		);

	color: white;
}

.hero-badge {
	display: inline-flex;
	width: fit-content;

	padding: 8px 14px;

	border-radius: 999px;

	background: rgba(255,255,255,0.12);

	border: 1px solid rgba(255,255,255,0.16);

	font-size: 11px;
	font-weight: 700;

	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.hero-overlay h2 {
	margin: 18px 0 12px;

	font-size: 40px;
	line-height: 0.96;
	letter-spacing: -0.04em;

	max-width: 9ch;
}

.hero-overlay p {
	max-width: 32ch;

	font-size: 14px;
	line-height: 1.7;

	color: rgba(255,255,255,0.82);
}

/* FORM SIDE */
.form-side {
	padding: 34px;

	display: flex;
	flex-direction: column;
	justify-content: center;
}

.form-badge {
	display: inline-flex;
	width: fit-content;

	padding: 8px 14px;

	border-radius: 999px;

	background: rgba(22,101,52,0.1);

	color: #166534;

	font-size: 11px;
	font-weight: 700;

	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.form-side h1 {
	margin: 18px 0 10px;

	font-size: 42px;
	line-height: 0.96;
	letter-spacing: -0.04em;

	color: #0f172a;
}

.form-intro {
	margin-bottom: 28px;

	font-size: 14px;
	line-height: 1.7;

	color: #64748b;
}

.recover-form {
	display: grid;
	gap: 18px;
}

.field {
	display: grid;
	gap: 8px;
}

.field label {
	font-size: 11px;
	font-weight: 700;

	letter-spacing: 0.12em;
	text-transform: uppercase;

	color: #475569;
}

.field input {
	width: 100%;
	height: 48px;

	padding: 0 16px;

	border-radius: 14px;

	border: 1px solid rgba(15,23,42,0.08);

	background: rgba(255,255,255,0.82);

	outline: none;

	transition: all 0.2s ease;
}

.field input:focus {
	border-color: rgba(22,101,52,0.35);

	box-shadow:
		0 0 0 4px rgba(22,101,52,0.08);
}

.submit-btn {
	height: 48px;

	border: none;
	border-radius: 14px;

	background:
		linear-gradient(
			135deg,
			#22c55e,
			#166534
		);

	color: white;

	font-size: 14px;
	font-weight: 700;

	letter-spacing: 0.04em;

	cursor: pointer;

	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease;

	box-shadow:
		0 10px 24px rgba(22,101,52,0.18);
}

.submit-btn:hover:not(:disabled) {
	transform: translateY(-1px);
}

.submit-btn:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}

.error-message {
	padding: 12px 14px;

	border-radius: 14px;

	background: rgba(254,242,242,0.92);

	border: 1px solid rgba(180,35,24,0.1);

	color: #b42318;

	font-size: 14px;
}

.back-btn {
	margin-top: 18px;

	background: transparent;
	border: none;

	width: fit-content;

	padding: 0;

	font-size: 14px;
	font-weight: 600;

	color: #166534;

	cursor: pointer;
}

.back-btn:hover {
	text-decoration: underline;
}

/* MOBILE */
@media (max-width: 900px) {
	.recover-page {
		position: relative;
		min-height: 100vh;
		padding: 14px;
	}

	.recover-card {
		grid-template-columns: 1fr;
		max-width: 460px;
	}

	.hero-side {
		display: none;
	}

	.form-side {
		padding: 24px;
	}

	.form-side h1 {
		font-size: 34px;
	}
}
</style>