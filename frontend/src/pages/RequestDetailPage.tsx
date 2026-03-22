import { useParams, Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { IconMessageCircle, IconArrowLeft, IconPencil } from '@tabler/icons-react'
import Avatar from '../components/ui/Avatar'
import SafeHtml from '../components/SafeHtml'
import { formatDate } from '../utils/formatDate'
import NotFoundState from '../components/NotFoundState'
import StatusBadge from '../components/ui/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import VoteButtons from '../components/ui/VoteButtons'
import ShareButton from '../components/ui/ShareButton'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import {
  useCreateFeedbackReplyMutation,
  useGetFeedbackRepliesQuery,
  useGetPublicFeedbackByIdQuery,
  useUpdateFeedbackReplyMutation,
  useUpdateFeedbackRequestMutation,
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

function getApiErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof (error as { data?: { message?: unknown } }).data?.message === 'string'
  ) {
    return (error as { data: { message: string } }).data.message
  }

  return fallback
}

function wasEdited(createdAt: string, updatedAt: string) {
  return new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 1000
}

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [replyDraft, setReplyDraft] = useState('')
  const [replyVisibility, setReplyVisibility] = useState<'public' | 'anonymous' | null>(
    isAuthenticated ? null : 'anonymous'
  )
  const [replyingTo, setReplyingTo] = useState<{ id: number; authorName: string } | null>(null)
  const [replyError, setReplyError] = useState<string | null>(null)
  const [isEditingFeedback, setIsEditingFeedback] = useState(false)
  const [feedbackEditTitle, setFeedbackEditTitle] = useState('')
  const [feedbackEditDescription, setFeedbackEditDescription] = useState('')
  const [feedbackEditError, setFeedbackEditError] = useState<string | null>(null)
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null)
  const [editingReplyContent, setEditingReplyContent] = useState('')
  const [replyEditError, setReplyEditError] = useState<string | null>(null)
  const [voteOverride, setVoteOverride] = useState<{
    upvotes: number
    downvotes: number
    userVote: 'up' | 'down' | null
  } | null>(null)

  const feedbackId = Number.parseInt(id ?? '', 10)
  const {
    data,
    isLoading,
    isError,
    refetch: refetchFeedback,
  } = useGetPublicFeedbackByIdQuery(feedbackId, {
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
  const [updateFeedbackRequest, { isLoading: isSavingFeedbackEdit }] =
    useUpdateFeedbackRequestMutation()
  const [updateFeedbackReply, { isLoading: isSavingReplyEdit }] = useUpdateFeedbackReplyMutation()
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

  function handleCompanyClick() {
    const companySlug = feedback?.company?.slug
    if (!companySlug) return
    navigate(`/company/${companySlug}`)
  }

  function beginFeedbackEdit() {
    setFeedbackEditError(null)
    setFeedbackEditTitle(feedback?.title ?? '')
    setFeedbackEditDescription(feedback?.description ?? '')
    setIsEditingFeedback(true)
  }

  function cancelFeedbackEdit() {
    setFeedbackEditError(null)
    setIsEditingFeedback(false)
    setFeedbackEditTitle(feedback?.title ?? '')
    setFeedbackEditDescription(feedback?.description ?? '')
  }

  async function submitFeedbackEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedbackEditError(null)

    const nextTitle = feedbackEditTitle.trim()
    if (nextTitle.length < 5) {
      setFeedbackEditError('Title must be at least 5 characters long')
      return
    }

    if (feedbackEditDescription.length > 1000) {
      setFeedbackEditError('Description must be at most 1000 characters long')
      return
    }

    try {
      await updateFeedbackRequest({
        feedbackId,
        title: nextTitle,
        description: feedbackEditDescription,
      }).unwrap()
      await refetchFeedback()
      setIsEditingFeedback(false)
    } catch (error) {
      setFeedbackEditError(getApiErrorMessage(error, 'Failed to update feedback request'))
    }
  }

  function beginReplyEdit(replyId: number, content: string) {
    setReplyEditError(null)
    setEditingReplyId(replyId)
    setEditingReplyContent(content)
  }

  function cancelReplyEdit() {
    setReplyEditError(null)
    setEditingReplyId(null)
    setEditingReplyContent('')
  }

  async function submitReplyEdit(replyId: number) {
    setReplyEditError(null)
    const nextContent = editingReplyContent.trim()

    if (nextContent.length < 2) {
      setReplyEditError('Reply must be at least 2 characters long')
      return
    }

    if (nextContent.length > 1000) {
      setReplyEditError('Reply must be at most 1000 characters long')
      return
    }

    try {
      await updateFeedbackReply({
        feedbackId,
        replyId,
        content: nextContent,
      }).unwrap()
      setEditingReplyId(null)
      setEditingReplyContent('')
      await refetchReplies()
    } catch (error) {
      setReplyEditError(getApiErrorMessage(error, 'Failed to update reply'))
    }
  }

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

    if (!replyVisibility) {
      setReplyError('Please choose visibility for your reply')
      return
    }

    if (!isAuthenticated && replyVisibility !== 'anonymous') {
      setReplyError('Please choose anonymous visibility when replying as a guest')
      return
    }

    try {
      await createReply({
        feedbackId,
        content,
        visibility: isAuthenticated ? replyVisibility : 'anonymous',
        parentReplyId: replyingTo?.id,
      }).unwrap()
      setReplyDraft('')
      setReplyVisibility(isAuthenticated ? null : 'anonymous')
      setReplyingTo(null)
      await refetchReplies()
    } catch {
      setReplyError('Failed to post reply. Please try again.')
    }
  }

  async function handleReplyVote(replyId: number, direction: 'up' | 'down') {
    const existingReply = replies.find((reply) => reply.id === replyId)
    if (!existingReply) return

    const previousVoteState = replyVoteState[replyId]
    const currentUpvotes = previousVoteState?.upvotes ?? existingReply.upvotes
    const currentDownvotes = previousVoteState?.downvotes ?? existingReply.downvotes
    const currentVote = previousVoteState?.userVote ?? existingReply.userVote ?? null

    const optimistic = getOptimisticVoteOutcome(
      currentUpvotes,
      currentDownvotes,
      currentVote,
      direction
    )

    setReplyVoteState((prev) => ({
      ...prev,
      [replyId]: optimistic,
    }))

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
      if (previousVoteState) {
        setReplyVoteState((prev) => ({
          ...prev,
          [replyId]: previousVoteState,
        }))
        return
      }

      setReplyVoteState((prev) => {
        const next = { ...prev }
        delete next[replyId]
        return next
      })
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
                {wasEdited(reply.createdAt, reply.updatedAt) ? (
                  <span className="text-base-100">(edited)</span>
                ) : null}
              </div>
              {editingReplyId === reply.id ? (
                <div className="mb-2 space-y-2">
                  <Textarea
                    value={editingReplyContent}
                    onChange={(event) => setEditingReplyContent(event.target.value)}
                    className="min-h-20"
                  />
                  {replyEditError ? <p className="text-xs text-red-500">{replyEditError}</p> : null}
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => void submitReplyEdit(reply.id)}
                      disabled={isSavingReplyEdit}
                    >
                      {isSavingReplyEdit ? 'Saving...' : 'Save'}
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={cancelReplyEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <SafeHtml
                  html={reply.content}
                  className="text-sm text-base-200 leading-relaxed mb-2"
                />
              )}
              <div className="flex items-center gap-2">
                <VoteButtons
                  upvotes={upvotes}
                  downvotes={downvotes}
                  userVote={userVote}
                  onUpvote={() => void handleReplyVote(reply.id, 'up')}
                  onDownvote={() => void handleReplyVote(reply.id, 'down')}
                />
                {reply.canEdit && editingReplyId !== reply.id ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => beginReplyEdit(reply.id, reply.content)}
                    className="h-auto px-1 py-0 text-xs text-base-100 hover:bg-transparent hover:text-base-200"
                  >
                    <IconPencil size={14} stroke={1.5} />
                    Edit
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReplyingTo({ id: reply.id, authorName })
                    setReplyError(null)
                    document.getElementById('reply-input')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="h-auto px-0 py-0 text-xs font-medium text-base-100 transition-colors hover:bg-transparent hover:text-base-200"
                >
                  Reply
                </Button>
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCompanyClick}
                      className="group inline-flex h-auto cursor-pointer items-center gap-2 rounded px-1 py-0.5 -m-0.5 transition-colors hover:bg-border active:bg-border focus-visible:ring-2 focus-visible:ring-primary-600/40"
                      aria-label={`Open ${companyName} company page`}
                    >
                      <Avatar
                        name={companyName}
                        avatar={feedback.company?.logoUrl ?? undefined}
                        size="sm"
                      />
                      <span className="font-semibold text-base-200">{companyName}</span>
                    </Button>
                    <span className="mx-1">-</span>
                    <span className="text-base-100">
                      requested by{' '}
                      <span className="font-semibold text-base-200">{requesterName}</span>
                    </span>
                    <span>·</span>
                    <span className="shrink-0">{formatDate(feedback.createdAt)}</span>
                    {wasEdited(feedback.createdAt, feedback.updatedAt) ? (
                      <span className="shrink-0">(edited)</span>
                    ) : null}
                  </div>
                  {feedback.status && <StatusBadge status={feedback.status} />}
                </div>

                {/* Content */}
                {isEditingFeedback ? (
                  <form onSubmit={submitFeedbackEdit} className="mb-6 space-y-3">
                    <Input
                      value={feedbackEditTitle}
                      onChange={(event) => setFeedbackEditTitle(event.target.value)}
                      minLength={5}
                      required
                    />
                    <Textarea
                      value={feedbackEditDescription}
                      onChange={(event) => setFeedbackEditDescription(event.target.value)}
                      className="min-h-28"
                    />
                    {feedbackEditError ? (
                      <p className="text-sm text-red-500">{feedbackEditError}</p>
                    ) : null}
                    <div className="flex items-center gap-2">
                      <Button type="submit" size="sm" disabled={isSavingFeedbackEdit}>
                        {isSavingFeedbackEdit ? 'Saving...' : 'Save changes'}
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={cancelFeedbackEdit}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <h1 className="text-xl sm:text-2xl font-extrabold text-base-200 leading-snug">
                        {feedback.title}
                      </h1>
                      {feedback.canEdit ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={beginFeedbackEdit}
                          className="h-auto px-2 py-1 text-xs text-base-100 hover:text-base-200"
                        >
                          <IconPencil size={14} stroke={1.5} />
                          Edit
                        </Button>
                      ) : null}
                    </div>

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
                  </>
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

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      document.getElementById('discussions')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="h-auto items-center gap-1.5 bg-transparent px-3 py-2 text-sm font-medium text-base-100 hover:bg-sidebar-bg hover:text-base-200"
                  >
                    <IconMessageCircle size={20} stroke={1.5} />
                    <span>{replies.length} Replies</span>
                  </Button>

                  <ShareButton
                    url={window.location.href}
                    size={20}
                    className="h-auto hover:bg-sidebar-bg px-3 py-2 rounded-lg transition-colors text-sm font-medium text-base-100 hover:text-base-200"
                  />
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(null)}
                        className="h-auto px-0 py-0 text-base-100 hover:bg-transparent hover:text-base-200"
                      >
                        Cancel
                      </Button>
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
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setReplyVisibility('anonymous')}
                        className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                          replyVisibility === 'anonymous'
                            ? 'border-primary-600 bg-primary-100 text-primary-700'
                            : 'border-border text-base-200 hover:bg-border/50'
                        }`}
                      >
                        Anonymous
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setReplyVisibility('public')}
                        disabled={!isAuthenticated}
                        className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                          replyVisibility === 'public'
                            ? 'border-primary-600 bg-primary-100 text-primary-700'
                            : 'border-border text-base-200 hover:bg-border/50 disabled:cursor-not-allowed disabled:opacity-60'
                        }`}
                      >
                        Public
                      </Button>
                    </div>
                    {!isAuthenticated ? (
                      <p className="text-xs text-base-100 mt-2">
                        You are replying as a guest. Only anonymous replies are available.
                      </p>
                    ) : null}
                  </div>
                  <div className="flex justify-end p-2 bg-card-bg border-t border-border">
                    <Button
                      type="submit"
                      disabled={isPostingReply || replyDraft.trim().length < 2 || !replyVisibility}
                      className="px-4"
                      size="sm"
                    >
                      Reply
                    </Button>
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleCompanyClick}
                    className="-m-0.5 inline-flex h-auto items-center gap-2 rounded px-1 py-0.5 font-medium text-base-200 transition-colors hover:bg-border active:bg-border"
                    aria-label={`Open ${companyName} company page`}
                  >
                    <Avatar
                      name={companyName}
                      avatar={feedback.company?.logoUrl ?? undefined}
                      size="sm"
                    />
                    {companyName}
                  </Button>
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
