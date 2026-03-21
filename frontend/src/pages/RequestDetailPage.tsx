import { useParams, Link, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { IconMessageCircle, IconArrowLeft, IconShare3 } from '@tabler/icons-react'
import Avatar from '../components/ui/Avatar'
import SafeHtml from '../components/SafeHtml'
import { formatDate } from '../utils/formatDate'
import NotFoundState from '../components/NotFoundState'
import StatusBadge from '../components/ui/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import VoteButtons from '../components/ui/VoteButtons'
import {
  useCreateFeedbackReplyMutation,
  useGetFeedbackRepliesQuery,
  useGetPublicFeedbackByIdQuery,
  useVoteFeedbackReplyMutation,
  useVoteCompanyFeedbackMutation,
} from '../store/api/companyApi'
import { useAppSelector } from '../store/hooks'

function getOptimisticVoteOutcome(
  upvotes: number,
  downvotes: number,
  currentVote: 'up' | 'down' | null,
  nextDirection: 'up' | 'down'
) {
  if (currentVote === nextDirection) {
    return {
      upvotes: upvotes - (nextDirection === 'up' ? 1 : 0),
      downvotes: downvotes - (nextDirection === 'down' ? 1 : 0),
      userVote: null,
    }
  }

  if (currentVote === null) {
    return {
      upvotes: upvotes + (nextDirection === 'up' ? 1 : 0),
      downvotes: downvotes + (nextDirection === 'down' ? 1 : 0),
      userVote: nextDirection,
    }
  }

  return {
    upvotes: upvotes + (nextDirection === 'up' ? 1 : -1),
    downvotes: downvotes + (nextDirection === 'down' ? 1 : -1),
    userVote: nextDirection,
  }
}

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [replyDraft, setReplyDraft] = useState('')
  const [replyVisibility, setReplyVisibility] = useState<'public' | 'anonymous' | null>(null)
  const [replyingTo, setReplyingTo] = useState<{ id: number; authorName: string } | null>(null)
  const [replyError, setReplyError] = useState<string | null>(null)
  const [voteOverride, setVoteOverride] = useState<{
    upvotes: number
    downvotes: number
    userVote: 'up' | 'down' | null
  } | null>(null)

  const feedbackId = Number.parseInt(id ?? '', 10)
  const { data, isLoading, isError } = useGetPublicFeedbackByIdQuery(feedbackId, {
    skip: !Number.isFinite(feedbackId) || feedbackId <= 0,
  })
  const {
    data: repliesData,
    isLoading: isLoadingReplies,
    refetch: refetchReplies,
  } = useGetFeedbackRepliesQuery(feedbackId, {
    skip: !Number.isFinite(feedbackId) || feedbackId <= 0,
  })
  const [createReply, { isLoading: isPostingReply }] = useCreateFeedbackReplyMutation()
  const [voteFeedback] = useVoteCompanyFeedbackMutation()
  const [voteReply] = useVoteFeedbackReplyMutation()
  const [replyVoteState, setReplyVoteState] = useState<
    Record<number, { upvotes: number; downvotes: number; userVote: 'up' | 'down' | null }>
  >({})

  const replies = useMemo(() => repliesData?.replies ?? [], [repliesData?.replies])

  const repliesByParent = useMemo(() => {
    const grouped = new Map<number | null, typeof replies>()
    for (const reply of replies) {
      const parent = reply.parentReplyId ?? null
      const current = grouped.get(parent) ?? []
      current.push(reply)
      grouped.set(parent, current)
    }
    return grouped
  }, [replies])

  useEffect(() => {
    if (location.hash === '#discussions') {
      setTimeout(() => {
        document.getElementById('discussions')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }
  }, [location])

  const feedback = data?.feedback

  if (!Number.isFinite(feedbackId) || feedbackId <= 0) {
    return <NotFoundState />
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError || !feedback) {
    return <NotFoundState />
  }

  const companyName = feedback.company?.name || 'a company'
  const requesterName = feedback.requester?.name ?? 'Anonymous'
  const displayedUpvotes = voteOverride?.upvotes ?? feedback.upvotes
  const displayedDownvotes = voteOverride?.downvotes ?? feedback.downvotes
  const userVote = voteOverride?.userVote ?? feedback.userVote ?? null

  async function handleVote(direction: 'up' | 'down') {
    if (!feedback) return
    const companySlug = feedback.company?.slug
    if (!companySlug) return

    const previousOverride = voteOverride
    const currentVote = voteOverride?.userVote ?? feedback.userVote ?? null
    const optimistic = getOptimisticVoteOutcome(
      displayedUpvotes,
      displayedDownvotes,
      currentVote,
      direction
    )

    setVoteOverride(optimistic)

    try {
      const result = await voteFeedback({
        slug: companySlug,
        feedbackId,
        direction,
      }).unwrap()

      setVoteOverride({
        upvotes: result.feedback.upvotes,
        downvotes: result.feedback.downvotes,
        userVote: result.userVote,
      })
    } catch {
      setVoteOverride(previousOverride)
    }
  }

  async function handleReplySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setReplyError(null)

    const content = replyDraft.trim()
    if (content.length < 2) {
      setReplyError('Reply must be at least 2 characters long')
      return
    }

    if (!isAuthenticated) {
      setReplyError('You must be logged in to reply')
      return
    }

    if (!replyVisibility) {
      setReplyError('Please choose visibility for your reply')
      return
    }

    try {
      await createReply({
        feedbackId,
        content,
        visibility: replyVisibility,
        parentReplyId: replyingTo?.id,
      }).unwrap()
      setReplyDraft('')
      setReplyVisibility(null)
      setReplyingTo(null)
      await refetchReplies()
    } catch {
      setReplyError('Failed to post reply. Please try again.')
    }
  }

  async function handleReplyVote(replyId: number, direction: 'up' | 'down') {
    try {
      const result = await voteReply({ feedbackId, replyId, direction }).unwrap()
      setReplyVoteState((prev) => ({
        ...prev,
        [replyId]: {
          upvotes: result.reply.upvotes,
          downvotes: result.reply.downvotes,
          userVote: result.userVote,
        },
      }))
    } catch {
      // Keep UI unchanged on vote failure.
    }
  }

  function renderReplies(parentReplyId: number | null, depth = 0): React.ReactNode {
    const items = repliesByParent.get(parentReplyId) ?? []
    return items.map((reply) => {
      const vote = replyVoteState[reply.id]
      const upvotes = vote?.upvotes ?? reply.upvotes
      const downvotes = vote?.downvotes ?? reply.downvotes
      const userVote = vote?.userVote ?? reply.userVote ?? null
      const authorName = reply.author?.name ?? 'Anonymous'
      const authorAvatar = reply.author?.avatarUrl ?? undefined

      return (
        <div key={reply.id} className={depth > 0 ? 'ml-8 mt-4' : ''}>
          <div className="flex gap-3">
            <Avatar name={authorName} avatar={authorAvatar} size="sm" />
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs mb-1.5">
                <span className="font-bold text-base-200">{authorName}</span>
                {reply.visibility === 'anonymous' ? (
                  <span className="bg-border text-base-100 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                    Anonymous
                  </span>
                ) : null}
                {reply.author?.type === 'company' ? (
                  <span className="bg-primary-100 text-primary-800 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                    Company
                  </span>
                ) : null}
                <span className="text-base-100">· {formatDate(reply.createdAt)}</span>
              </div>
              <SafeHtml
                html={reply.content}
                className="text-sm text-base-200 leading-relaxed mb-2"
              />
              <div className="flex items-center gap-2">
                <VoteButtons
                  upvotes={upvotes}
                  downvotes={downvotes}
                  userVote={userVote}
                  onUpvote={() => void handleReplyVote(reply.id, 'up')}
                  onDownvote={() => void handleReplyVote(reply.id, 'down')}
                />
                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo({ id: reply.id, authorName })
                    setReplyError(null)
                    document.getElementById('reply-input')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="cursor-pointer text-xs font-medium text-base-100 hover:text-base-200 transition-colors"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
          {renderReplies(reply.id, depth + 1)}
        </div>
      )
    })
  }

  return (
    <div className="flex-1 bg-background min-h-screen">
      <div className="mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Back button */}
        <Link
          to="/feed"
          className="inline-flex items-center gap-2 text-sm font-medium text-base-100 hover:text-base-200 mb-6 transition-colors"
        >
          <IconArrowLeft size={16} stroke={2} />
          Back to Feed
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="min-w-0">
            {/* Request Post */}
            <div className="bg-card-bg border border-border rounded-xl overflow-hidden p-0 shadow-none mb-6">
              <div className="p-5 sm:p-6 lg:p-8 flex flex-col min-w-0">
                {/* Post Meta */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-base-100">
                    <Avatar
                      name={companyName}
                      avatar={feedback.company?.logoUrl ?? undefined}
                      size="sm"
                    />
                    <span className="truncate">
                      <span className="font-semibold text-base-200">{companyName}</span>
                      <span className="mx-1">-</span>
                      requested by{' '}
                      <span className="font-semibold text-base-200">{requesterName}</span>
                    </span>
                    <span>·</span>
                    <span className="shrink-0">{formatDate(feedback.createdAt)}</span>
                  </div>
                  {feedback.status && <StatusBadge status={feedback.status} />}
                </div>

                {/* Content */}
                <h1 className="text-xl sm:text-2xl font-extrabold text-base-200 mb-4 leading-snug">
                  {feedback.title}
                </h1>

                {feedback.feedbackType ? (
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-primary-100 text-primary-700 px-2 py-0.5 text-xs font-semibold">
                      {feedback.feedbackType.name}
                    </span>
                  </div>
                ) : null}

                {feedback.description && (
                  <SafeHtml
                    html={feedback.description}
                    className="text-base text-base-100 leading-relaxed space-y-4 mb-6"
                  />
                )}

                {/* Action Footer */}
                <div className="flex items-center gap-3 pt-4 border-t border-border mt-auto">
                  <VoteButtons
                    upvotes={displayedUpvotes}
                    downvotes={displayedDownvotes}
                    userVote={userVote}
                    onUpvote={() => void handleVote('up')}
                    onDownvote={() => void handleVote('down')}
                  />

                  <button
                    onClick={() => {
                      document.getElementById('discussions')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="flex items-center cursor-pointer gap-1.5 hover:bg-sidebar-bg px-3 py-2 rounded-lg transition-colors text-sm font-medium text-base-100 hover:text-base-200"
                  >
                    <IconMessageCircle size={20} stroke={1.5} />
                    <span>{replies.length} Replies</span>
                  </button>

                  <button className="flex items-center cursor-pointer gap-1.5 hover:bg-sidebar-bg px-3 py-2 rounded-lg transition-colors text-sm font-medium text-base-100 hover:text-base-200">
                    <IconShare3 size={20} stroke={1.5} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div
              id="discussions"
              className="bg-card-bg border border-border rounded-xl p-5 sm:p-6 lg:p-8 shadow-none xl:mt-0"
            >
              <h3 className="text-lg font-bold text-base-200 mb-6">
                Discussion ({replies.length})
              </h3>

              {/* Comment Input */}
              <form
                id="reply-input"
                onSubmit={handleReplySubmit}
                className="flex gap-3 text-sm mb-8"
              >
                <Avatar name="Current User" size="md" />
                <div className="flex-1 bg-sidebar-bg border border-border focus-within:border-primary-600/50 focus-within:ring-2 focus-within:ring-primary-600/20 rounded-xl overflow-hidden transition-all">
                  {replyingTo ? (
                    <div className="px-3 pt-2 text-xs text-base-100 flex items-center justify-between">
                      <span>Replying to {replyingTo.authorName}</span>
                      <button
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="cursor-pointer text-base-100 hover:text-base-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : null}
                  <textarea
                    value={replyDraft}
                    onChange={(event) => setReplyDraft(event.target.value)}
                    className="w-full bg-transparent p-3 outline-none resize-none min-h-20"
                    placeholder="What are your thoughts?"
                  />
                  <div className="px-3 pb-2">
                    <div className="text-xs text-base-100 mb-1">Reply visibility</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setReplyVisibility('anonymous')}
                        className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                          replyVisibility === 'anonymous'
                            ? 'border-primary-600 bg-primary-100 text-primary-700'
                            : 'border-border text-base-200 hover:bg-border/50'
                        }`}
                      >
                        Anonymous
                      </button>
                      <button
                        type="button"
                        onClick={() => setReplyVisibility('public')}
                        className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                          replyVisibility === 'public'
                            ? 'border-primary-600 bg-primary-100 text-primary-700'
                            : 'border-border text-base-200 hover:bg-border/50'
                        }`}
                      >
                        Public
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end p-2 bg-card-bg border-t border-border">
                    <button
                      type="submit"
                      disabled={isPostingReply || replyDraft.trim().length < 2 || !replyVisibility}
                      className="cursor-pointer btn btn-primary flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </form>

              {replyError ? <p className="text-sm text-red-500 mb-4">{replyError}</p> : null}

              <div className="space-y-6">
                {isLoadingReplies ? (
                  <p className="text-sm text-base-100">Loading replies...</p>
                ) : replies.length === 0 ? (
                  <p className="text-sm text-base-100">No replies yet. Be the first to reply.</p>
                ) : (
                  renderReplies(null)
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="hidden lg:block space-y-4">
            <div className="bg-card-bg border border-border rounded-xl p-5 shadow-none sticky top-6">
              <h3 className="text-sm font-bold text-base-200 mb-4 uppercase tracking-wider text-[11px]">
                About the Request
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-xs text-base-100 mb-1">Company</div>
                  <div className="font-medium text-base-200 flex items-center gap-2">
                    <Avatar
                      name={companyName}
                      avatar={feedback.company?.logoUrl ?? undefined}
                      size="sm"
                    />
                    {companyName}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-base-100 mb-1">Requester</div>
                  <div className="font-medium text-base-200 flex items-center gap-2">
                    <Avatar name={requesterName} size="sm" />
                    {requesterName}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-base-100 mb-1">Engagement</div>
                  <div className="grid grid-cols-3 gap-2 mt-2 border border-border rounded-lg p-2 bg-sidebar-bg text-center">
                    <div>
                      <div className="font-bold text-base-200">{displayedUpvotes}</div>
                      <div className="text-[10px] text-base-100 uppercase mt-0.5">Votes</div>
                    </div>
                    <div className="border-l border-r border-border">
                      <div className="font-bold text-base-200">{replies.length}</div>
                      <div className="text-[10px] text-base-100 uppercase mt-0.5">Replies</div>
                    </div>
                    <div>
                      <div className="font-bold text-base-200">{feedback.viewCount ?? 0}</div>
                      <div className="text-[10px] text-base-100 uppercase mt-0.5">Views</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
