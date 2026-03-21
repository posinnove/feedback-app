import { apiSlice } from './apiSlice'
import type { AuthUser } from '../slices/authSlice'

interface RegisterResult {
  message: string
  data: { id: number; email: string }
}

export interface UserRegisterInput {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface UserProfileUpdateInput {
  firstName: string
  lastName: string
  avatarUrl?: string
  phoneNumber?: string
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

    updateMeUserProfile: builder.mutation<AuthUser, UserProfileUpdateInput>({
      query: (body) => ({
        url: '/auth/users/me/profile',
        method: 'PUT',
        body,
      }),
    }),

    updateMeUserSettings: builder.mutation<AuthUser, SettingsUpdateInput>({
      query: (body) => ({
        url: '/auth/users/me/settings',
        method: 'PUT',
        body,
      }),
    }),

    updateMeUserPassword: builder.mutation<{ message: string }, PasswordUpdateInput>({
      query: (body) => ({
        url: '/auth/users/me/password',
        method: 'PUT',
        body,
      }),
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
  useUpdateMeUserProfileMutation,
  useUpdateMeUserSettingsMutation,
  useUpdateMeUserPasswordMutation,
  useVerifyEmailUserQuery,
  useResendVerificationUserMutation,
  useForgotPasswordUserMutation,
  useResetPasswordUserMutation,
} = userAuthApi
