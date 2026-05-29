<template>
  <div class="auth-page">
    <div class="auth-shell">

      <!-- LEFT HERO -->
      <section class="hero-panel">
        <div class="hero-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80"
            alt="Farm fresh vegetables"
            class="hero-image"
          />

          <div class="hero-overlay">
            <span class="eyebrow">
              FarmLink Marketplace
            </span>

            <h2>
              Welcome back to your
              fresh marketplace.
            </h2>

            <p>
              Continue exploring trusted local farms,
              fresh vegetables, and seamless ordering.
            </p>
          </div>
        </div>

        <div class="feature-grid">
          <div class="feature-card">
            <span class="feature-label">
              Secure Login
            </span>

            <strong>
              Protected Access
            </strong>

            <p>
              Your account is protected with
              secure authentication and encrypted sessions.
            </p>
          </div>

          <div class="feature-card">
            <span class="feature-label">
              Fast Experience
            </span>

            <strong>
              Easy Ordering
            </strong>

            <p>
              Access your saved carts,
              favorites, and orders instantly.
            </p>
          </div>
        </div>
      </section>

      <!-- RIGHT FORM -->
      <section class="form-panel">

        <div class="form-badge">
          Login Account
        </div>

        <h1>Welcome Back</h1>

        <p class="form-intro">
          Sign in to continue your modern
          farm-to-table shopping experience.
        </p>

        <form
          class="auth-form"
          @submit.prevent="onSubmit"
        >

          <!-- EMAIL -->
          <div class="field">
            <label>Email address</label>

            <input
              v-model.trim="form.email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <!-- PASSWORD -->
          <div class="field">
            <label>Password</label>

            <div class="input-wrap">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                required
              />
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

            <div class="forgot-row">
              <NuxtLink to="/auth/forgot-password" class="forgot-link">
                Forgot password?
              </NuxtLink>
            </div>
          </div>

          <!-- REMEMBER -->
          <label class="policy-check">
            <input type="checkbox" />
            <span>Remember me</span>
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
            type="submit"
            :disabled="submitting"
            class="primary-btn"
          >
            {{ submitting ? 'Signing in...' : 'Sign In' }}
          </button>

          <!-- DIVIDER -->
          <div class="divider">
            <span></span>
            <p>or continue with</p>
            <span></span>
          </div>

          <!-- SOCIAL BUTTONS -->
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
              {{ googleSubmitting ? '…' : 'Google' }}
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
          <p v-if="facebookError" class="feedback feedback-error">{{ facebookError }}</p>
        </form>

        <!-- FOOTER -->
        <p class="footer-copy">
          Don't have an account?

          <NuxtLink to="/auth/signup">
            Create account
          </NuxtLink>
        </p>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store'
import { isValidEmail } from '../../utils/validation'

const showPassword = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const submitting = ref(false)
const errorMessage = ref('')

const googleSubmitting = ref(false)
const googleError = ref('')

const facebookSubmitting = ref(false)
const facebookError = ref('')

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

const form = reactive({
  email: '',
  password: '',
})

const onSubmit = async () => {
  errorMessage.value = ''

  if (!form.email || !form.password) {
    errorMessage.value = 'Email and password are required.'
    return
  }

  if (!isValidEmail(form.email)) {
    errorMessage.value = 'Please enter a valid email address.'
    return
  }

  submitting.value = true

  try {
    // signIn() in the store already:
    // 1. calls authService.signin()
    // 2. calls applySession() → sets user from Supabase
    // 3. calls authService.fetchProfile() → overwrites role from your PostgreSQL DB
    await authStore.signIn({
      email: form.email,
      password: form.password,
    })

    // ✅ Read role AFTER signIn() fully resolves
    // At this point authStore.user.role is the real DB role
    const role = authStore.user?.role

    console.log('[SignIn] Role after full signIn:', role) // Remove after debugging

    if (authStore.lastSyncError) {
      // fetchProfile failed — role may be wrong, warn but still try to redirect
      console.warn('[SignIn] Role sync warning:', authStore.lastSyncError)
    }

    // ✅ Use role directly from store, not from getPostSignInRoute via useAuth
    const route = authStore.getPostSignInRoute(role ?? 'consumer')

    console.log('[SignIn] Redirecting to:', route) // Remove after debugging

    await router.push(route)

  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Unable to sign in.'
  } finally {
    submitting.value = false
  }
}

// ---- Google ----

const handleGoogleCredential = async (credential?: string) => {
  if (!credential) {
    googleError.value = 'Google sign-in failed.'
    return
  }

  googleSubmitting.value = true
  googleError.value = ''

  try {
    await authStore.signInWithGoogle(credential)

    const role = authStore.user?.role
    await router.push(authStore.getPostSignInRoute(role ?? 'consumer'))
  } catch (error) {
    googleError.value =
      error instanceof Error
        ? error.message
        : 'Unable to sign in with Google.'
  } finally {
    googleSubmitting.value = false
  }
}

const googleReady = ref(false)

const initializeGoogle = () => {
  const google = (window as any).google

  if (!google?.accounts?.id) return false

  google.accounts.id.initialize({
    client_id: googleClientId,
    callback: (response: { credential?: string }) =>
      handleGoogleCredential(response.credential),
  })

  googleReady.value = true
  return true
}

const handleGoogleClick = () => {
  const google = (window as any).google
  if (!google?.accounts?.id) {
    googleError.value = 'Google sign-in is not ready yet.'
    return
  }
  google.accounts.id.prompt()
}

// ---- Facebook ----

const handleFacebook = async () => {
  facebookSubmitting.value = true
  facebookError.value = ''

  try {
    await authStore.signInWithFacebook()
    // Browser redirects here — nothing after this runs
  } catch (error) {
    facebookError.value =
      error instanceof Error
        ? error.message
        : 'Unable to sign in with Facebook.'
    facebookSubmitting.value = false
  }
}

// ---- Mount ----

onMounted(() => {
  if (!googleClientId) {
    googleError.value = 'Google sign-in is not configured.'
    return
  }

  let attempts = 0

  const tryInit = () => {
    attempts++
    if (initializeGoogle()) return
    if (attempts >= 20) {
      googleError.value = 'Google sign-in failed to load.'
      return
    }
    setTimeout(tryInit, 300)
  }

  tryInit()
})
</script>

<style scoped>
.auth-page {
	position: fixed;
	inset: 0;

	display: flex;
	align-items: center;
	justify-content: center;

	padding: 20px;
	overflow: hidden;

	background:
		radial-gradient(
			circle at top left,
			rgba(22, 101, 52, 0.12),
			transparent 28%
		),
		radial-gradient(
			circle at bottom right,
			rgba(16, 185, 129, 0.1),
			transparent 30%
		),
		linear-gradient(
			135deg,
			#f4f7f2,
			#edf3ea
		);
}

.auth-shell {
	width: min(1180px, 100%);
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24px;
}

.hero-panel,
.form-panel {
	background: rgba(255,255,255,0.82);

	backdrop-filter: blur(16px);
	-webkit-backdrop-filter: blur(16px);

	border: 1px solid rgba(255,255,255,0.4);

	border-radius: 24px;

	box-shadow:
		0 8px 30px rgba(15,23,42,0.05);
}

.hero-panel {
	padding: 18px;
	display: flex;
	flex-direction: column;
	gap: 18px;
}

.hero-image-wrap {
	position: relative;
	min-height: 320px;
	border-radius: 24px;
	overflow: hidden;
}

.hero-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.7s ease;
}

.hero-panel:hover .hero-image {
	transform: scale(1.05);
}

.hero-overlay {
	position: absolute;
	inset: 0;
	padding: 28px;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;

	background:
		linear-gradient(
			180deg,
			rgba(0,0,0,0.1),
			rgba(0,0,0,0.7)
		);

	color: white;
}

.eyebrow,
.form-badge {
	display: inline-flex;
	width: fit-content;
	padding: 8px 14px;
	border-radius: 999px;
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.eyebrow {
	background: rgba(255,255,255,0.12);
	border: 1px solid rgba(255,255,255,0.2);
}

.hero-overlay h2 {
	margin: 16px 0 10px;
	font-size: clamp(32px, 4vw, 50px);
	line-height: 0.95;
	letter-spacing: -0.04em;
	max-width: 10ch;
}

.hero-overlay p {
	max-width: 36ch;
	line-height: 1.7;
	color: rgba(255,255,255,0.82);
}

.feature-grid {
	display: grid;
	grid-template-columns: repeat(2,1fr);
	gap: 14px;
}

.feature-card {
	padding: 20px;
	border-radius: 22px;
	background: rgba(255,255,255,0.7);
	border: 1px solid rgba(255,255,255,0.4);
}

.feature-label {
	display: block;
	margin-bottom: 10px;
	font-size: 11px;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: #64748b;
}

.feature-card strong {
	display: block;
	margin-bottom: 6px;
	font-size: 18px;
	color: #0f172a;
}

.feature-card p {
	font-size: 14px;
	line-height: 1.6;
	color: #64748b;
}

.form-panel {
	padding: 28px;
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.form-badge {
	background: rgba(22,101,52,0.1);
	color: #166534;
}

.form-panel h1 {
	margin: 18px 0 12px;
	font-size: clamp(34px, 4vw, 52px);
	line-height: 0.95;
	letter-spacing: -0.05em;
	color: #0f172a;
}

.form-intro {
	margin-bottom: 28px;
	color: #64748b;
	line-height: 1.7;
}

.auth-form {
	display: grid;
	gap: 18px;
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
	height: 52px;
	padding: 0 16px;
	border-radius: 16px;
	border: 1px solid rgba(15,23,42,0.08);
	background: rgba(255,255,255,0.8);
	outline: none;
	transition: all 0.2s ease;
}

.field input:focus {
	border-color: rgba(22,101,52,0.4);
	box-shadow: 0 0 0 4px rgba(22,101,52,0.08);
}

.input-wrap {
	position: relative;
	display: flex;
	align-items: center;
}

.input-wrap input {
	width: 100%;
	height: 52px;
	padding: 0 50px 0 16px;
	border-radius: 16px;
	border: 1px solid rgba(15,23,42,0.08);
	background: rgba(255,255,255,0.8);
	outline: none;
	transition: all 0.2s ease;
}

.input-wrap input:focus {
	border-color: rgba(22,101,52,0.4);
	box-shadow: 0 0 0 4px rgba(22,101,52,0.08);
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

.forgot-row {
	display: flex;
	justify-content: flex-end;
	margin-top: 2px;
}

.policy-check {
	display: flex;
	align-items: center;
	gap: 10px;
	font-size: 14px;
	color: #475569;
}

.policy-check input {
	accent-color: #166534;
}

.feedback {
	padding: 12px 14px;
	border-radius: 14px;
	background: rgba(255,255,255,0.8);
	font-size: 14px;
}

.feedback-error {
	background: rgba(254,242,242,0.9);
	color: #b42318;
	border: 1px solid rgba(180,35,24,0.1);
}

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

.divider {
	display: flex;
	align-items: center;
	gap: 14px;
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

.footer-copy {
	margin-top: 18px;
	text-align: center;
	font-size: 14px;
	color: #64748b;
}

.footer-copy a,
.forgot-link {
	color: #166534;
	font-weight: 700;
	text-decoration: none;
}

.footer-copy a:hover,
.forgot-link:hover {
	text-decoration: underline;
}

@media (max-width: 1024px) {
	.auth-shell {
		grid-template-columns: 1fr;
	}
}

@media (max-width: 720px) {
	.auth-page {
		padding: 14px;
	}

	.hero-panel,
	.form-panel {
		padding: 18px;
		border-radius: 24px;
	}

	.feature-grid {
		grid-template-columns: 1fr;
	}

	.hero-image-wrap {
		min-height: 320px;
	}
}
</style>