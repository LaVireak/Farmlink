import { computed } from 'vue';
import type { FarmerOnboardingPayload, SignInPayload, SignUpPayload } from '../types/auth.type';
import { useAuthStore } from '../stores/auth.store';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const auth = useAuthStore();

  const ensureHydrated = () => auth.hydrate();

  const signIn = (payload: SignInPayload) => auth.signIn(payload);
  const signInWithGoogle = () => auth.signInWithGoogle();
  const signInWithFacebook = () => auth.signInWithFacebook();
  const requestSignupOtp = (payload: SignUpPayload) => auth.requestSignupOtp(payload);
  const verifySignupOtp = (email: string, code: string) => auth.verifySignupOtp(email, code);
  const resendSignupOtp = (email: string) => auth.resendSignupOtp(email);
  const requestPasswordResetOtp = (email: string) => authService.requestPasswordResetOtp(email);
  const resendPasswordResetOtp = (email: string) => authService.resendPasswordResetOtp(email);
  const verifyPasswordResetOtp = (email: string, code: string) => authService.verifyPasswordResetOtp({ email, code });
  const resetPassword = (password: string) => authService.resetPassword(password);
  const submitFarmerOnboarding = (payload: FarmerOnboardingPayload) => authService.submitFarmerOnboarding(payload);

  const signOut = async () => {
    await auth.signOut();
  };

  return {
    user: computed(() => auth.user),
    isAuthenticated: computed(() => auth.isAuthenticated),
    ensureHydrated,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    requestSignupOtp,
    verifySignupOtp,
    resendSignupOtp,
    requestPasswordResetOtp,
    resendPasswordResetOtp,
    verifyPasswordResetOtp,
    resetPassword,
    submitFarmerOnboarding,
    signOut,
    getPostSignInRoute: auth.getPostSignInRoute,
  };
};