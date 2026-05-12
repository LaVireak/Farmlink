import type { SignInPayload, SignInResult, SignUpPayload } from '../types/auth.type';

const mockSession = (payload: SignInPayload): SignInResult => {
    const role = payload.expectedRole ?? 'customer';
    return {
        accessToken: `mock-token-${role}-${Date.now()}`,
        user: {
            id: `mock-${role}-1`,
            email: payload.email,
            role,
            firstName: role === 'farmer' ? 'Farmer' : 'User',
            lastname: 'Demo',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    };
};

export const authService = {
    async signin(payload: SignInPayload): Promise<SignInResult> {
        // Frontend-only mode for now (backend auth endpoint not ready yet)
        return mockSession(payload);
    },

    async signup(payload: SignUpPayload): Promise<SignInResult> {
        return {
            accessToken: `mock-token-customer-${Date.now()}`,
            user: {
                id: `mock-customer-${Date.now()}`,
                email: payload.email,
                role: 'customer',
                firstName: payload.firstName,
                lastName: payload.lastName,
                lastname: payload.lastName,
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };
    },
};