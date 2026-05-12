<template>
  <div class="verify-page">
    <div class="verify-card">
      <button type="button" class="back-link" @click="goBack">← BACK TO LOGIN</button>

      <div class="verify-content">
        <div class="image-wrap">
          <img
            src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80"
            alt="Harvest"
            class="cover"
          >
          <div class="lock-badge">🔒</div>
        </div>

        <div class="form-wrap">
          <h1>Enter<br>Verification<br>Code</h1>
          <p class="copy">We have sent a 6-digit code to your email</p>
          <p class="email">{{ emailText }}</p>

          <div class="code-grid">
            <input
              v-for="(_, idx) in codeDigits"
              :key="idx"
              :ref="(el) => setInputRef(el, idx)"
              v-model="codeDigits[idx]"
              class="code-input"
              type="text"
              inputmode="numeric"
              maxlength="1"
              @input="onDigitInput(idx)"
              @keydown.backspace="onBackspace(idx, $event)"
            >
          </div>

          <button type="button" class="verify-btn" :disabled="!isCodeComplete" @click="verifyCode">
            Verify Code
          </button>

          <p class="resend-copy">Didn't receive the email?</p>
          <button type="button" class="resend-btn" :disabled="countdown > 0" @click="resendCode">
            {{ countdown > 0 ? `Resend code in 0:${countdownText}` : 'Resend code now' }}
          </button>

          <div class="status-pill">● SECURE RECOVERY ACTIVE</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const codeDigits = ref<string[]>(['', '', '', '', '', '']);
const inputRefs = ref<Array<HTMLInputElement | null>>([]);
const countdown = ref(59);
let timer: ReturnType<typeof setInterval> | null = null;

const emailText = computed(() => {
  const email = typeof route.query.email === 'string' ? route.query.email : '';
  return email || 'keat.farmer@example.com';
});

const countdownText = computed(() => countdown.value.toString().padStart(2, '0'));
const isCodeComplete = computed(() => codeDigits.value.every((digit) => /^[0-9]$/.test(digit)));

const setInputRef = (el: Element | { $el?: Element } | null, idx: number) => {
  if (!el) {
    inputRefs.value[idx] = null;
    return;
  }

  const candidate = '$el' in el && el.$el ? el.$el : el;
  inputRefs.value[idx] = candidate instanceof HTMLInputElement ? candidate : null;
};

const focusIndex = (idx: number) => {
  const input = inputRefs.value[idx];
  if (input) {
    input.focus();
    input.select();
  }
};

const onDigitInput = (idx: number) => {
  const current = codeDigits.value[idx] ?? '';
  codeDigits.value[idx] = current.replace(/\D/g, '').slice(0, 1);

  if (codeDigits.value[idx] && idx < codeDigits.value.length - 1) {
    focusIndex(idx + 1);
  }
};

const onBackspace = (idx: number, event: KeyboardEvent) => {
  if (codeDigits.value[idx]) {
    codeDigits.value[idx] = '';
    return;
  }

  if (idx > 0) {
    event.preventDefault();
    focusIndex(idx - 1);
    codeDigits.value[idx - 1] = '';
  }
};

const startCountdown = () => {
  if (timer) {
    clearInterval(timer);
  }

  countdown.value = 59;
  timer = setInterval(() => {
    if (countdown.value <= 0) {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      return;
    }

    countdown.value -= 1;
  }, 1000);
};

const resendCode = () => {
  startCountdown();
};

const verifyCode = async () => {
  // TODO: call backend endpoint to validate code, then route with secure reset token.
  await router.push('/auth/reset-password');
};

const goBack = async () => {
  await router.push('/auth/signin');
};

onMounted(() => {
  focusIndex(0);
  startCountdown();
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>

<style scoped>
.verify-page {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f8f5;
  padding: 16px;
}

.verify-card {
  width: 100%;
  max-width: 980px;
  background: transparent;
}

.back-link {
  border: none;
  background: transparent;
  color: #5d6a55;
  font-size: 11px;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
  cursor: pointer;
}

.verify-content {
  display: grid;
  grid-template-columns: 230px 1fr;
  gap: 20px;
  align-items: center;
}

.image-wrap {
  position: relative;
  width: 230px;
  height: 230px;
  border-radius: 24px;
  overflow: hidden;
}

.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lock-badge {
  position: absolute;
  right: -16px;
  bottom: -12px;
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: #cddfad;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.form-wrap h1 {
  margin: 0;
  font-size: 58px;
  line-height: 0.95;
  color: #0f3f15;
  font-weight: 700;
}

.copy {
  margin: 14px 0 4px;
  color: #6f746b;
  font-size: 15px;
}

.email {
  margin: 0 0 18px;
  color: #17381b;
  font-weight: 700;
}

.code-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 10px;
  width: min(100%, 520px);
}

.code-input {
  width: 100%;
  height: clamp(48px, 10vw, 72px);
  border: none;
  border-radius: 12px;
  background: #eceee9;
  text-align: center;
  font-size: clamp(18px, 4vw, 28px);
  color: #29422a;
}

.code-input:focus {
  outline: 2px solid #2e5a2f;
}

.verify-btn {
  margin-top: 16px;
  border: none;
  border-radius: 12px;
  background: #0b4a11;
  color: #fff;
  height: 62px;
  width: min(520px, 100%);
  font-size: 25px;
  font-weight: 600;
  cursor: pointer;
}

.verify-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.resend-copy {
  margin: 28px 0 6px;
  color: #6f746b;
  font-size: 16px;
}

.resend-btn {
  border: none;
  background: transparent;
  color: #2d4f2f;
  font-size: 28px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
}

.resend-btn:disabled {
  opacity: 0.75;
  cursor: not-allowed;
  text-decoration: none;
}

.status-pill {
  margin-top: 26px;
  width: fit-content;
  background: #e4d9b8;
  color: #2f3e27;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 11px;
  letter-spacing: 0.05em;
  font-weight: 700;
}

@media (max-width: 900px) {
  .verify-content {
    grid-template-columns: 1fr;
  }

  .image-wrap {
    width: min(320px, 100%);
    height: 210px;
  }

  .form-wrap h1 {
    font-size: 44px;
  }

  .resend-btn {
    font-size: 22px;
  }
}

@media (max-width: 480px) {
  .verify-page {
    padding: 10px;
  }

  .verify-card {
    max-width: 100%;
  }

  .code-grid {
    gap: 8px;
  }

  .form-wrap h1 {
    font-size: 34px;
  }

  .verify-btn {
    height: 56px;
    font-size: 20px;
  }

  .resend-btn {
    font-size: 18px;
  }
}
</style>
