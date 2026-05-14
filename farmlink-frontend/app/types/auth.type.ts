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
}

export interface AuthResponse {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
}

export interface UploadedImagePayload {
    name: string;
    type: string;
    dataUrl: string;
}

export interface FarmerOnboardingPayload {
    email: string;
    phone?: string;
    address?: string;
    farmName?: string;
    tags?: string[];
    idPhoto?: UploadedImagePayload | null;
    farmDeed?: UploadedImagePayload | null;
    profilePhoto?: UploadedImagePayload | null;
}