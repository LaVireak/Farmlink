export type UserRole = 'customer' | 'farmer' | 'admin';

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
}

export interface SignInPayload {
    email: string;
    password: string;
    expectedRole?: 'farmer' | 'customer';
}

export interface SignInResult {
    user: AuthUser;
    accessToken: string;
}