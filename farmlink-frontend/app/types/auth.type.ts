export type UserRole = 'consumer' | 'farmer' | 'admin';

export interface AuthUser {
    id: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    lastname?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SignUpPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: 'customer' | 'farmer';
}

export interface VerifyOtpPayload {
    email: string;
    code: string;
}

export interface SignInPayload {
    email: string;
    password: string;
    expectedRole?: 'farmer' | 'consumer';
}

export interface AuthResponse {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
}