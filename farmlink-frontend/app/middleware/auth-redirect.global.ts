import { useAuthStore } from '~/stores/auth.store';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore();

  // Hydrate session from localStorage/Supabase if not already done
  if (!auth.hydrated) {
    await auth.hydrate();
  }

  // Redirect logged-in users landing on root / or /user to their respective dashboards
  if (to.path === '/' || to.path === '/user' || to.path === '/user/') {
    if (auth.isAuthenticated && auth.user) {
      if (auth.user.role === 'farmer') {
        console.log('[AUTH GLOBAL] Redirecting logged-in farmer to dashboard');
        return navigateTo('/farmer/dashboard');
      }
      if (auth.user.role === 'admin') {
        console.log('[AUTH GLOBAL] Redirecting logged-in admin to dashboard');
        return navigateTo('/admin/dashboard');
      }
    }
  }
});
