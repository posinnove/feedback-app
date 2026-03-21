import { apiSlice } from './apiSlice'
import type { AuthUser } from '../slices/authSlice'

interface RegisterResult {
  message: string
  data: { id: number; email: string }
}

export interface CompanyRegisterInput {
  name: string
  email: string
  password: string
}

export interface CompanyProfileUpdateInput {
  name: string
  location?: string
  website?: string
  description?: string
  logoUrl?: string
}

export interface SettingsUpdateInput {
  emailNotifications: boolean
  weeklyDigest: boolean
  publicProfile: boolean
  themeMode: 'system' | 'light' | 'dark'
}

export interface PasswordUpdateInput {
  currentPassword: string
  newPassword: string
}

export const companyAuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerCompany: builder.mutation<RegisterResult, CompanyRegisterInput>({
      query: (body) => ({
        url: '/auth/companies/register',
        method: 'POST',
        body,
      }),
    }),

    getMeCompany: builder.query<AuthUser, void>({
      query: () => '/auth/companies/me',
    }),

    updateMeCompanyProfile: builder.mutation<AuthUser, CompanyProfileUpdateInput>({
      query: (body) => ({
        url: '/auth/companies/me/profile',
        method: 'PUT',
        body,
      }),
    }),

    updateMeCompanySettings: builder.mutation<AuthUser, SettingsUpdateInput>({
      query: (body) => ({
        url: '/auth/companies/me/settings',
        method: 'PUT',
        body,
      }),
    }),

    updateMeCompanyPassword: builder.mutation<{ message: string }, PasswordUpdateInput>({
      query: (body) => ({
        url: '/auth/companies/me/password',
        method: 'PUT',
        body,
      }),
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

    resetPasswordCompany: builder.mutation<
      { message: string },
      { token: string; password: string }
    >({
      query: (body) => ({
        url: '/auth/companies/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useRegisterCompanyMutation,
  useGetMeCompanyQuery,
  useUpdateMeCompanyProfileMutation,
  useUpdateMeCompanySettingsMutation,
  useUpdateMeCompanyPasswordMutation,
  useVerifyEmailCompanyQuery,
  useResendVerificationCompanyMutation,
  useForgotPasswordCompanyMutation,
  useResetPasswordCompanyMutation,
} = companyAuthApi
