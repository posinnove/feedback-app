import { apiSlice } from './apiSlice'

export interface AdminStats {
  totalUsers: number
  totalCompanies: number
  totalFeedbacks: number
  totalReplies: number
}

export interface AdminCompany {
  id: number
  name: string
  slug: string
  email: string
  isEmailVerified: boolean
  isApproved: boolean
  createdAt: string
}

export interface AdminFeedback {
  id: number
  title: string
  content: string
  upvotes: number
  downvotes: number
  viewCount: number
  status: string
  createdAt: string
  company?: {
    name: string
    slug: string
  }
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminStats, void>({
      query: () => '/admin/stats',
      providesTags: ['Company', 'AuthUser', 'PublicFeed'],
    }),
    getAdminCompanies: builder.query<AdminCompany[], string | void>({
      query: (search) => search ? `/admin/companies?search=${encodeURIComponent(search)}` : '/admin/companies',
      providesTags: ['Company'],
    }),
    verifyAdminCompany: builder.mutation<void, { id: number; status: boolean }>({
      query: ({ id, status }) => ({
        url: `/admin/companies/${id}/verify`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Company'],
    }),
    deleteAdminCompany: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/companies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Company'],
    }),
    getAdminFeedbacks: builder.query<AdminFeedback[], void>({
      query: () => '/admin/feedbacks',
      providesTags: ['PublicFeed'],
    }),
    deleteAdminFeedback: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/feedbacks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PublicFeed'],
    }),
    deleteAdminReply: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/replies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PublicFeed'],
    }),
  }),
})

export const {
  useGetAdminStatsQuery,
  useGetAdminCompaniesQuery,
  useVerifyAdminCompanyMutation,
  useDeleteAdminCompanyMutation,
  useGetAdminFeedbacksQuery,
  useDeleteAdminFeedbackMutation,
  useDeleteAdminReplyMutation,
} = adminApi
