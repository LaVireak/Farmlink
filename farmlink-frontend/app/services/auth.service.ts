import type {
    AuthUser,
    FarmerOnboardingPayload,
    SignInPayload,
    SignInResult,
    SignUpPayload,
    UserRole,
    VerifyOtpPayload,
} from '../types/auth.type';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing.');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

export const getAccessToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;

  const { data } = await supabase.auth.getSession();
  if (data.session?.access_token) {
    return data.session.access_token;
  }
  const sessionStr = localStorage.getItem('farmlink.auth.session');
  if (!sessionStr) return null;

  try {
    const session = JSON.parse(sessionStr);
    return session.accessToken ?? null;
  } catch {
    return null;
  }
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const PENDING_SIGNUP_KEY = 'farmlink.auth.pending-signup';

const normalizeRoleFromSupabase = (role?: string): UserRole => {
    const normalized = role === 'customer' ? 'consumer' : role;
    if (normalized === 'admin' || normalized === 'farmer' || normalized === 'consumer') {
        return normalized;
    }
    return 'consumer';
};

const normalizeRoleForSupabase = (role?: string): string => {
    return role === 'customer' ? 'consumer' : role ?? 'consumer';
};

export const mapSupabaseUser = (user: SupabaseUser): AuthUser => {
    const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
    const role = typeof metadata.role === 'string' ? metadata.role : undefined;
    const firstName = typeof metadata.firstName === 'string' ? metadata.firstName
        : typeof metadata.full_name === 'string' ? metadata.full_name.split(' ')[0]
        : typeof metadata.name === 'string' ? metadata.name.split(' ')[0]
        : undefined;
    const lastName = typeof metadata.lastName === 'string' ? metadata.lastName
        : typeof metadata.full_name === 'string' ? metadata.full_name.split(' ').slice(1).join(' ')
        : typeof metadata.name === 'string' ? metadata.name.split(' ').slice(1).join(' ')
        : undefined;
    const avatarUrl = typeof metadata.avatar_url === 'string' ? metadata.avatar_url
        : typeof metadata.picture === 'string' ? metadata.picture
        : undefined;

    return {
        id: user.id,
        email: user.email ?? '',
        role: normalizeRoleFromSupabase(role),
        firstName,
        lastName,
        avatarUrl,
        createdAt: typeof user.created_at === 'string' ? user.created_at : undefined,
        updatedAt: typeof user.updated_at === 'string' ? user.updated_at : undefined,
    };
};

const mapSessionToResult = (session: Session): SignInResult => ({
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    user: mapSupabaseUser(session.user),
});

const storePendingSignup = (payload: SignUpPayload) => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(PENDING_SIGNUP_KEY, JSON.stringify(payload));
};

const getPendingSignup = (email: string): SignUpPayload | null => {
    if (typeof window === 'undefined') return null;

    const raw = sessionStorage.getItem(PENDING_SIGNUP_KEY);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as SignUpPayload;
        if (parsed.email === email) {
            return parsed;
        }
    } catch {
        return null;
    }

    return null;
};

const clearPendingSignup = () => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(PENDING_SIGNUP_KEY);
};

const apiFetch = async <T>(path: string, options: RequestInit): Promise<T> => {
    const token = await getAccessToken();
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers ?? {}),
        },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data?.message || 'Request failed');
    }

    return data as T;
};

export const authService = {
    async requestSignupOtp(payload: SignUpPayload): Promise<{ message: string }> {
        const role = normalizeRoleForSupabase(payload.role);
        storePendingSignup(payload);

        const { error } = await supabase.auth.signInWithOtp({
            email: payload.email,
            options: {
                shouldCreateUser: true,
                data: {
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    phone: payload.phone,
                    farmName: payload.farmName,
                    address: payload.address,
                    role,
                },
            },
        });

        if (error) {
            clearPendingSignup();
            throw new Error(error.message || 'Unable to send verification code.');
        }

        return { message: 'OTP sent' };
    },

    async resendSignupOtp(email: string): Promise<{ message: string }> {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
            },
        });

        if (error) {
            throw new Error(error.message || 'Unable to resend verification code.');
        }

        return { message: 'OTP resent' };
    },

    async verifySignupOtp(payload: VerifyOtpPayload): Promise<SignInResult> {
        try {
            let res = await supabase.auth.verifyOtp({
                email: payload.email,
                token: payload.code,
                type: 'email',
            });

            // Fallback to 'signup' confirmation type in case the Supabase project uses standard signup validation
            if (res.error) {
                const signupRes = await supabase.auth.verifyOtp({
                    email: payload.email,
                    token: payload.code,
                    type: 'signup',
                });
                if (!signupRes.error) {
                    res = signupRes;
                }
            }

            const { data, error } = res;

            if (error || !data.session) {
                throw new Error(error?.message || 'Verification failed.');
            }

            const pending = getPendingSignup(payload.email);
            if (pending?.password) {
                await apiFetch('/auth/finalize-signup', {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: data.session.user.id,
                        password: pending.password,
                        metadata: {
                            firstName: pending.firstName,
                            lastName: pending.lastName,
                            phone: pending.phone,
                            farmName: pending.farmName,
                            address: pending.address,
                            role: normalizeRoleForSupabase(pending.role),
                        },
                    }),
                });
            }

            return mapSessionToResult(data.session);
        } finally {
            clearPendingSignup();
        }
    },

    async signin(payload: SignInPayload): Promise<SignInResult> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: payload.email,
            password: payload.password,
        });

        if (error || !data.session) {
            throw new Error(error?.message || 'Unable to sign in.');
        }

        return mapSessionToResult(data.session);
    },

    async googleSignIn(idToken: string): Promise<SignInResult> {
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: idToken,
        });

        if (error || !data.session) {
            throw new Error(error?.message || 'Unable to sign in with Google.');
        }

        return mapSessionToResult(data.session);
    },

    async facebookSignIn(): Promise<void> {
        const redirectTo = `${window.location.origin}/auth/callback`;
        console.log('[Facebook Login] [auth.service] facebookSignIn() called');
        console.log('[Facebook Login] [auth.service] redirectTo:', redirectTo);

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: { redirectTo },
        });

        console.log('[Facebook Login] [auth.service] Supabase response — data:', data);
        console.log('[Facebook Login] [auth.service] Supabase response — error:', error);

        if (error) {
            console.error('[Facebook Login] [auth.service] Supabase returned an error:', error.message);
            throw new Error(error.message || 'Unable to sign in with Facebook.');
        }

        console.log('[Facebook Login] [auth.service] No error — Supabase should be redirecting the browser to:', data?.url);
    },

    async requestPasswordResetOtp(email: string): Promise<{ message: string }> {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: false,
            },
        });

        if (error) {
            throw new Error(error.message || 'Unable to send verification code.');
        }

        return { message: 'OTP sent' };
    },

    async resendPasswordResetOtp(email: string): Promise<{ message: string }> {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: false,
            },
        });

        if (error) {
            throw new Error(error.message || 'Unable to resend verification code.');
        }

        return { message: 'OTP resent' };
    },

    async verifyPasswordResetOtp(payload: VerifyOtpPayload): Promise<void> {
        const { data, error } = await supabase.auth.verifyOtp({
            email: payload.email,
            token: payload.code,
            type: 'email',
        });

        if (error || !data.session) {
            throw new Error(error?.message || 'Verification failed.');
        }

        await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        });
    },

    async resetPassword(password: string): Promise<{ message: string }> {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            throw new Error(error.message || 'Unable to reset password.');
        }

        await supabase.auth.signOut();
        return { message: 'Password reset successful' };
    },

    async submitFarmerOnboarding(payload: FarmerOnboardingPayload): Promise<{ message: string }> {
        return apiFetch('/farmer/onboarding', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    async fetchProfile(): Promise<{ role: string; firstName?: string; lastName?: string; email?: string }> {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token ?? null;

        if (!token) throw new Error('No active session for fetchProfile');

        const res = await fetch(`${API_BASE}/users/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await res.json().catch(() => ({}));

        if (!res.ok) throw new Error(result?.message || 'Failed to fetch profile');

        console.log('[fetchProfile] DB profile returned:', result); // Remove after debugging

        return result;
    },

    async signOut(): Promise<void> {
        await supabase.auth.signOut();
    },
};