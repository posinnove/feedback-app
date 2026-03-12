import { apiSlice } from './apiSlice'
import type { AuthUser } from '../slices/authSlice'

interface RegisterResult {
    message: string
    data: { id: number; email: string }
}

export interface UserRegisterInput {
    username: string
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber?: string
}

export const userAuthApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        registerUser: builder.mutation<RegisterResult, UserRegisterInput>({
            query: (body) => ({
                url: '/auth/users/register',
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
    }),
})

export const {
    useRegisterUserMutation,
    useGetMeUserQuery,
    useVerifyEmailUserQuery,
    useResendVerificationUserMutation,
    useForgotPasswordUserMutation,
    useResetPasswordUserMutation,
} = userAuthApi
