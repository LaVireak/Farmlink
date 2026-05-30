import { useAuthStore } from '~/stores/auth.store';

export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore();

  if (import.meta.client) {
    await auth.hydrate();
  }

  if (!auth.isAuthenticated || auth.user?.role !== 'farmer') {
    return navigateTo('/404');
  }
});
