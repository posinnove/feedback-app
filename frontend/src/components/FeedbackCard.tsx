import { IconDotsVertical, IconMessage } from '@tabler/icons-react'
import type { CompanyFeedback } from '../types/company'
import StatusBadge from './ui/StatusBadge'
import VoteButtons from './ui/VoteButtons'
import ShareButton from './ui/ShareButton'
import { timeAgo } from '../utils/formatDate'

interface FeedbackCardProps {
  feedback: CompanyFeedback
  companySlug: string
}

export default function FeedbackCard({ feedback, companySlug }: FeedbackCardProps) {
  return (
    <div className="card flex flex-col p-0 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-4 pb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-base-100 mb-1">
            <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-[10px] text-white font-semibold">C</span>
            </div>
            <span>Company names</span>
            <span>·</span>
            <span>{timeAgo(feedback.createdAt)}</span>
          </div>
          <h3 className="text-sm font-semibold text-base-200 leading-snug">{feedback.title}</h3>
        </div>
        <button className="text-base-100 hover:text-base-200 p-1 shrink-0">
          <IconDotsVertical size={16} stroke={1.5} />
        </button>
      </div>

      {/* Description */}
      {feedback.description && (
        <div className="px-4 pb-3">
          <p className="text-sm text-base-100 leading-relaxed line-clamp-3">
            {feedback.description}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 pb-3 pt-2 mt-auto border-t border-border/50">
        <div className="flex items-center gap-3 text-xs text-base-100">
          <VoteButtons count={feedback.upvotes} />

          <div className="flex items-center gap-1 bg-gray-100 rounded-md px-2 py-1 hover:bg-gray-200 transition-colors cursor-pointer">
            <IconMessage size={14} stroke={1.5} />
            <span>0</span>
          </div>

          <div className="ml-auto">
            <ShareButton
              url={`${window.location.origin}/company/${companySlug}/feedback/${feedback.id}`}
              size={14}
            />
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div className="px-4 pb-3">
        <StatusBadge status={feedback.status} />
      </div>
    </div>
  )
}
