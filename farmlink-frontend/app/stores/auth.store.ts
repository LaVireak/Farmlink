import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { AuthUser, SignInPayload, SignInResult, SignUpPayload } from '../types/auth.type';
import type { Session } from '@supabase/supabase-js';
import { authService, mapSupabaseUser, supabase } from '../services/auth.service';

const SESSION_KEY = 'farmlink.auth.session';
export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);
    const user = ref<AuthUser | null>(null);
    const hydrated = ref(false);

    const isAuthenticated = computed(() => Boolean(accessToken.value && user.value));

    const applySession = (result: SignInResult) => {
        accessToken.value = result.accessToken;
        refreshToken.value = result.refreshToken;
        user.value = result.user;
        persist();
    };

    const applySupabaseSession = (session: Session) => {
        accessToken.value = session.access_token;
        refreshToken.value = session.refresh_token;
        user.value = mapSupabaseUser(session.user);
        persist();
    };

    const clearSession = () => {
        accessToken.value = null;
        refreshToken.value = null;
        user.value = null;
        persist();
    };

    const getPostSignInRoute = (role: AuthUser['role']) => {
        if (role === 'farmer') return '/farmer/dashboard';
        if (role === 'admin') return '/admin/dashboard';
        return '/';
    };

    const persist = () => {
        if ( typeof window === 'undefined') return;

        if (!accessToken.value || !refreshToken.value || !user.value) {
            localStorage.removeItem(SESSION_KEY);
            return;
        } 

        localStorage.setItem(SESSION_KEY, JSON.stringify({
            accessToken: accessToken.value,
            refreshToken: refreshToken.value,
            user: user.value,
        }),
     );
    };

    const hydrate = async () => {
        if (typeof window === 'undefined' || hydrated.value) return;

        const { data } = await supabase.auth.getSession();
        if (data.session) {
            applySupabaseSession(data.session);
            hydrated.value = true;
            return;
        }

        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) {
            hydrated.value = true;
            return;
        }

        try {
            const parsed = JSON.parse(raw);
            if (parsed.accessToken && parsed.refreshToken && parsed?.user?.id && parsed?.user?.email && parsed?.user?.role) {
                accessToken.value = parsed.accessToken;
                refreshToken.value = parsed.refreshToken;
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
        applySession(result);

        return result;
    };

    const signInWithGoogle = async (idToken: string) => {
        const result = await authService.googleSignIn(idToken);
        applySession(result);
        return result;
    };

    const requestSignupOtp = async (payload: SignUpPayload) => {
        await authService.requestSignupOtp(payload);
        return { email: payload.email };
    };

    const verifySignupOtp = async (email: string, code: string) => {
        const result = await authService.verifySignupOtp({ email, code });
        applySession(result);
        return result;
    };

    const resendSignupOtp = async (email: string) => {
        return authService.resendSignupOtp(email);
    };

    const signOut = async () => {
        await authService.signOut();
        clearSession();
    };

    return {
        accessToken,
        refreshToken,
        user,
        isAuthenticated,
        getPostSignInRoute,
        hydrate,
        hydrated,
        signIn,
        signInWithGoogle,
        requestSignupOtp,
        verifySignupOtp,
        resendSignupOtp,
        signOut,
    };
});