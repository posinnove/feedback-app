import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { IconClock, IconTrendingUp } from '@tabler/icons-react'
import { useGetCompanyBySlugQuery, useVoteCompanyFeedbackMutation } from '../store/api/companyApi'
import { SEOHead } from '../components/SEOHead'
import FeedbackCard from '../components/FeedbackCard'
import CompanyInfo from '../components/CompanyInfo'
import StatsCard from '../components/StatsCard'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import NotFoundState from '../components/NotFoundState'
import { Button } from '../components/ui/button'
import { useAppSelector } from '../store/hooks'
import { getGuestVote, recordGuestVote, removeGuestVote } from '../utils/guestVotes'
import { companySEO } from '../utils/seoHelpers'

export default function CompanyBoardPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: company, isLoading, isError } = useGetCompanyBySlugQuery(slug!, { skip: !slug })
  const [activeSort, setActiveSort] = useState<'new' | 'top' | 'trending'>('new')
  const [voteFeedback] = useVoteCompanyFeedbackMutation()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const [voteOverrides, setVoteOverrides] = useState<
    Record<number, { upvotes: number; downvotes: number }>
  >({})
  const [userVotes, setUserVotes] = useState<Record<number, 'up' | 'down' | null>>({})

  async function handleVote(feedbackId: number, direction: 'up' | 'down') {
    if (!slug) return

    const currentFeedback = feedbacks.find((item) => item.id === feedbackId)
    if (!currentFeedback) return

    if (!isAuthenticated) {
      const guestVoteKey = `feedback:${feedbackId}`
      const existingGuestVote = getGuestVote(guestVoteKey)
      if (existingGuestVote) {
        const nextUpvotes =
          existingGuestVote === 'up'
            ? Math.max(0, currentFeedback.upvotes - 1)
            : currentFeedback.upvotes
        const nextDownvotes =
          existingGuestVote === 'down'
            ? Math.max(0, (currentFeedback.downvotes ?? 0) - 1)
            : (currentFeedback.downvotes ?? 0)

        setVoteOverrides((prev) => ({
          ...prev,
          [feedbackId]: {
            upvotes: nextUpvotes,
            downvotes: nextDownvotes,
          },
        }))
        setUserVotes((prev) => ({
          ...prev,
          [feedbackId]: null,
        }))
        removeGuestVote(guestVoteKey)
        return
      }
    }

    try {
      const result = await voteFeedback({ slug, feedbackId, direction }).unwrap()
      if (!isAuthenticated) {
        recordGuestVote(`feedback:${feedbackId}`, direction)
      }
      setVoteOverrides((prev) => ({
        ...prev,
        [feedbackId]: {
          upvotes: result.feedback.upvotes,
          downvotes: result.feedback.downvotes,
        },
      }))
      setUserVotes((prev) => ({
        ...prev,
        [feedbackId]: !isAuthenticated ? direction : result.userVote,
      }))
    } catch {
      // Keep UI unchanged on failure; API errors are handled globally by consumers.
    }
  }

  const feedbacks = (company?.feedbacks ?? []).map((feedback) => ({
    ...feedback,
    upvotes: voteOverrides[feedback.id]?.upvotes ?? feedback.upvotes,
    downvotes: voteOverrides[feedback.id]?.downvotes ?? feedback.downvotes ?? 0,
  }))

  const sortedFeedbacks = (() => {
    const withScore = feedbacks.map((feedback) => {
      const createdAtMs = feedback.createdAt ? new Date(feedback.createdAt).getTime() : 0
      const netVotes = feedback.upvotes - (feedback.downvotes ?? 0)
      const recencySignal = createdAtMs > 0 ? createdAtMs / 1_000_000_000_000 : 0
      const trendingScore = netVotes * 2 + (feedback.replyCount ?? 0) * 1.5 + recencySignal

      return {
        feedback,
        createdAtMs,
        netVotes,
        trendingScore,
      }
    })

    if (activeSort === 'new') {
      return withScore.sort((a, b) => b.createdAtMs - a.createdAtMs).map((item) => item.feedback)
    }

    if (activeSort === 'top') {
      return withScore
        .sort((a, b) => b.netVotes - a.netVotes || b.feedback.upvotes - a.feedback.upvotes)
        .map((item) => item.feedback)
    }

    return withScore.sort((a, b) => b.trendingScore - a.trendingScore).map((item) => item.feedback)
  })()

  if (isLoading) return <LoadingSpinner />
  if (isError || !company) return <NotFoundState />

  return (
    <>
      <SEOHead seo={companySEO(company.name, company.slug, company.description ?? undefined)} />
      <div data-gsap-page className="bg-background">
        <div className="max-w-6xl mx-auto px-1 sm:px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 lg:gap-8">
          {/* Left column — Company info, tabs, feedback */}
          <div className="min-w-0">
            <CompanyInfo company={company} />

            {/* Mobile stats card */}
            <div className="lg:hidden mb-5">
              <Link
                to={`/request-feedback?company=${encodeURIComponent(company.slug)}`}
                className="inline-flex w-full mb-3 h-9 items-center justify-center rounded-lg bg-primary-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
                aria-label={`Provide feedback for ${company.name}`}
              >
                Provide Feedback
              </Link>
              <StatsCard company={{ ...company, feedbacks }} />
            </div>

            {/* Sorting tabs */}
            <div className="mb-6">
              <div className="flex items-center gap-2 border border-border bg-card-bg px-2 py-2 rounded-xl overflow-x-auto">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveSort('new')}
                  className={`h-auto flex items-center gap-1.5 px-4 py-2 text-sm transition-colors shrink-0 ${
                    activeSort === 'new'
                      ? 'bg-border text-base-200 font-semibold'
                      : 'hover:bg-sidebar-bg text-base-100 hover:text-base-200 font-medium'
                  }`}
                >
                  <IconClock size={16} stroke={2} /> New
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveSort('top')}
                  className={`h-auto flex items-center gap-1.5 px-4 py-2 text-sm transition-colors shrink-0 ${
                    activeSort === 'top'
                      ? 'bg-border text-base-200 font-semibold'
                      : 'hover:bg-sidebar-bg text-base-100 hover:text-base-200 font-medium'
                  }`}
                >
                  <IconTrendingUp size={16} stroke={2} /> Top
                </Button>
                {/* <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setActiveSort('trending')}
                className={`h-auto flex items-center gap-1.5 px-4 py-2 text-sm transition-colors shrink-0 ${
                  activeSort === 'trending'
                    ? 'bg-border text-base-200 font-semibold'
                    : 'hover:bg-sidebar-bg text-base-100 hover:text-base-200 font-medium'
                }`}
              >
                <IconFlame size={16} stroke={2} /> Trending
              </Button> */}
              </div>
            </div>

            {/* Feedback list */}
            {feedbacks.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-base-100 mb-2">
                  <IconClock size={16} stroke={1.5} />
                  Showing {activeSort} content
                </div>
                {sortedFeedbacks.map((feedback) => (
                  <FeedbackCard
                    key={feedback.id}
                    feedback={{
                      id: feedback.id,
                      title: feedback.title,
                      description: feedback.description,
                      authorName: feedback.requester?.name ?? 'Anonymous',
                      feedbackType: feedback.feedbackType?.name,
                      createdAt: feedback.createdAt,
                      upvotes: feedback.upvotes,
                      downvotes: feedback.downvotes,
                      comments: feedback.replyCount ?? 0,
                      companyName: company.name,
                      companyAvatar: company.logoUrl ?? undefined,
                      companySlug: company.slug,
                      companyIsApproved: company.isApproved,
                      status: feedback.status,
                    }}
                    detailHref={`/request/${feedback.id}`}
                    discussionHref={`/request/${feedback.id}#discussions`}
                    shareUrl={`${window.location.origin}/${slug!}/feedback/${feedback.id}`}
                    showStatus
                    userVote={
                      userVotes[feedback.id] ??
                      (!isAuthenticated ? getGuestVote(`feedback:${feedback.id}`) : null) ??
                      feedback.userVote ??
                      null
                    }
                    onUpvote={() => void handleVote(feedback.id, 'up')}
                    onDownvote={() => void handleVote(feedback.id, 'down')}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right column — Stats/Share card (hidden on mobile) */}
          <div className="hidden lg:block">
            <Link
              to={`/request-feedback?company=${encodeURIComponent(company.slug)}`}
              className="inline-flex w-full mb-3 h-9 items-center justify-center rounded-lg bg-primary-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
              aria-label={`Provide feedback for ${company.name}`}
            >
              Provide Feedback
            </Link>
            <StatsCard company={{ ...company, feedbacks }} />
          </div>
        </div>
      </div>
    </>
  )
}
