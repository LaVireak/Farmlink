<template>
  <div class="reset-page">
    <div v-if="!showSuccess" class="reset-shell">
      <div class="media-panel">
        <img
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=80"
          alt="Green seedlings"
          class="media-cover"
        >

        <div class="security-note">
          <p class="note-title">Secure Access</p>
          <p class="note-copy">
            Protecting your farm's digital footprint with modern encryption and sustainable security practices.
          </p>
        </div>
      </div>

      <div class="form-panel">
        <div class="badge">SECURITY UPDATE</div>
        <h1>Reset Password</h1>
        <p class="intro">
          Create a strong, unique password to secure your Farm Link account and marketplace data.
        </p>

        <form @submit.prevent="submitReset" class="form-stack">
          <div>
            <label for="newPassword">NEW PASSWORD</label>
            <div class="input-wrap">
              <input
                id="newPassword"
                v-model="newPassword"
                :type="showNew ? 'text' : 'password'"
                placeholder="Enter new password"
                required
              >
              <button type="button" class="eye" @click="showNew = !showNew">{{ showNew ? 'Hide' : 'Show' }}</button>
            </div>
          </div>

          <div>
            <label for="confirmPassword">CONFIRM NEW PASSWORD</label>
            <div class="input-wrap">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="Confirm new password"
                required
              >
              <button type="button" class="eye" @click="showConfirm = !showConfirm">{{ showConfirm ? 'Hide' : 'Show' }}</button>
            </div>
          </div>

          <div class="strength-card">
            <p class="strength-title">PASSWORD STRENGTH</p>
            <div class="strength-grid">
              <div class="rule" :class="{ ok: hasMinLength }">● 8+ characters</div>
              <div class="rule" :class="{ ok: hasUpper }">● One uppercase letter</div>
              <div class="rule" :class="{ ok: hasNumber }">● One number</div>
              <div class="rule" :class="{ ok: hasSpecial }">● One special character</div>
            </div>
          </div>

          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

          <button type="submit" class="submit" :disabled="submitting">
            {{ submitting ? 'Updating...' : 'Reset Password' }}
          </button>
        </form>

        <button type="button" class="back" @click="goBack">← Back to Login</button>
      </div>
    </div>

    <div v-else class="success-wrap">
      <div class="icon-wrap">
        <div class="icon-dot" />
        <div class="icon-main">✓</div>
      </div>

      <h1 class="success-title">Password Reset<br>Successful</h1>
      <p class="success-copy">
        Your account is now secure. You can sign in with your
        new password to continue your farming journey.
      </p>

      <button type="button" class="signin-btn" @click="goToSignIn">
        Sign In
      </button>

      <div class="status-pill">● SECURITY VERIFIED</div>

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
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

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
    // TODO: call backend reset endpoint with verification token/code.
    await new Promise((resolve) => setTimeout(resolve, 700));
    showSuccess.value = true;
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
</script>

<style scoped>
.reset-page {
  min-height: 100vh;
  padding: 24px;
  background: #f7f8f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reset-shell {
  width: min(1200px, 100%);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;
}

.media-panel {
  position: relative;
}

.media-cover {
  width: 100%;
  border-radius: 24px;
  height: 600px;
  object-fit: cover;
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.12);
}

.security-note {
  position: absolute;
  right: 24px;
  bottom: -18px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.1);
  width: 320px;
  padding: 18px;
}

.note-title {
  margin: 0;
  color: #0f3f15;
  font-size: 29px;
  font-weight: 700;
}

.note-copy {
  margin: 8px 0 0;
  color: #566252;
  font-size: 16px;
  line-height: 1.45;
}

.form-panel {
  max-width: 560px;
}

.badge {
  display: inline-flex;
  align-items: center;
  background: #ddd3b3;
  color: #5a5e4a;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 6px 12px;
  border-radius: 999px;
}

.form-panel h1 {
  margin: 16px 0 8px;
  font-size: 72px;
  line-height: 0.95;
  color: #0f3f15;
}

.intro {
  margin: 0 0 20px;
  color: #62695f;
  font-size: 22px;
  line-height: 1.35;
}

.form-stack {
  display: grid;
  gap: 14px;
}

label {
  font-size: 11px;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: #5a6257;
}

.input-wrap {
  margin-top: 8px;
  position: relative;
}

input {
  width: 100%;
  height: 58px;
  border: none;
  border-radius: 14px;
  background: #eceee9;
  padding: 0 70px 0 16px;
  font-size: 20px;
  color: #214124;
}

input:focus {
  outline: 2px solid #2d5b30;
}

.eye {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #436345;
  font-size: 13px;
  cursor: pointer;
}

.strength-card {
  margin-top: 6px;
  background: #eceee9;
  border-radius: 16px;
  padding: 14px;
}

.strength-title {
  margin: 0 0 10px;
  color: #596154;
  font-size: 11px;
  letter-spacing: 0.06em;
  font-weight: 700;
}

.strength-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.rule {
  color: #7f857a;
  font-size: 14px;
}

.rule.ok {
  color: #1f4d1f;
  font-weight: 700;
}

.submit {
  margin-top: 4px;
  height: 68px;
  border: none;
  border-radius: 18px;
  background: linear-gradient(90deg, #0a4a10, #1a5d1f);
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  cursor: pointer;
}

.submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: #b23a2f;
  font-size: 14px;
  margin: 0;
}

.back {
  margin-top: 20px;
  border: none;
  background: transparent;
  color: #5b6157;
  font-size: 16px;
  cursor: pointer;
}

.success-wrap {
  width: min(900px, 100%);
  text-align: center;
}

.icon-wrap {
  position: relative;
  width: 128px;
  height: 100px;
  margin: 20px auto 0;
}

.icon-dot {
  position: absolute;
  right: 14px;
  top: 4px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #dce9c9;
  opacity: 0.9;
}

.icon-main {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  margin: 14px auto 0;
  background: #0b4a11;
  color: #fff;
  font-size: 52px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  box-shadow: 0 12px 24px rgba(11, 74, 17, 0.25);
}

.success-title {
  margin: 22px 0 10px;
  font-size: clamp(42px, 6vw, 72px);
  line-height: 0.95;
  color: #0f3f15;
  font-weight: 700;
}

.success-copy {
  max-width: 630px;
  margin: 0 auto;
  color: #656c62;
  font-size: clamp(16px, 2vw, 28px);
  line-height: 1.35;
}

.signin-btn {
  margin-top: 22px;
  width: min(310px, 100%);
  height: 62px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(90deg, #063b0b, #165a1b);
  color: #fff;
  font-size: clamp(22px, 2vw, 34px);
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(8, 56, 11, 0.24);
}

.status-pill {
  margin: 16px auto 0;
  width: fit-content;
  padding: 6px 14px;
  border-radius: 999px;
  background: #ecefe7;
  color: #6d7469;
  font-size: 11px;
  letter-spacing: 0.08em;
  font-weight: 700;
}

.hero-image {
  width: min(760px, 100%);
  height: 280px;
  margin: 34px auto 0;
  border-radius: 14px 14px 0 0;
  overflow: hidden;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 1100px) {
  .reset-shell {
    grid-template-columns: 1fr;
  }

  .media-cover {
    height: 360px;
  }

  .security-note {
    right: 14px;
    width: min(290px, calc(100% - 28px));
  }

  .form-panel {
    max-width: 100%;
  }

  .form-panel h1 {
    font-size: 52px;
  }

  .intro {
    font-size: 18px;
  }

  .submit {
    font-size: 24px;
  }

  .hero-image {
    height: 190px;
  }
}
</style>
