import { useAuthStore } from '~/stores/auth.store';

export default defineNuxtPlugin(() => {
  const auth = useAuthStore();
  void auth.hydrate();
});
