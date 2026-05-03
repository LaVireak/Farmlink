import { computed } from 'vue';
import type { SignInPayload, SignUpPayload } from '../types/auth.type';
import { useAuthStore } from '../stores/auth.store';

export const useAuth = () => {
  const auth = useAuthStore();

  const ensureHydrated = () => auth.hydrate();

  const signIn = (payload: SignInPayload) => auth.signIn(payload);
  const signUp = (payload: SignUpPayload) => auth.signUp(payload);

  const signOut = async () => {
    auth.signOut();
  };

  return {
    user: computed(() => auth.user),
    isAuthenticated: computed(() => auth.isAuthenticated),
    ensureHydrated,
    signIn,
    signUp,
    signOut,
    getPostSignInRoute: auth.getPostSignInRoute,
  };
};