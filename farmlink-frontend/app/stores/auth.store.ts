import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { AuthUser, SignInPayload, SignInResult, SignUpPayload } from '../types/auth.type';
import { authService } from '../services/auth.service';

const SESSION_KEY = 'farmlink.auth.session';
export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref<string | null>(null);
    const user = ref<AuthUser | null>(null);
    const hydrated = ref(false);

    const isAuthenticated = computed(() => Boolean(accessToken.value && user.value));

    const applySession = (result: SignInResult) => {
        accessToken.value = result.accessToken;
        user.value = result.user;
        persist();
    };

    const getPostSignInRoute = (role: AuthUser['role']) => {
        if (role === 'farmer') return '/farmer/dashboard';
        if (role === 'admin') return '/admin/dashboard';
        return '/';
    };

    const persist = () => {
        if ( typeof window === 'undefined') return;

        if (!accessToken.value || !user.value) {
            localStorage.removeItem(SESSION_KEY);
            return;
        } 

        localStorage.setItem(SESSION_KEY, JSON.stringify({
            accessToken: accessToken.value,
            user: user.value,
        }),
     );
    };

    const hydrate = () => {
        if ( typeof window === 'undefined' || hydrated.value) return;

        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) {
            hydrated.value = true;
            return;
        }

        try {
            const parsed = JSON.parse(raw!);
            if (parsed.accessToken && parsed?.user?.id && parsed?.user?.email && parsed?.user?.role) {
                accessToken.value = parsed.accessToken;
                user.value = parsed.user;
            } 
        } catch {
            localStorage.removeItem(SESSION_KEY);
        } finally {
            hydrated.value = true;
        }
    };

    const signIn = async (payload : SignInPayload) => {
        const result = await authService.signin(payload);

        if(payload.expectedRole && result.user.role !== payload.expectedRole) {
            throw new Error(`This account is not a ${payload.expectedRole}.`);
        }
        
        applySession(result);

        return result;
    };

    const signUp = async (payload: SignUpPayload) => {
        const result = await authService.signup(payload);
        applySession(result);

        return result;
    };

    const signOut = () => {
        accessToken.value = null;
        user.value = null;
        persist();
    };

    return {
        accessToken,
        user,
        isAuthenticated,
        getPostSignInRoute,
        hydrate,
        hydrated,
        signIn,
        signUp,
        signOut,
    };
});