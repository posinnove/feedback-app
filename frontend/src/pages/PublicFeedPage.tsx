import PublicFeedbackBoard from '../components/PublicFeedbackBoard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { useGetPublicFeedbackFeedQuery, type PublicFeedbackSort } from '../store/api/companyApi'
import type { Feedback } from '../types/feedback'

export default function PublicFeedPage({ sort }: { sort: PublicFeedbackSort }) {
  const { data, isLoading, isError } = useGetPublicFeedbackFeedQuery(sort)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <div className="p-6">
        <EmptyState />
      </div>
    )
  }

  const mappedFeedbacks: Feedback[] = (data?.feedbacks ?? []).map((feedback) => ({
    id: String(feedback.id),
    postId: String(feedback.id),
    title: feedback.title,
    description: feedback.description ?? '',
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
        isApproved: feedback.company.isApproved,
      },
    ],
  }))

  if (!mappedFeedbacks.length) {
    return (
      <div className="p-6">
        <EmptyState />
      </div>
    )
  }

  return <PublicFeedbackBoard feedbacks={mappedFeedbacks} />
}
