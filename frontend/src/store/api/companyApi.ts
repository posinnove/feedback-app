import { apiSlice } from './apiSlice'
import type { CompanySummary, CompanyData } from '../../types/company'

interface VoteFeedbackArgs {
  slug: string
  feedbackId: number
  direction: 'up' | 'down'
}

interface VoteFeedbackResponse {
  message: string
  action: 'added' | 'removed' | 'switched'
  userVote: 'up' | 'down' | null
  feedback: {
    id: number
    upvotes: number
    downvotes: number
  }
}

interface FollowCompanyResponse {
  message: string
  followed: boolean
  followerCount: number
}

interface RequestFeedbackArgs {
  slug: string
  feedbackTypeId: number
  title: string
  description?: string
  visibility: 'public' | 'anonymous'
}

interface FeedbackTypeItem {
  id: number
  name: string
  slug: string
}

interface FeedbackTypeListResponse {
  feedbackTypes: FeedbackTypeItem[]
}

interface RequestFeedbackResponse {
  message: string
  feedback: {
    id: number
    title: string
    description: string | null
    visibility: 'public' | 'anonymous'
    feedbackType: {
      id: number
      name: string
      slug: string
    }
    status: 'planned' | 'in-progress' | 'completed' | 'under-review' | 'rejected'
    upvotes: number
    downvotes: number
    createdAt: string
  }
}

export type PublicFeedbackSort = 'trending' | 'new' | 'top' | 'all'

interface PublicFeedbackItem {
  id: number
  title: string
  description: string | null
  status: 'planned' | 'in-progress' | 'completed' | 'under-review' | 'rejected'
  upvotes: number
  downvotes: number
  viewCount: number
  replyCount: number
  visibility: 'public' | 'anonymous'
  requester: {
    id: number
    name: string
  } | null
  feedbackType: {
    id: number
    name: string
    slug: string
  } | null
  createdAt: string
  updatedAt: string
  canEdit: boolean
  userVote: 'up' | 'down' | null
  company: {
    id?: number
    name?: string
    slug?: string
    logoUrl?: string | null
  }
}

interface PublicFeedbackFeedResponse {
  feedbacks: PublicFeedbackItem[]
  meta: {
    sort: PublicFeedbackSort
    total: number
  }
}

interface PublicFeedbackResponse {
  feedback: PublicFeedbackItem
}

interface FeedbackReplyItem {
  id: number
  parentReplyId: number | null
  content: string
  upvotes: number
  downvotes: number
  createdAt: string
  updatedAt: string
  canEdit: boolean
  visibility: 'public' | 'anonymous'
  userVote: 'up' | 'down' | null
  author: {
    id: number
    type: 'user' | 'company'
    name: string
    avatarUrl?: string | null
  } | null
}

interface FeedbackRepliesResponse {
  replies: FeedbackReplyItem[]
}

interface CreateFeedbackReplyArgs {
  feedbackId: number
  content: string
  visibility: 'public' | 'anonymous'
  parentReplyId?: number
}

interface CreateFeedbackReplyResponse {
  message: string
  reply: {
    id: number
    parentReplyId: number | null
    content: string
    upvotes: number
    downvotes: number
    visibility: 'public' | 'anonymous'
    createdAt: string
    updatedAt: string
    canEdit: boolean
  }
}

interface UpdateFeedbackRequestArgs {
  feedbackId: number
  title: string
  description?: string
}

interface UpdateFeedbackRequestResponse {
  message: string
  feedback: {
    id: number
    title: string
    description: string | null
    updatedAt: string
  }
}

interface UpdateFeedbackReplyArgs {
  feedbackId: number
  replyId: number
  content: string
}

interface UpdateFeedbackReplyResponse {
  message: string
  reply: {
    id: number
    parentReplyId: number | null
    content: string
    updatedAt: string
  }
}

interface VoteReplyArgs {
  feedbackId: number
  replyId: number
  direction: 'up' | 'down'
}

interface VoteReplyResponse {
  message: string
  action: 'added' | 'removed' | 'switched'
  userVote: 'up' | 'down' | null
  reply: {
    id: number
    upvotes: number
    downvotes: number
  }
}

interface AdvancedSearchResponse {
  query: string
  companies: Array<{
    id: number
    name: string
    slug: string
    description: string | null
    logoUrl: string | null
  }>
  feedbacks: Array<{
    id: number
    title: string
    description: string | null
    status: 'planned' | 'in-progress' | 'completed' | 'under-review' | 'rejected'
    createdAt: string
    visibility: 'public' | 'anonymous'
    requester: { id: number; name: string } | null
    company: {
      id: number
      name: string
      slug: string
      logoUrl: string | null
    }
  }>
  replies: Array<{
    id: number
    content: string
    createdAt: string
    feedbackId: number
    feedbackTitle: string
    visibility: 'public' | 'anonymous'
    author: { id: number; type: 'user' | 'company'; name: string } | null
    company: {
      id: number
      name: string
      slug: string
      logoUrl: string | null
    }
  }>
}

interface UpdateFeedbackStatusArgs {
  slug: string
  feedbackId: number
  status: string
}

interface UpdateFeedbackStatusResponse {
  message: string
  feedback: {
    id: number
    status: string
  }
}

interface MarkNotificationsAsReadArgs {
  notificationIds?: number[]
}

interface MarkNotificationsAsReadResponse {
  message: string
}

const companyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompanies: builder.query<CompanySummary[], void>({
      query: () => '/companies',
      providesTags: [{ type: 'Company', id: 'LIST' }],
    }),
    getFollowedCompanies: builder.query<CompanySummary[], void>({
      query: () => '/companies/following',
      providesTags: [{ type: 'Company', id: 'FOLLOWING' }],
    }),
    getCompanyBySlug: builder.query<CompanyData, string>({
      query: (slug) => `/companies/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: 'Company', id: slug }],
    }),
    followCompany: builder.mutation<FollowCompanyResponse, string>({
      query: (slug) => ({
        url: `/companies/${slug}/follow`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, slug) => [
        { type: 'Company', id: 'LIST' },
        { type: 'Company', id: 'FOLLOWING' },
        { type: 'Company', id: slug },
      ],
    }),
    unfollowCompany: builder.mutation<FollowCompanyResponse, string>({
      query: (slug) => ({
        url: `/companies/${slug}/follow`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, slug) => [
        { type: 'Company', id: 'LIST' },
        { type: 'Company', id: 'FOLLOWING' },
        { type: 'Company', id: slug },
      ],
    }),
    voteCompanyFeedback: builder.mutation<VoteFeedbackResponse, VoteFeedbackArgs>({
      query: ({ slug, feedbackId, direction }) => ({
        url: `/companies/${slug}/feedback/${feedbackId}/vote`,
        method: 'POST',
        body: { direction },
      }),
      invalidatesTags: (_result, _error, { slug }) => [{ type: 'Company', id: slug }],
    }),
    requestCompanyFeedback: builder.mutation<RequestFeedbackResponse, RequestFeedbackArgs>({
      query: ({ slug, feedbackTypeId, title, description, visibility }) => ({
        url: `/companies/${slug}/feedback`,
        method: 'POST',
        body: { feedbackTypeId, title, description, visibility },
      }),
      invalidatesTags: (_result, _error, { slug }) => [
        { type: 'Company', id: slug },
        { type: 'Company', id: 'LIST' },
      ],
    }),
    getFeedbackTypes: builder.query<FeedbackTypeListResponse, void>({
      query: () => '/feedbacks/types',
    }),
    getPublicFeedbackFeed: builder.query<PublicFeedbackFeedResponse, PublicFeedbackSort>({
      query: (sort) => ({
        url: '/feedbacks',
        params: { sort },
      }),
    }),
    getPublicFeedbackById: builder.query<PublicFeedbackResponse, number>({
      query: (id) => `/feedbacks/${id}`,
    }),
    getFeedbackReplies: builder.query<FeedbackRepliesResponse, number>({
      query: (id) => `/feedbacks/${id}/replies`,
    }),
    createFeedbackReply: builder.mutation<CreateFeedbackReplyResponse, CreateFeedbackReplyArgs>({
      query: ({ feedbackId, content, visibility, parentReplyId }) => ({
        url: `/feedbacks/${feedbackId}/replies`,
        method: 'POST',
        body: { content, visibility, parentReplyId },
      }),
    }),
    updateFeedbackRequest: builder.mutation<
      UpdateFeedbackRequestResponse,
      UpdateFeedbackRequestArgs
    >({
      query: ({ feedbackId, title, description }) => ({
        url: `/feedbacks/${feedbackId}`,
        method: 'PATCH',
        body: { title, description },
      }),
    }),
    updateFeedbackReply: builder.mutation<UpdateFeedbackReplyResponse, UpdateFeedbackReplyArgs>({
      query: ({ feedbackId, replyId, content }) => ({
        url: `/feedbacks/${feedbackId}/replies/${replyId}`,
        method: 'PATCH',
        body: { content },
      }),
    }),
    voteFeedbackReply: builder.mutation<VoteReplyResponse, VoteReplyArgs>({
      query: ({ feedbackId, replyId, direction }) => ({
        url: `/feedbacks/${feedbackId}/replies/${replyId}/vote`,
        method: 'POST',
        body: { direction },
      }),
    }),
    advancedSearch: builder.query<AdvancedSearchResponse, string>({
      query: (query) => ({
        url: '/search',
        params: { q: query },
      }),
    }),
    getNotifications: builder.query<
      {
        notifications: Array<{
          id: number
          type: 'feedback_created' | 'reply_created' | 'reply_to_your_reply'
          title: string
          message: string | null
          feedbackId: number
          relatedReplyId: number | null
          isRead: boolean
          createdAt: string
          feedback: {
            id: number
            title: string
            status: string
            company: {
              id: number
              name: string
              slug: string
            }
          }
        }>
      },
      void
    >({
      query: () => '/notifications',
    }),
    markNotificationsAsRead: builder.mutation<
      MarkNotificationsAsReadResponse,
      MarkNotificationsAsReadArgs
    >({
      query: ({ notificationIds }) => ({
        url: '/notifications/mark-as-read',
        method: 'POST',
        body: { notificationIds },
      }),
    }),
    updateFeedbackStatus: builder.mutation<UpdateFeedbackStatusResponse, UpdateFeedbackStatusArgs>({
      query: ({ slug, feedbackId, status }) => ({
        url: `/companies/${slug}/feedback/${feedbackId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { slug }) => [{ type: 'Company', id: slug }],
    }),
  }),
})

export const {
  useGetCompaniesQuery,
  useGetFollowedCompaniesQuery,
  useGetCompanyBySlugQuery,
  useFollowCompanyMutation,
  useUnfollowCompanyMutation,
  useVoteCompanyFeedbackMutation,
  useRequestCompanyFeedbackMutation,
  useGetFeedbackTypesQuery,
  useGetPublicFeedbackFeedQuery,
  useGetPublicFeedbackByIdQuery,
  useGetFeedbackRepliesQuery,
  useCreateFeedbackReplyMutation,
  useUpdateFeedbackRequestMutation,
  useUpdateFeedbackReplyMutation,
  useVoteFeedbackReplyMutation,
  useAdvancedSearchQuery,
  useGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
  useUpdateFeedbackStatusMutation,
} = companyApi
