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
  location?: string | null
  website?: string | null
  description?: string | null
  logoUrl?: string | null
  isEmailVerified: boolean
  isApproved: boolean
  subscriberCount?: number
  createdAt: string
}

export interface AdminCompanyPayload {
  name: string
  email?: string
  location?: string
  website?: string
  description?: string
  logoUrl?: string
  isEmailVerified?: boolean
  isApproved?: boolean
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

export interface AdminFeedbackResponse {
  feedbacks: AdminFeedback[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminStats, void>({
      query: () => '/admin/stats',
      providesTags: ['Company', 'AuthUser', 'PublicFeed'],
    }),
    getAdminCompanies: builder.query<AdminCompany[], string | void>({
      query: (search) =>
        search ? `/admin/companies?search=${encodeURIComponent(search)}` : '/admin/companies',
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
    createAdminCompany: builder.mutation<{ company: AdminCompany }, AdminCompanyPayload>({
      query: (body) => ({
        url: '/admin/companies',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Company'],
    }),
    updateAdminCompany: builder.mutation<
      { company: AdminCompany },
      { id: number; body: AdminCompanyPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/companies/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Company'],
    }),
    getAdminFeedbacks: builder.query<
      AdminFeedbackResponse,
      { page?: number; limit?: number } | void
    >({
      query: (args) => {
        const params = new URLSearchParams()
        if (args && 'page' in args) params.append('page', String(args.page || 1))
        if (args && 'limit' in args) params.append('limit', String(args.limit || 20))
        return `/admin/feedbacks?${params.toString()}`
      },
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
  useCreateAdminCompanyMutation,
  useUpdateAdminCompanyMutation,
  useGetAdminFeedbacksQuery,
  useDeleteAdminFeedbackMutation,
  useDeleteAdminReplyMutation,
} = adminApi
