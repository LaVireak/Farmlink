<template>
  <div class="callback-page">
    <!-- Error state -->
    <div v-if="error" class="callback-card callback-error">
      <div class="icon-wrap error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <h2>Sign-in failed</h2>
      <p class="error-message">{{ error }}</p>
      <p v-if="showEmailHint" class="error-hint">
        💡 <strong>Tip:</strong> Facebook requires the <code>email</code> permission to be approved in the
        Facebook Developer Console. Make sure your Facebook App is configured to request the user's email,
        and that the email permission is approved in your Supabase Facebook OAuth settings.
      </p>
      <NuxtLink to="/auth/signin" class="back-btn">← Back to Sign In</NuxtLink>
    </div>

    <!-- Loading state -->
    <div v-else class="callback-card callback-loading">
      <div class="spinner"></div>
      <p>Signing you in…</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store'

const router = useRouter()
const auth = useAuthStore()
const error = ref('')
const showEmailHint = ref(false)

/** Parse key=value pairs from a URL hash fragment (strips the leading #) */
function parseHash(hash: string): Record<string, string> {
  const params: Record<string, string> = {}
  hash.replace(/^#/, '').split('&').forEach((pair) => {
    const eqIdx = pair.indexOf('=')
    if (eqIdx === -1) return
    const key = decodeURIComponent(pair.slice(0, eqIdx))
    const val = decodeURIComponent(pair.slice(eqIdx + 1).replace(/\+/g, ' '))
    params[key] = val
  })
  return params
}

onMounted(async () => {
  const hash = window.location.hash
  console.log('[Callback] raw URL hash:', hash)

  // ── Step 1: Check for a Supabase OAuth error returned in the hash ──
  if (hash && hash.includes('error')) {
    const params = parseHash(hash)
    console.error('[Callback] OAuth error params:', params)

    const errorCode = params['error_code'] ?? params['error'] ?? 'unknown'
    const description = params['error_description'] ?? 'An unknown error occurred during sign-in.'

    if (description.toLowerCase().includes('email')) {
      showEmailHint.value = true
    }

    error.value = `${description} (code: ${errorCode})`

    // Clean the ugly error hash from the browser URL bar without navigating
    window.history.replaceState(null, '', window.location.pathname)
    return
  }

  // ── Step 2: No error — attempt to hydrate the Supabase session ──
  try {
    await auth.hydrate()
  } catch (e) {
    console.error('[Callback] hydrate() threw:', e)
    error.value = 'Session could not be established. Please try again.'
    return
  }

  if (!auth.isAuthenticated) {
    error.value = 'Authentication failed. Please try signing in again.'
    return
  }

  console.log('[Callback] Authenticated as:', auth.user)
  const route = auth.getPostSignInRoute(auth.user!.role)
  await router.replace(route)
})
</script>

<style scoped>
.callback-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background:
    radial-gradient(circle at top left, rgba(22, 101, 52, 0.12), transparent 30%),
    linear-gradient(135deg, #f4f7f2, #edf3ea);
}

.callback-card {
  max-width: 460px;
  width: 100%;
  padding: 36px 32px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 40px rgba(15, 23, 42, 0.08);
  text-align: center;
}

/* Loading */
.callback-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  color: #475569;
  font-size: 16px;
  font-weight: 600;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(22, 101, 52, 0.15);
  border-top-color: #166534;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error */
.callback-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon {
  background: rgba(254, 242, 242, 0.9);
  color: #b42318;
  border: 1px solid rgba(180, 35, 24, 0.2);
}

.callback-error h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.error-message {
  font-size: 14px;
  color: #b42318;
  background: rgba(254, 242, 242, 0.7);
  border: 1px solid rgba(180, 35, 24, 0.12);
  border-radius: 12px;
  padding: 12px 16px;
  line-height: 1.6;
  margin: 0;
}

.error-hint {
  font-size: 13px;
  color: #475569;
  background: rgba(255, 247, 218, 0.8);
  border: 1px solid rgba(234, 179, 8, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  line-height: 1.7;
  text-align: left;
  margin: 0;
}

.error-hint code {
  background: rgba(0, 0, 0, 0.06);
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 12px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 999px;
  background: linear-gradient(135deg, #22c55e, #166534);
  color: white;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 6px 18px rgba(22, 101, 52, 0.2);
}

.back-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(22, 101, 52, 0.3);
}
</style>
