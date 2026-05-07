import { computed } from 'vue';
import type { SignInPayload, SignUpPayload } from '../types/auth.type';
import { useAuthStore } from '../stores/auth.store';

export const useAuth = () => {
  const auth = useAuthStore();

  const ensureHydrated = () => auth.hydrate();

  const signIn = (payload: SignInPayload) => auth.signIn(payload);
  const requestSignupOtp = (payload: SignUpPayload) => auth.requestSignupOtp(payload);
  const verifySignupOtp = (email: string, code: string) => auth.verifySignupOtp(email, code);
  const resendSignupOtp = (email: string) => auth.resendSignupOtp(email);

  const signOut = async () => {
    auth.signOut();
  };

  return {
    user: computed(() => auth.user),
    isAuthenticated: computed(() => auth.isAuthenticated),
    ensureHydrated,
    signIn,
    requestSignupOtp,
    verifySignupOtp,
    resendSignupOtp,
    signOut,
    getPostSignInRoute: auth.getPostSignInRoute,
  };
};