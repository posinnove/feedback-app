import { IconMessageCircle } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import type { FeedbackStatus } from '../types/feedback'
import Avatar from './ui/Avatar'
import ShareButton from './ui/ShareButton'
import StatusBadge from './ui/StatusBadge'
import VoteButtons from './ui/VoteButtons'
import SafeHtml from './SafeHtml'
import { formatDate } from '../utils/formatDate'

interface ReusableFeedbackCardData {
  id: string | number
  title: string
  description?: string | null
  authorName?: string
  feedbackType?: string
  createdAt: string
  upvotes: number
  downvotes?: number
  comments?: number
  companyName?: string
  companyAvatar?: string
  status?: FeedbackStatus
}

interface FeedbackCardProps {
  feedback: ReusableFeedbackCardData
  detailHref?: string
  discussionHref?: string
  shareUrl?: string
  showStatus?: boolean
  userVote?: 'up' | 'down' | null
  onUpvote?: () => void
  onDownvote?: () => void
}

export default function FeedbackCard({
  feedback,
  detailHref,
  discussionHref,
  shareUrl,
  showStatus = false,
  userVote = null,
  onUpvote,
  onDownvote,
}: FeedbackCardProps) {
  const companyName = feedback.companyName ?? 'a company'
  const companyAvatar = feedback.companyAvatar
  const authorName = feedback.authorName?.trim() ? feedback.authorName : 'Anonymous'
  const downvotes = feedback.downvotes ?? 0
  const content = (
    <>
      <div className="flex items-center gap-2 text-xs text-base-100 mb-2.5 sm:mb-3 flex-wrap">
        <Avatar name={companyName} avatar={companyAvatar} size="sm" />
        <span className="truncate min-w-0">
          <span className="font-semibold text-base-200">{companyName}</span>
          <span className="mx-1">-</span>
          requested by <span className="font-semibold text-base-200">{authorName}</span>
        </span>
        <span>·</span>
        <span className="shrink-0">{formatDate(feedback.createdAt)}</span>
      </div>

      {feedback.feedbackType ? (
        <div className="mb-2">
          <span className="inline-flex items-center rounded-full bg-primary-100 text-primary-700 px-2 py-0.5 text-[11px] font-semibold">
            {feedback.feedbackType}
          </span>
        </div>
      ) : null}

      <h3 className="text-base sm:text-lg font-bold text-base-200 mb-2 leading-snug">
        {feedback.title}
      </h3>

      {feedback.description && (
        <SafeHtml
          html={feedback.description}
          className="text-sm text-base-100 leading-relaxed mb-4 line-clamp-3"
        />
      )}

      <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mt-auto relative z-10">
        <VoteButtons
          upvotes={feedback.upvotes}
          downvotes={downvotes}
          userVote={userVote}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
        />

        {discussionHref && (
          <Link
            to={discussionHref}
            className="flex cursor-pointer items-center gap-1.5 bg-border/50 hover:bg-border px-2 py-1.5 sm:px-2.5 rounded-lg transition-colors text-xs font-medium text-base-100 hover:text-base-200"
          >
            <IconMessageCircle size={14} stroke={1.5} />
            <span>{feedback.comments ?? 0} Replies</span>
          </Link>
        )}

        <ShareButton
          url={shareUrl ?? window.location.href}
          size={14}
          className="cursor-pointer hover:bg-sidebar-bg px-2 py-1.5 sm:px-2.5 rounded-lg transition-colors font-medium text-base-100 hover:text-base-200"
        />
      </div>
    </>
  )

  return (
    <div className="bg-card-bg border border-border rounded-xl flex flex-row overflow-hidden p-0 hover:border-primary-600/30 transition-colors relative">
      {detailHref ? (
        <Link
          to={detailHref}
          className="flex-1 p-3 sm:p-4 lg:p-5 flex flex-col min-w-0 bg-transparent hover:bg-border/20 transition-colors cursor-pointer"
        >
          {content}
        </Link>
      ) : (
        <div className="flex-1 p-3 sm:p-4 lg:p-5 flex flex-col min-w-0">{content}</div>
      )}

      {showStatus && feedback.status && (
        <div className="absolute top-3 right-3">
          <StatusBadge status={feedback.status} />
        </div>
      )}
    </div>
  )
}
