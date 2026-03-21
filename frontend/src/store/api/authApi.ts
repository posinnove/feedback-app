import { apiSlice } from './apiSlice'
import type { AuthUser, AuthEntityType } from '../slices/authSlice'

export interface UnifiedLoginResponse {
  accessToken: string
  type: AuthEntityType
  user?: AuthUser
  company?: AuthUser
}

export const unifiedAuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<UnifiedLoginResponse, { email: string; password: string }>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    googleLogin: builder.mutation<
      UnifiedLoginResponse,
      { idToken: string; accountType?: AuthEntityType }
    >({
      query: (body) => ({
        url: '/auth/google-login',
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

    refreshToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
      }),
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useGoogleLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailQuery,
  useResendVerificationMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = unifiedAuthApi

export function extractEntityFromUnifiedResponse(res: UnifiedLoginResponse): AuthUser {
  return (res.type === 'user' ? res.user : res.company) as AuthUser
}
