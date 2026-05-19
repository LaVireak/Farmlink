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
            <div class="password-row">
              <label>Password</label>

              <NuxtLink
                to="/auth/forgot-password"
                class="forgot-link"
              >
                Forgot password?
              </NuxtLink>
            </div>

            <input
              v-model="form.password"
              type="password"
              placeholder="Enter your password"
              required
            />
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
            {{
              submitting
                ? 'Signing in...'
                : 'Sign In'
            }}
          </button>

          <!-- DIVIDER -->
          <div class="divider">
            <span></span>
            <p>or continue with</p>
            <span></span>
          </div>

          <!-- GOOGLE -->
          <div class="social-stack">
            <div
              ref="googleButton"
              class="google-slot"
            ></div>

            <p
              v-if="googleSubmitting"
              class="feedback"
            >
              Signing in with Google...
            </p>

            <p
              v-if="googleError"
              class="feedback feedback-error"
            >
              {{ googleError }}
            </p>
          </div>
        </form>

        <!-- FOOTER -->
        <p class="footer-copy">
          Don’t have an account?

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
import { useAuth } from '../../composables/useAuth'

const router = useRouter()

const {
  signIn,
  signInWithGoogle,
  getPostSignInRoute,
} = useAuth()

const submitting = ref(false)
const errorMessage = ref('')

const googleSubmitting = ref(false)
const googleError = ref('')

const googleButton = ref<HTMLDivElement | null>(null)

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID

const form = reactive({
  email: '',
  password: '',
})

const onSubmit = async () => {
  errorMessage.value = ''

  if (!form.email || !form.password) {
    errorMessage.value =
      'Email and password are required.'
    return
  }

  submitting.value = true

  try {
    const result = await signIn({
      email: form.email,
      password: form.password,
    })

    await router.push(
      getPostSignInRoute(result.user.role)
    )
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Unable to sign in.'
  } finally {
    submitting.value = false
  }
}

const handleGoogleCredential = async (
  credential?: string
) => {
  if (!credential) {
    googleError.value =
      'Google sign-in failed.'
    return
  }

  googleSubmitting.value = true
  googleError.value = ''

  try {
    const result = await signInWithGoogle(
      credential
    )

    await router.push(
      getPostSignInRoute(result.user.role)
    )
  } catch (error) {
    googleError.value =
      error instanceof Error
        ? error.message
        : 'Unable to sign in with Google.'
  } finally {
    googleSubmitting.value = false
  }
}

const initializeGoogle = () => {
  if (!googleButton.value) return false

  const google = (window as any).google

  if (!google?.accounts?.id) {
    return false
  }

  google.accounts.id.initialize({
    client_id: googleClientId,
    callback: (response: {
      credential?: string
    }) =>
      handleGoogleCredential(
        response.credential
      ),
  })

  googleButton.value.innerHTML = ''

  google.accounts.id.renderButton(
    googleButton.value,
    {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      width: 320,
      text: 'signin_with',
    }
  )

  return true
}

onMounted(() => {
  if (!googleClientId) {
    googleError.value =
      'Google sign-in is not configured.'
    return
  }

  let attempts = 0

  const tryInit = () => {
    attempts++

    if (initializeGoogle()) {
      return
    }

    if (attempts >= 20) {
      googleError.value =
        'Google sign-in failed to load.'
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

.password-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
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
	box-shadow:
		0 0 0 4px rgba(22,101,52,0.08);
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

.social-stack {
	display: grid;
	gap: 10px;
}

.google-slot {
	display: flex;
	justify-content: center;
	min-height: 44px;
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