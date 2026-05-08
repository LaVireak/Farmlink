import type {
    FarmerOnboardingPayload,
    SignInPayload,
    SignInResult,
    SignUpPayload,
    UserRole,
    VerifyOtpPayload,
} from '../types/auth.type';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const normalizeRoleForApi = (role?: UserRole) => (role === 'customer' ? 'consumer' : role);
const normalizeRoleFromApi = (role?: string): UserRole =>
    role === 'consumer' ? 'customer' : (role as UserRole);

const normalizeResult = (result: SignInResult): SignInResult => ({
    ...result,
    user: {
        ...result.user,
        role: normalizeRoleFromApi(result.user.role),
    },
});

const apiFetch = async <T>(path: string, options: RequestInit): Promise<T> => {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
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
        const role = normalizeRoleForApi(payload.role ?? 'customer');
        return apiFetch('/auth/signup/request-otp', {
            method: 'POST',
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
                firstName: payload.firstName,
                lastName: payload.lastName,
                role,
            }),
        });
    },

    async resendSignupOtp(email: string): Promise<{ message: string }> {
        return apiFetch('/auth/signup/resend-otp', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    async verifySignupOtp(payload: VerifyOtpPayload): Promise<SignInResult> {
        const result = await apiFetch<SignInResult>('/auth/signup/verify-otp', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        return normalizeResult(result);
    },

    async signin(payload: SignInPayload): Promise<SignInResult> {
        const result = await apiFetch<SignInResult>('/auth/signin', {
            method: 'POST',
            body: JSON.stringify({
                email: payload.email,
                password: payload.password,
            }),
        });

        return normalizeResult(result);
    },

    async submitFarmerOnboarding(payload: FarmerOnboardingPayload): Promise<{ message: string }> {
        return apiFetch('/farmers/onboarding', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },
};