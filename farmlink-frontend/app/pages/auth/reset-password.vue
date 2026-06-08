<template>
  <div class="auth-page">
    <div v-if="!showSuccess" class="auth-shell">
      <section class="visual-panel">
        <div class="visual-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=80"
            alt="Green seedlings"
            class="visual-image"
          >

          <div class="visual-overlay">
            <span class="eyebrow">Account recovery</span>
            <h2>Set a stronger password and secure your account.</h2>
            <p>Use a unique password you don’t use anywhere else. Keep it memorable, but difficult to guess.</p>
          </div>
        </div>

        <div class="tips-grid">
          <div class="tip-card">
            <strong>Keep it unique</strong>
            <p>A password manager can help you generate and store a strong password.</p>
          </div>
          <div class="tip-card">
            <strong>Protect access</strong>
            <p>After updating, you’ll be returned to sign in with the new password.</p>
          </div>
        </div>
      </section>

      <section class="form-panel">
        <div class="form-badge">Security update</div>
        <h1>Reset your password</h1>
        <p class="form-intro">Create a secure new password for your FarmLink account and marketplace data.</p>

        <form class="form-stack" @submit.prevent="submitReset">
          <div>
            <label for="newPassword">New password</label>
            <div class="input-wrap">
              <input
                id="newPassword"
                v-model="newPassword"
                :type="showNew ? 'text' : 'password'"
                placeholder="Enter a new password"
                autocomplete="new-password"
                required
              >
              <button type="button" class="eye" @click="showNew = !showNew">{{ showNew ? 'Hide' : 'Show' }}</button>
            </div>
          </div>

          <div>
            <label for="confirmPassword">Confirm password</label>
            <div class="input-wrap">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="Re-enter the new password"
                autocomplete="new-password"
                required
              >
              <button type="button" class="eye" @click="showConfirm = !showConfirm">{{ showConfirm ? 'Hide' : 'Show' }}</button>
            </div>
          </div>

          <div class="strength-card">
            <div class="strength-header">
              <p class="strength-title">Password strength</p>
              <span class="strength-note">Use all four checks for best protection</span>
            </div>

            <div class="strength-grid">
              <div class="rule" :class="{ ok: hasMinLength }">8+ characters</div>
              <div class="rule" :class="{ ok: hasUpper }">One uppercase letter</div>
              <div class="rule" :class="{ ok: hasNumber }">One number</div>
              <div class="rule" :class="{ ok: hasSpecial }">One special character</div>
            </div>
          </div>

          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

          <button type="submit" class="submit" :disabled="submitting">
            {{ submitting ? 'Updating password...' : 'Update password' }}
          </button>
        </form>

        <button type="button" class="back" @click="goBack">← Back to sign in</button>
      </section>
    </div>

    <div v-else class="success-wrap">
      <div class="success-card">
        <div class="icon-wrap" aria-hidden="true">
          <div class="icon-dot" />
          <div class="icon-main">✓</div>
        </div>

        <span class="eyebrow success-eyebrow">Password updated</span>
        <h1 class="success-title">Reset successful</h1>
        <p class="success-copy">
          Your account is secure again. Sign in with your new password to continue.
        </p>

        <button type="button" class="signin-btn" @click="goToSignIn">
          Sign in now
        </button>

        <div class="status-pill">● SECURITY VERIFIED</div>
      </div>

      <div class="hero-image">
        <img
          src="https://images.unsplash.com/photo-1463123081488-789f998ac9c4?auto=format&fit=crop&w=1400&q=80"
          alt="Green growth"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const { resetPassword } = useAuth();

const newPassword = ref('');
const confirmPassword = ref('');
const showNew = ref(false);
const showConfirm = ref(false);
const submitting = ref(false);
const errorMessage = ref('');
const showSuccess = ref(false);

const hasMinLength = computed(() => newPassword.value.length >= 8);
const hasUpper = computed(() => /[A-Z]/.test(newPassword.value));
const hasNumber = computed(() => /\d/.test(newPassword.value));
const hasSpecial = computed(() => /[^A-Za-z0-9]/.test(newPassword.value));
const isStrong = computed(() => hasMinLength.value && hasUpper.value && hasNumber.value && hasSpecial.value);
const redirectDelayMs = 2400;

let redirectTimer: ReturnType<typeof setTimeout> | null = null;

const submitReset = async () => {
  errorMessage.value = '';

  if (!isStrong.value) {
    errorMessage.value = 'Please create a stronger password.';
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }

  submitting.value = true;

  try {
    await resetPassword(newPassword.value);
    showSuccess.value = true;
    redirectTimer = setTimeout(() => {
      router.push('/auth/signin');
    }, redirectDelayMs);
  } catch {
    errorMessage.value = 'Unable to reset password right now. Please try again.';
  } finally {
    submitting.value = false;
  }
};

const goBack = () => {
  router.push('/auth/signin');
};

const goToSignIn = () => {
  router.push('/auth/signin');
};

onBeforeUnmount(() => {
  if (redirectTimer) {
    clearTimeout(redirectTimer);
    redirectTimer = null;
  }
});
</script>

<style scoped>
.auth-page {
	position: fixed;
	inset: 0;

	display: flex;
	align-items: center;
	justify-content: center;

	padding: 18px;
	overflow: hidden;

	background:
		radial-gradient(
			circle at top left,
			rgba(22, 101, 52, 0.10),
			transparent 30%
		),
		radial-gradient(
			circle at bottom right,
			rgba(16, 185, 129, 0.08),
			transparent 30%
		),
		linear-gradient(
			135deg,
			#f4f7f2,
			#edf3ea
		);
}

.auth-shell {
	width: 100%;
	max-width: 980px;

	display: grid;
	grid-template-columns: 1fr 0.92fr;

	gap: 18px;
	align-items: stretch;
}

.visual-panel,
.form-panel,
.success-card,
.hero-image {
	background: rgba(255, 255, 255, 0.82);

	backdrop-filter: blur(16px);
	-webkit-backdrop-filter: blur(16px);

	border: 1px solid rgba(255, 255, 255, 0.4);

	border-radius: 24px;

	box-shadow:
		0 8px 30px rgba(15, 23, 42, 0.05);
}

.visual-panel {
	padding: 16px;

	display: flex;
	flex-direction: column;
	gap: 16px;
}

.visual-image-wrap {
	position: relative;

	min-height: 280px;

	border-radius: 18px;
	overflow: hidden;
}

.visual-image {
	width: 100%;
	height: 100%;

	object-fit: cover;
	display: block;
}

.visual-overlay {
	position: absolute;
	inset: 0;

	padding: 24px;

	display: flex;
	flex-direction: column;
	justify-content: flex-end;

	background:
		linear-gradient(
			180deg,
			rgba(10, 30, 12, 0.06),
			rgba(10, 30, 12, 0.72)
		);

	color: white;
}

.eyebrow,
.form-badge,
.success-eyebrow {
	display: inline-flex;
	align-items: center;

	width: fit-content;

	padding: 7px 12px;

	border-radius: 999px;

	font-size: 11px;
	font-weight: 700;

	letter-spacing: 0.08em;
	text-transform: uppercase;
}

.eyebrow {
	background: rgba(255, 255, 255, 0.16);

	border: 1px solid rgba(255, 255, 255, 0.2);
}

.visual-overlay h2 {
	margin: 14px 0 8px;

	font-size: clamp(26px, 3vw, 38px);
	line-height: 1.02;

	max-width: 12ch;
}

.visual-overlay p {
	margin: 0;

	max-width: 36ch;

	font-size: 14px;
	line-height: 1.6;

	opacity: 0.9;
}

.tips-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));

	gap: 12px;
}

.tip-card {
	padding: 16px;

	border-radius: 18px;

	background:
		linear-gradient(
			180deg,
			rgba(241, 246, 236, 0.96),
			rgba(250, 252, 248, 0.94)
		);

	border: 1px solid rgba(16, 39, 12, 0.05);
}

.tip-card strong {
	display: block;

	margin-bottom: 6px;

	font-size: 16px;

	color: #103a17;
}

.tip-card p,
.form-intro,
.success-copy,
.error,
.strength-note,
.back {
	margin: 0;

	color: #667065;

	line-height: 1.55;
}

.tip-card p {
	font-size: 13px;
}

.form-panel {
	padding: 26px;

	display: flex;
	flex-direction: column;
	justify-content: center;
}

.form-badge {
	background: rgba(17, 108, 38, 0.08);

	color: #115c2b;
}

.form-panel h1 {
	margin: 14px 0 10px;

	font-size: clamp(34px, 4vw, 42px);
	line-height: 1.02;

	color: #103a17;
}

.form-intro {
	margin: 0 0 20px;

	font-size: 14px;
}

.form-stack {
	display: grid;
	gap: 12px;
}

.form-stack label {
	display: block;

	margin-bottom: 8px;

	font-size: 11px;
	font-weight: 700;

	letter-spacing: 0.08em;
	text-transform: uppercase;

	color: #6b7763;
}

.input-wrap {
	display: flex;
	align-items: center;
	gap: 10px;

	min-height: 48px;

	padding: 0 10px 0 14px;

	border-radius: 14px;

	border: 1px solid rgba(15, 63, 21, 0.1);

	background: rgba(245, 247, 242, 0.9);

	transition:
		border-color 0.2s ease,
		box-shadow 0.2s ease,
		background 0.2s ease;
}

.input-wrap:focus-within {
	border-color: rgba(16, 90, 33, 0.35);

	box-shadow:
		0 0 0 4px rgba(17, 108, 38, 0.08);

	background: white;
}

.input-wrap input {
	flex: 1;

	min-width: 0;
	height: 44px;

	border: none;
	background: transparent;

	color: #102b13;

	outline: none;

	font-size: 14px;
}

.input-wrap input::placeholder {
	color: rgba(16, 43, 19, 0.38);
}

.eye {
	border: none;

	background: rgba(17, 108, 38, 0.08);

	color: #115c2b;

	border-radius: 999px;

	padding: 7px 11px;

	font-size: 11px;
	font-weight: 700;

	cursor: pointer;
}

.strength-card {
	padding: 16px;

	border-radius: 18px;

	background:
		linear-gradient(
			180deg,
			rgba(241, 246, 236, 0.92),
			rgba(251, 252, 249, 0.96)
		);

	border: 1px solid rgba(15, 63, 21, 0.06);
}

.strength-header {
	display: flex;
	flex-direction: column;
	gap: 4px;

	margin-bottom: 12px;
}

.strength-title {
	margin: 0;

	color: #103a17;

	font-size: 12px;
	font-weight: 800;

	letter-spacing: 0.08em;
	text-transform: uppercase;
}

.strength-note {
	font-size: 12px;
}

.strength-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));

	gap: 10px;
}

.rule {
	padding: 10px 12px;

	border-radius: 12px;

	background: rgba(255, 255, 255, 0.82);

	border: 1px solid rgba(15, 63, 21, 0.06);

	color: #6a7366;

	font-size: 12px;
	font-weight: 600;
}

.rule.ok {
	background: rgba(225, 240, 225, 0.95);

	border-color: rgba(22, 101, 52, 0.12);

	color: #14532d;
}

.error {
	padding: 12px 14px;

	border-radius: 14px;

	background: rgba(254, 242, 242, 0.95);

	border: 1px solid rgba(180, 35, 24, 0.12);

	color: #b42318;

	font-size: 14px;
}

.submit {
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
.submit::before {
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

.submit::hover::before {
	transform: translateX(100%);
}
.submit:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow:
		0 16px 34px rgba(22,101,52,0.3),
		0 6px 18px rgba(22,101,52,0.16);
}

.submit:disabled {
	opacity: 0.75;
	cursor: not-allowed;
}

.back {
	margin-top: 14px;

	border: none;
	background: transparent;

	color: #115c2b;

	font-size: 13px;
	font-weight: 700;

	cursor: pointer;

	text-align: left;
	padding: 0;
}

.success-wrap {
	width: 100%;
	max-width: 980px;

	display: grid;
	grid-template-columns: 0.9fr 1fr;

	gap: 18px;
	align-items: stretch;
}

.success-card {
	padding: 28px;

	display: flex;
	flex-direction: column;
	justify-content: center;

	gap: 12px;
}

.icon-wrap {
	position: relative;

	width: 76px;
	height: 76px;

	margin-bottom: 8px;
}

.icon-dot {
	position: absolute;
	inset: 0;

	border-radius: 50%;

	background: rgba(22, 101, 52, 0.12);
}

.icon-main {
	position: absolute;
	inset: 10px;

	border-radius: 50%;

	background:
		linear-gradient(
			135deg,
			#166534,
			#0f4f29
		);

	color: white;

	display: flex;
	align-items: center;
	justify-content: center;

	font-size: 24px;
	font-weight: 800;

	box-shadow:
		0 14px 24px rgba(18, 79, 40, 0.18);
}

.success-eyebrow {
	background: rgba(17, 108, 38, 0.08);

	color: #115c2b;
}

.success-title {
	margin: 0;

	font-size: clamp(36px, 4vw, 44px);
	line-height: 1.02;

	color: #103a17;
}

.success-copy {
	max-width: 32ch;

	font-size: 15px;
}

.signin-btn {
	height: 48px;

	width: fit-content;

	padding: 0 18px;

	border: none;
	border-radius: 14px;

	background:
		linear-gradient(
			135deg,
			#166534,
			#0f4f29
		);

	color: white;

	font-size: 14px;
	font-weight: 700;

	cursor: pointer;

	box-shadow:
		0 14px 24px rgba(18, 79, 40, 0.18);
}

.status-pill {
	width: fit-content;

	padding: 8px 12px;

	border-radius: 999px;

	background: rgba(17, 108, 38, 0.08);

	color: #115c2b;

	font-size: 11px;
	font-weight: 800;

	letter-spacing: 0.08em;
}

.hero-image {
	min-height: 320px;

	overflow: hidden;
}

.hero-image img {
	width: 100%;
	height: 100%;

	object-fit: cover;
	display: block;
}

@media (max-width: 900px) {
	.auth-page {
		position: relative;

		min-height: 100vh;

		padding: 14px;

		overflow-y: auto;
	}

	.auth-shell,
	.success-wrap {
		grid-template-columns: 1fr;

		max-width: 460px;
	}

	.visual-panel,
	.hero-image {
		display: none;
	}

	.form-panel,
	.success-card {
		padding: 22px;

		border-radius: 20px;
	}

	.form-panel h1,
	.success-title {
		font-size: 32px;
	}

	.strength-grid,
	.tips-grid {
		grid-template-columns: 1fr;
	}
}
</style>