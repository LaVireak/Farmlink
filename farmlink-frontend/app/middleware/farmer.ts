import { useAuthStore } from '~/stores/auth.store';

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore();

  if (!auth.isAuthenticated || auth.user?.role !== 'farmer') {
    return navigateTo('/404');
  }

});
