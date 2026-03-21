import PublicFeedbackBoard from '../components/PublicFeedbackBoard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import {
  useGetPublicFeedbackFeedQuery,
  useGetCompanyBySlugQuery,
  type PublicFeedbackSort,
} from '../store/api/companyApi'
import type { Feedback } from '../types/feedback'
import { useAppSelector } from '../store/hooks'

function stripHtml(input: string | null | undefined) {
  if (!input) return ''
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function PublicFeedPage({ sort }: { sort: PublicFeedbackSort }) {
  const { entity, type, isAuthenticated } = useAppSelector((s) => s.auth)
  const isCompanyUser = isAuthenticated && type === 'company'
  const companySlug = isCompanyUser ? entity?.slug : undefined

  const { data, isLoading, isError } = useGetPublicFeedbackFeedQuery(sort, {
    skip: isCompanyUser,
  })
  const {
    data: companyData,
    isLoading: isCompanyLoading,
    isError: isCompanyError,
  } = useGetCompanyBySlugQuery(companySlug!, {
    skip: !isCompanyUser || !companySlug,
  })

  const actualLoading = isCompanyUser ? isCompanyLoading : isLoading
  const actualError = isCompanyUser ? isCompanyError : isError
  const feedbacks = isCompanyUser ? companyData?.feedbacks : data?.feedbacks

  if (actualLoading) {
    return <LoadingSpinner />
  }

  if (actualError) {
    return (
      <div className="p-6">
        <EmptyState />
      </div>
    )
  }

  const mappedFeedbacks: Feedback[] = feedbacks
    ? feedbacks.map((feedback: any) => {
        if (isCompanyUser) {
          // Company viewing their own feedbacks
          return {
            id: String(feedback.id),
            postId: String(feedback.id),
            title: feedback.title,
            description: stripHtml(feedback.description),
            category: feedback.feedbackType?.name,
            author: feedback.requester?.name ?? 'Anonymous',
            visibility: feedback.visibility,
            status: feedback.status,
            createdAt: feedback.createdAt,
            userVote: feedback.userVote,
            upvotes: feedback.upvotes,
            downvotes: feedback.downvotes,
            views: feedback.viewCount ?? 0,
            comments: feedback.replyCount,
            reachedTo: [
              {
                id: String(companyData!.id),
                name: companyData!.name,
                slug: companyData!.slug,
                avatar: companyData!.logoUrl ?? undefined,
              },
            ],
          }
        } else {
          // User viewing public feedbacks
          return {
            id: String(feedback.id),
            postId: String(feedback.id),
            title: feedback.title,
            description: stripHtml(feedback.description),
            category: feedback.feedbackType?.name,
            author: feedback.requester?.name ?? 'Anonymous',
            visibility: feedback.visibility,
            status: feedback.status,
            createdAt: feedback.createdAt,
            userVote: feedback.userVote,
            upvotes: feedback.upvotes,
            downvotes: feedback.downvotes,
            views: feedback.viewCount ?? 0,
            comments: feedback.replyCount,
            reachedTo: [
              {
                id: String(feedback.company.id ?? feedback.id),
                name: feedback.company.name ?? 'Company',
                slug: feedback.company.slug,
                avatar: feedback.company.logoUrl ?? undefined,
              },
            ],
          }
        }
      })
    : []

  if (!mappedFeedbacks.length) {
    return (
      <div className="p-6">
        <EmptyState />
      </div>
    )
  }

  return <PublicFeedbackBoard feedbacks={mappedFeedbacks} />
}
