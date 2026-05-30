<template>
  <div class="verify-page">
    <div class="verify-card">

      <div class="verify-content">
        <div class="image-wrap">
          <img
            src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80"
            alt="Harvest"
            class="cover"
          >
          <div class="lock-badge"></div>
        </div>

        <div class="form-wrap">
		<button type="button" class="back-link" @click="goBack">← BACK TO LOGIN</button>
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

          <p v-if="errorMessage" class="error-text">
            {{ errorMessage }}
          </p>

          <button type="button" class="verify-btn" :disabled="!isCodeComplete || loading" @click="verifyCode">
            {{ loading ? 'Verifying...' : 'Verify Code' }}
          </button>

          <p class="resend-copy">Didn't receive code?
          <button type="button" class="resend-btn" :disabled="loading" @click="resendCode">
            Resend code
          </button>
		  </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import type { FarmerOnboardingPayload } from '../../types/auth.type';

const route = useRoute();
const router = useRouter();
const {
  verifySignupOtp,
  resendSignupOtp,
  verifyPasswordResetOtp,
  resendPasswordResetOtp,
  getPostSignInRoute,
  submitFarmerOnboarding,
} = useAuth();
const FARMER_ONBOARDING_KEY = 'farmlink.farmer.onboarding';

const codeDigits = ref<string[]>(['', '', '', '', '', '']);
const inputRefs = ref<Array<HTMLInputElement | null>>([]);
const loading = ref(false);
const errorMessage = ref('');

const emailText = computed(() => {
  const email = typeof route.query.email === 'string' ? route.query.email : '';
  return email || 'keat.farmer@example.com';
});

const isCodeComplete = computed(() => codeDigits.value.every((digit) => /^[0-9]$/.test(digit)));
const isResetMode = computed(() => route.query.mode === 'reset');

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

const resendCode = async () => {
  errorMessage.value = '';
  const email = typeof route.query.email === 'string' ? route.query.email : '';
  if (!email) {
    errorMessage.value = 'Missing email address.';
    return;
  }

  try {
    if (isResetMode.value) {
      await resendPasswordResetOtp(email);
    } else {
      await resendSignupOtp(email);
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Unable to resend code.';
  }
};

const verifyCode = async () => {
  errorMessage.value = '';
  const email = typeof route.query.email === 'string' ? route.query.email : '';
  if (!email) {
    errorMessage.value = 'Missing email address.';
    return;
  }

  if (!isCodeComplete.value) {
    errorMessage.value = 'Please enter the full code.';
    return;
  }

  loading.value = true;

  try {
    const code = codeDigits.value.join('');
    if (isResetMode.value) {
      await verifyPasswordResetOtp(email, code);
      await router.push('/auth/reset-password');
    } else {
      const result = await verifySignupOtp(email, code);

      if (result.user.role === 'farmer') {
        const raw = sessionStorage.getItem(FARMER_ONBOARDING_KEY);
        if (raw) {
          const payload = JSON.parse(raw) as FarmerOnboardingPayload;
          await submitFarmerOnboarding(payload);
          sessionStorage.removeItem(FARMER_ONBOARDING_KEY);
        }
      }

      await router.push(getPostSignInRoute(result.user.role));
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Verification failed.';
  } finally {
    loading.value = false;
  }
};

const goBack = async () => {
  await router.push('/auth/signin');
};

onMounted(() => {
  focusIndex(0);
});
</script>

<style scoped>
.verify-page {
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

.verify-card {
	width: 100%;
	max-width: 920px;
}

.back-link {
	align-self: flex-start;
	border: none;
	background: transparent;

	color: #5d6a55;

	font-size: 11px;
	font-weight: 700;

	letter-spacing: 0.12em;
	text-transform: uppercase;

	margin-bottom: 12px;

	cursor: pointer;

	transition: color 0.2s ease;
}

.back-link:hover {
	color: #166534;
}

.verify-content {
	display: grid;
	grid-template-columns: 280px 1fr;

	gap: 20px;
	align-items: stretch;
}

.image-wrap,
.form-wrap {
	background: rgba(255, 255, 255, 0.82);

	backdrop-filter: blur(16px);
	-webkit-backdrop-filter: blur(16px);

	border: 1px solid rgba(255, 255, 255, 0.4);

	border-radius: 26px;

	box-shadow:
		0 8px 30px rgba(15, 23, 42, 0.05);
}

.image-wrap {
	position: relative;

	overflow: hidden;

	min-height: 460px;
}

.cover {
	width: 100%;
	height: 100%;

	object-fit: cover;

	display: block;
}

.image-wrap::after {
	content: '';

	position: absolute;
	inset: 0;

	background:
		linear-gradient(
			180deg,
			rgba(0,0,0,0.05),
			rgba(0,0,0,0.58)
		);
}

.lock-badge {
	position: absolute;

	right: 18px;
	bottom: 18px;

	width: 62px;
	height: 62px;

	border-radius: 50%;

	background:
		linear-gradient(
			135deg,
			#22c55e,
			#166534
		);

	box-shadow:
		0 14px 24px rgba(22,101,52,0.24);

	z-index: 3;
}

.lock-badge::before {
	content: '✓';

	position: absolute;
	inset: 0;

	display: flex;
	align-items: center;
	justify-content: center;

	color: white;

	font-size: 24px;
	font-weight: 800;
}

.form-wrap {
	padding: 34px;

	display: flex;
	flex-direction: column;
	justify-content: center;
}

.form-wrap h1 {
	margin: 0;

	font-size: clamp(42px, 4vw, 58px);
	line-height: 0.95;

	letter-spacing: -0.05em;

	color: #0f3f15;

	font-weight: 800;
}

.copy {
	margin: 18px 0 4px;

	color: #6f746b;

	font-size: 14px;
	line-height: 1.6;
}

.email {
	margin: 0 0 22px;

	color: #17381b;

	font-size: 15px;
	font-weight: 700;
}

.code-grid {
	display: grid;
	grid-template-columns: repeat(6, minmax(0, 1fr));

	gap: 10px;

	width: 100%;
	max-width: 420px;
}

.code-input {
	width: 100%;
	height: 64px;

	border: none;
	border-radius: 18px;

	background: rgba(240, 244, 238, 0.9);

	text-align: center;

	font-size: 24px;
	font-weight: 700;

	color: #29422a;

	outline: none;

	transition:
		transform 0.2s ease,
		background 0.2s ease,
		box-shadow 0.2s ease;
}

.code-input:focus {
	background: white;

	transform: translateY(-1px);

	box-shadow:
		0 0 0 4px rgba(22,101,52,0.12);
}

.verify-btn {
	margin-top: 18px;

	border: none;
	border-radius: 18px;

	background:
		linear-gradient(
			135deg,
			#166534,
			#0f4f29
		);

	color: white;

	height: 54px;

	width: 100%;
	max-width: 420px;

	font-size: 15px;
	font-weight: 700;

	letter-spacing: 0.02em;

	cursor: pointer;

	box-shadow:
		0 14px 24px rgba(18,79,40,0.16);

	transition:
		transform 0.18s ease,
		box-shadow 0.18s ease,
		opacity 0.18s ease;
}

.verify-btn:hover:not(:disabled) {
	transform: translateY(-1px);

	box-shadow:
		0 18px 30px rgba(18,79,40,0.22);
}

.verify-btn:disabled {
	opacity: 0.65;

	cursor: not-allowed;
}

.error-text {
	margin-top: 12px;

	padding: 12px 14px;

	border-radius: 14px;

	background: rgba(254,242,242,0.95);

	border: 1px solid rgba(180,35,24,0.1);

	color: #b91c1c;

	font-size: 13px;
}

.resend-copy {
	margin: 24px 0 6px;

	color: #6f746b;

	font-size: 13px;
}

.resend-btn {
	border: none;
	background: transparent;

	padding: 0;

	color: #166534;

	font-size: 14px;
	font-weight: 700;

	cursor: pointer;

	transition: opacity 0.2s ease;
}

.resend-btn:hover:not(:disabled) {
	text-decoration: underline;
}

.resend-btn:disabled {
	opacity: 0.6;

	cursor: not-allowed;
}

.status-pill {
	margin-top: 24px;

	width: fit-content;

	padding: 8px 12px;

	border-radius: 999px;

	background: rgba(22,101,52,0.08);

	color: #166534;

	font-size: 11px;
	font-weight: 800;

	letter-spacing: 0.08em;
}

@media (max-width: 900px) {
	.verify-page {
		position: relative;

		min-height: 100vh;

		padding: 14px;

		overflow-y: auto;
	}

	.verify-content {
		grid-template-columns: 1fr;

		max-width: 460px;

		margin: 0 auto;
	}

	.image-wrap {
		display: none;
	}

	.form-wrap {
		padding: 26px;

		border-radius: 22px;
	}

	.form-wrap h1 {
		font-size: 40px;
	}

	.code-grid {
		max-width: 100%;
	}

	.code-input {
		height: 56px;

		font-size: 20px;
	}

	.verify-btn {
		max-width: 100%;
	}
}

@media (max-width: 480px) {
	.verify-page {
		padding: 12px;
	}

	.form-wrap {
		padding: 22px;
	}

	.form-wrap h1 {
		font-size: 34px;
	}

	.code-grid {
		gap: 8px;
	}

	.code-input {
		height: 50px;

		border-radius: 14px;

		font-size: 18px;
	}

	.verify-btn {
		height: 50px;

		font-size: 14px;
	}
}
</style>
