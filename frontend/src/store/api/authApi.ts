import { apiSlice } from './apiSlice'
import type { AuthUser, AuthEntityType } from '../slices/authSlice'

// ─── Shared Types ─────────────────────────────────────────────────────────────

interface AuthResponse {
    accessToken: string
    refreshToken: string
    user?: AuthUser
    company?: AuthUser
}

// Unified login response — backend always includes `type` so frontend never guesses
export interface UnifiedLoginResponse {
    accessToken: string
    refreshToken: string
    type: AuthEntityType
    user?: AuthUser
    company?: AuthUser
}

interface RegisterResult {
    message: string
    data: { id: number; email: string }
}

// ─── User Auth ────────────────────────────────────────────────────────────────

export interface UserRegisterInput {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber?: string
}

export interface UserLoginInput {
    email: string
    password: string
}

// ─── Company Auth ─────────────────────────────────────────────────────────────

export interface CompanyRegisterInput {
    name: string
    email: string
    password: string
    location?: string
    website?: string
    description?: string
}

export interface CompanyLoginInput {
    email: string
    password: string
}

// ─── API Slice ────────────────────────────────────────────────────────────────

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ── Unified (single-form) ────────────────────────────────────────────
        login: builder.mutation<UnifiedLoginResponse, { email: string; password: string }>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
        }),

        forgotPassword: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body,
            }),
        }),

        resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
            query: (body) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body,
            }),
        }),

        verifyEmail: builder.query<{ message: string }, string>({
            query: (token) => `/auth/verify-email?token=${token}`,
        }),

        resendVerification: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({
                url: '/auth/resend-verification',
                method: 'POST',
                body,
            }),
        }),

        refreshToken: builder.mutation<{ accessToken: string; refreshToken: string }, { refreshToken: string }>({
            query: (body) => ({
                url: '/auth/refresh-token',
                method: 'POST',
                body,
            }),
        }),

        // ── User (type-specific — still used by registration) ───────────────
        registerUser: builder.mutation<RegisterResult, UserRegisterInput>({
            query: (body) => ({
                url: '/auth/users/register',
                method: 'POST',
                body,
            }),
        }),

        loginUser: builder.mutation<AuthResponse, UserLoginInput>({
            query: (body) => ({
                url: '/auth/users/login',
                method: 'POST',
                body,
            }),
        }),

        getMeUser: builder.query<AuthUser, void>({
            query: () => '/auth/users/me',
        }),

        verifyEmailUser: builder.query<{ message: string }, string>({
            query: (token) => `/auth/users/verify-email?token=${token}`,
        }),

        resendVerificationUser: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({
                url: '/auth/users/resend-verification',
                method: 'POST',
                body,
            }),
        }),

        forgotPasswordUser: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({
                url: '/auth/users/forgot-password',
                method: 'POST',
                body,
            }),
        }),

        resetPasswordUser: builder.mutation<{ message: string }, { token: string; password: string }>({
            query: (body) => ({
                url: '/auth/users/reset-password',
                method: 'POST',
                body,
            }),
        }),

        // ── Company (type-specific — still used by registration) ────────────
        registerCompany: builder.mutation<RegisterResult, CompanyRegisterInput>({
            query: (body) => ({
                url: '/auth/companies/register',
                method: 'POST',
                body,
            }),
        }),

        loginCompany: builder.mutation<AuthResponse, CompanyLoginInput>({
            query: (body) => ({
                url: '/auth/companies/login',
                method: 'POST',
                body,
            }),
        }),

        getMeCompany: builder.query<AuthUser, void>({
            query: () => '/auth/companies/me',
        }),

        verifyEmailCompany: builder.query<{ message: string }, string>({
            query: (token) => `/auth/companies/verify-email?token=${token}`,
        }),

        resendVerificationCompany: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({
                url: '/auth/companies/resend-verification',
                method: 'POST',
                body,
            }),
        }),

        forgotPasswordCompany: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({
                url: '/auth/companies/forgot-password',
                method: 'POST',
                body,
            }),
        }),

        resetPasswordCompany: builder.mutation<{ message: string }, { token: string; password: string }>({
            query: (body) => ({
                url: '/auth/companies/reset-password',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: false,
})

export const {
    // Unified
    useLoginMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useVerifyEmailQuery,
    useResendVerificationMutation,
    useRefreshTokenMutation,
    // User
    useRegisterUserMutation,
    useLoginUserMutation,
    useGetMeUserQuery,
    useVerifyEmailUserQuery,
    useResendVerificationUserMutation,
    useForgotPasswordUserMutation,
    useResetPasswordUserMutation,
    // Company
    useRegisterCompanyMutation,
    useLoginCompanyMutation,
    useGetMeCompanyQuery,
    useVerifyEmailCompanyQuery,
    useResendVerificationCompanyMutation,
    useForgotPasswordCompanyMutation,
    useResetPasswordCompanyMutation,
} = authApi

// Helper to extract entity from a unified login response
export function extractEntityFromUnifiedResponse(res: UnifiedLoginResponse): AuthUser {
    return (res.type === 'user' ? res.user : res.company) as AuthUser
}

// Legacy helper kept for backward compatibility
export function extractEntityFromResponse(
    res: { user?: AuthUser; company?: AuthUser },
    intendedType: AuthEntityType,
): AuthUser {
    return (intendedType === 'user' ? res.user : res.company) as AuthUser
}
