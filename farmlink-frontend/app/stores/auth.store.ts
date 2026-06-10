import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { AuthUser, SignInPayload, SignInResult, SignUpPayload } from '../types/auth.type';
import type { Session } from '@supabase/supabase-js';
import { authService, mapSupabaseUser, supabase } from '../services/auth.service';

const SESSION_KEY = 'farmlink.auth.session';
const AVATAR_KEY_PREFIX = 'farmlink.user.avatar';
const PENDING_AVATAR_KEY_PREFIX = 'farmlink.user.avatar.pending';

const getAvatarStorageKey = (userId: string | null | undefined) => (
    userId ? `${AVATAR_KEY_PREFIX}.${userId}` : null
);

const getStoredAvatarUrl = (userId: string | null | undefined) => {
    if (typeof window === 'undefined') return null;

    const key = getAvatarStorageKey(userId);
    if (!key) return null;

    return localStorage.getItem(key);
};

const getPendingAvatarStorageKey = (userId: string | null | undefined) => (
    userId ? `${PENDING_AVATAR_KEY_PREFIX}.${userId}` : null
);

const getStoredPendingAvatarUrl = (userId: string | null | undefined) => {
    if (typeof window === 'undefined') return null;

    const key = getPendingAvatarStorageKey(userId);
    if (!key) return null;

    return localStorage.getItem(key);
};

const mergeStoredAvatar = (authUser: AuthUser | null): AuthUser | null => {
    if (!authUser) return null;

    const storedAvatarUrl = getStoredAvatarUrl(authUser.id);
    if (!storedAvatarUrl) return authUser;

    return {
        ...authUser,
        avatarUrl: authUser.avatarUrl ?? storedAvatarUrl,
    };
};

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);
    const user = ref<AuthUser | null>(null);
    const pendingAvatarUrl = ref<string | null>(null);
    const hydrated = ref(false);
    const lastSyncError = ref<string | null>(null);
    let hydratingPromise: Promise<void> | null = null;

    const isAuthenticated = computed(() => Boolean(accessToken.value && user.value));

    const applySession = (result: SignInResult) => {
        accessToken.value = result.accessToken;
        refreshToken.value = result.refreshToken;
        user.value = mergeStoredAvatar(result.user);
        pendingAvatarUrl.value = getStoredPendingAvatarUrl(result.user.id);
        persist();
    };

    const applySupabaseSession = (session: Session) => {
        accessToken.value = session.access_token;
        refreshToken.value = session.refresh_token;
        user.value = mergeStoredAvatar(mapSupabaseUser(session.user));
        pendingAvatarUrl.value = getStoredPendingAvatarUrl(session.user.id);
        persist();
    };

    const setPendingAvatarUrl = (avatarUrl: string) => {
        pendingAvatarUrl.value = avatarUrl;
        persist();
    };

    const clearPendingAvatarUrl = () => {
        pendingAvatarUrl.value = null;
        persist();
    };

    const updateUserAvatar = (avatarUrl: string) => {
        if (!user.value) return;

        user.value = {
            ...user.value,
            avatarUrl,
        };
        pendingAvatarUrl.value = null;
        persist();
    };

    const updateUserProfile = (patch: Partial<AuthUser>) => {
        if (!user.value) return;

        user.value = {
            ...user.value,
            ...patch,
        };
        persist();
    };

    const clearSession = () => {
        if (typeof window !== 'undefined' && user.value?.id) {
            const avatarKey = getAvatarStorageKey(user.value.id);
            if (avatarKey) {
                localStorage.removeItem(avatarKey);
            }

            const pendingAvatarKey = getPendingAvatarStorageKey(user.value.id);
            if (pendingAvatarKey) {
                localStorage.removeItem(pendingAvatarKey);
            }
        }

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
        if (typeof window === 'undefined') return;

        if (!accessToken.value || !refreshToken.value || !user.value) {
            localStorage.removeItem(SESSION_KEY);
            return;
        }

        const avatarKey = getAvatarStorageKey(user.value.id);
        if (avatarKey && user.value.avatarUrl) {
            localStorage.setItem(avatarKey, user.value.avatarUrl);
        }

        const pendingAvatarKey = getPendingAvatarStorageKey(user.value.id);
        if (pendingAvatarKey) {
            if (pendingAvatarUrl.value) {
                localStorage.setItem(pendingAvatarKey, pendingAvatarUrl.value);
            } else {
                localStorage.removeItem(pendingAvatarKey);
            }
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
        if (hydratingPromise) return hydratingPromise;

        hydratingPromise = (async () => {
            try {
                const { data } = await supabase.auth.getSession();
                if (data.session) {
                    applySupabaseSession(data.session);
                    hydrated.value = true;

                    // Sync database profile role asynchronously
                    try {
                        const dbProfile = await authService.fetchProfile();
                        if (dbProfile?.role && user.value) {
                            user.value = { ...user.value, ...dbProfile, role: dbProfile.role as AuthUser['role'] };
                            persist();
                        }
                    } catch (e: any) {
                        console.error('[HYDRATE] DB role sync failed:', e);
                        if (e.message && (e.message.includes('Invalid') || e.message.includes('expired') || e.message.includes('Unauthorized') || e.message.includes('401') || e.message.includes('session'))) {
                            await authService.signOut();
                            accessToken.value = null;
                            user.value = null;
                        }
                    }
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
                        // Restore session into Supabase client to sync authentication state
                        const { data: setSessionData, error: setSessionError } = await supabase.auth.setSession({
                            access_token: parsed.accessToken,
                            refresh_token: parsed.refreshToken,
                        });

                        if (setSessionError || !setSessionData.session) {
                            localStorage.removeItem(SESSION_KEY);
                            accessToken.value = null;
                            user.value = null;
                            hydrated.value = true;
                            return;
                        }

                        accessToken.value = setSessionData.session.access_token;
                        refreshToken.value = setSessionData.session.refresh_token;
                        user.value = mergeStoredAvatar(mapSupabaseUser(setSessionData.session.user));
                        if (user.value && parsed.user.role) {
                            user.value.role = parsed.user.role;
                        }
                        pendingAvatarUrl.value = getStoredPendingAvatarUrl(setSessionData.session.user.id);
                        persist();

                        // Sync database profile role asynchronously
                        try {
                            const dbProfile = await authService.fetchProfile();
                            if (dbProfile?.role && user.value) {
                                user.value = { ...user.value, ...dbProfile, role: dbProfile.role as AuthUser['role'] };
                                persist();
                            }
                        } catch (e: any) {
                            console.error('[HYDRATE] DB role sync failed:', e);
                            if (e.message && (e.message.includes('Invalid') || e.message.includes('expired') || e.message.includes('Unauthorized') || e.message.includes('401') || e.message.includes('session'))) {
                                localStorage.removeItem(SESSION_KEY);
                                accessToken.value = null;
                                user.value = null;
                            }
                        }
                    }
                } catch {
                    localStorage.removeItem(SESSION_KEY);
                    accessToken.value = null;
                    user.value = null;
                } finally {
                    hydrated.value = true;
                }
            } catch (err) {
                console.error('[HYDRATE] Unexpected failure:', err);
            } finally {
                hydrated.value = true;
            }
        })();

        await hydratingPromise;
        hydratingPromise = null;
    };

    const signIn = async (payload: SignInPayload) => {
        const result = await authService.signin(payload);
        applySession(result);

        // Sync real role from NestJS PostgreSQL (Supabase metadata may be stale/missing)
        try {
            lastSyncError.value = null;
            const dbProfile = await authService.fetchProfile();
            if (dbProfile?.role && user.value) {
                user.value = { ...user.value, ...dbProfile, role: dbProfile.role as AuthUser['role'] };
                persist();
            }
        } catch (e: any) {
            console.error('[AUTH] fetchProfile FAILED:', e);
            lastSyncError.value = e.message || String(e);
        }

        return result;
    };

    const signInWithGoogle = async (idToken?: string) => {
        if (idToken) {
            const result = await authService.googleSignInWithIdToken(idToken);
            applySession(result);

            // Sync database profile role asynchronously
            try {
                lastSyncError.value = null;
                const dbProfile = await authService.fetchProfile();
                if (dbProfile?.role && user.value) {
                    user.value = { ...user.value, ...dbProfile, role: dbProfile.role as AuthUser['role'] };
                    persist();
                }
            } catch (e: any) {
                console.error('[AUTH] fetchProfile FAILED:', e);
                lastSyncError.value = e.message || String(e);
            }
            return result;
        } else {
            // Triggers a browser redirect — no session returned here.
            await authService.googleSignIn();
        }
    };

    const signInWithFacebook = async () => {
        console.log('[Facebook Login] [auth.store] signInWithFacebook() called — delegating to authService.facebookSignIn()');
        // Triggers a browser redirect — no session returned here.
        await authService.facebookSignIn();
        console.log('[Facebook Login] [auth.store] authService.facebookSignIn() resolved without throwing');
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
        try {
            await authService.signOut();
        } catch (e) {
            console.error('Error during signOut:', e);
        } finally {
            clearSession();
        }
    };

    return {
        accessToken,
        refreshToken,
        user,
        pendingAvatarUrl,
        isAuthenticated,
        getPostSignInRoute,
        hydrate,
        hydrated,
        lastSyncError,
        signIn,
        signInWithGoogle,
        signInWithFacebook,
        setPendingAvatarUrl,
        clearPendingAvatarUrl,
        updateUserAvatar,
        updateUserProfile,
        requestSignupOtp,
        verifySignupOtp,
        resendSignupOtp,
        signOut,
    };
});