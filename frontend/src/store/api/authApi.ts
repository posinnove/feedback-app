import { apiSlice } from './apiSlice'
import type { AuthUser, AuthEntityType } from '../slices/authSlice'

// ─── Shared Types ─────────────────────────────────────────────────────────────

interface AuthResponse {
    accessToken: string
    refreshToken: string
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
        // USER
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

        // COMPANY
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
    useRegisterUserMutation,
    useLoginUserMutation,
    useGetMeUserQuery,
    useVerifyEmailUserQuery,
    useResendVerificationUserMutation,
    useForgotPasswordUserMutation,
    useResetPasswordUserMutation,
    useRegisterCompanyMutation,
    useLoginCompanyMutation,
    useGetMeCompanyQuery,
    useVerifyEmailCompanyQuery,
    useResendVerificationCompanyMutation,
    useForgotPasswordCompanyMutation,
    useResetPasswordCompanyMutation,
} = authApi

// Helper to detect entity type from the combined login response
export function extractEntityFromResponse(
    res: AuthResponse,
    intendedType: AuthEntityType,
): AuthUser {
    return (intendedType === 'user' ? res.user : res.company) as AuthUser
}
