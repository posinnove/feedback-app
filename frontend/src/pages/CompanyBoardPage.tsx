import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { IconClock } from '@tabler/icons-react'
import { useGetCompanyBySlugQuery, useVoteCompanyFeedbackMutation } from '../store/api/companyApi'
import FeedbackCard from '../components/FeedbackCard'
import CompanyInfo from '../components/CompanyInfo'
import StatsCard from '../components/StatsCard'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import NotFoundState from '../components/NotFoundState'

export default function CompanyBoardPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: company, isLoading, isError } = useGetCompanyBySlugQuery(slug!, { skip: !slug })
  const [voteFeedback] = useVoteCompanyFeedbackMutation()
  const [voteOverrides, setVoteOverrides] = useState<
    Record<number, { upvotes: number; downvotes: number }>
  >({})
  const [userVotes, setUserVotes] = useState<Record<number, 'up' | 'down' | null>>({})

  async function handleVote(feedbackId: number, direction: 'up' | 'down') {
    if (!slug) return

    try {
      const result = await voteFeedback({ slug, feedbackId, direction }).unwrap()
      setVoteOverrides((prev) => ({
        ...prev,
        [feedbackId]: {
          upvotes: result.feedback.upvotes,
          downvotes: result.feedback.downvotes,
        },
      }))
      setUserVotes((prev) => ({
        ...prev,
        [feedbackId]: result.userVote,
      }))
    } catch {
      // Keep UI unchanged on failure; API errors are handled globally by consumers.
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (isError || !company) return <NotFoundState />

  const feedbacks = company.feedbacks.map((feedback) => ({
    ...feedback,
    upvotes: voteOverrides[feedback.id]?.upvotes ?? feedback.upvotes,
    downvotes: voteOverrides[feedback.id]?.downvotes ?? feedback.downvotes ?? 0,
  }))

  return (
    <div className="bg-background">
      <div className="max-w-6xl mx-auto px-1 sm:px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 lg:gap-8">
        {/* Left column — Company info, tabs, feedback */}
        <div className="min-w-0">
          <CompanyInfo company={company} />

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {/* <button className="px-4 py-1.5 text-sm font-medium text-primary-600 bg-primary-100 rounded-full transition-colors">
              Overview
            </button> */}
            {/* <button className="px-4 py-1.5 text-sm font-medium text-base-100 hover:bg-border/50 rounded-full transition-colors">
              Posts
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-base-100 hover:bg-border/50 rounded-full transition-colors">
              Comments
            </button> */}
          </div>

          {/* Feedback list */}
          {feedbacks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-base-100 mb-2">
                <IconClock size={16} stroke={1.5} />
                Showing all content
              </div>
              {feedbacks.map((feedback) => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={{
                    id: feedback.id,
                    title: feedback.title,
                    description: feedback.description,
                    feedbackType: feedback.feedbackType?.name,
                    createdAt: feedback.createdAt,
                    upvotes: feedback.upvotes,
                    downvotes: feedback.downvotes,
                    comments: 0,
                    companyName: company.name,
                    companyAvatar: company.logoUrl ?? undefined,
                    status: feedback.status,
                  }}
                  detailHref={`/request/${feedback.id}`}
                  discussionHref={`/request/${feedback.id}#discussions`}
                  shareUrl={`${window.location.origin}/company/${slug!}/feedback/${feedback.id}`}
                  showStatus
                  userVote={userVotes[feedback.id] ?? feedback.userVote ?? null}
                  onUpvote={() => void handleVote(feedback.id, 'up')}
                  onDownvote={() => void handleVote(feedback.id, 'down')}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right column — Stats/Share card (hidden on mobile) */}
        <div className="hidden lg:block">
          <StatsCard company={{ ...company, feedbacks }} />
        </div>
      </div>
    </div>
  )
}
