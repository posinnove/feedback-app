import {
  IconChevronUp,
  IconChevronDown,
  IconMessageCircle,
  IconFlame,
  IconClock,
  IconTrendingUp,
  IconShare3,
} from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import type { Feedback } from '../types/feedback'
import { mockFeedbacks } from '../data/mockFeedback'
import Avatar from './ui/Avatar'
import { formatDate } from '../utils/formatDate'

function FeedbackCard({ feedback }: { feedback: Feedback }) {
  const companyName = feedback.reachedTo?.[0]?.name || 'a company'

  return (
    <div className="bg-card-bg border border-border rounded-xl flex flex-row overflow-hidden p-0 hover:border-primary-600/30 transition-colors relative">
      {/* Desktop Vote Rail */}
      <div className="hidden sm:flex flex-col items-center bg-transparent py-4 px-3 min-w-16 relative z-10">
        <button className="p-1.5 hover:bg-border cursor-pointer rounded-md transition-colors text-base-100 hover:text-orange-600">
          <IconChevronUp size={24} stroke={2} />
        </button>
        <span className="font-bold text-sm my-1 text-base-200 leading-none">
          {feedback.upvotes}
        </span>
        <button className="p-1.5 hover:bg-border cursor-pointer rounded-md transition-colors text-base-100 hover:text-blue-600">
          <IconChevronDown size={24} stroke={2} />
        </button>
      </div>

      {/* Main Card Area - Now acts as the link container */}
      <Link
        to={`/request/${feedback.id}`}
        className="flex-1 p-3 sm:p-4 lg:p-5 flex flex-col min-w-0 bg-transparent hover:bg-border/20 transition-colors cursor-pointer"
      >
        {/* Post Meta - Removed community styles, focused on requester and company */}
        <div className="flex items-center gap-2 text-xs text-base-100 mb-2.5 sm:mb-3 flex-wrap">
          <Avatar name="Anonymous User" size="sm" />
          <span className="truncate min-w-0">
            <span className="font-semibold text-base-200">Anonymous</span> requested a feature for{' '}
            <span className="font-semibold text-base-200">{companyName}</span>
          </span>
          <span>·</span>
          <span className="shrink-0">{formatDate(feedback.createdAt)}</span>
        </div>

        {/* Content */}
        <h3 className="text-base sm:text-lg font-bold text-base-200 mb-2 leading-snug">
          {feedback.title}
        </h3>

        {feedback.description && (
          <p className="text-sm text-base-100 leading-relaxed mb-4 line-clamp-3">
            {feedback.description}
          </p>
        )}

        {/* Action Footer */}
        <div
          className="flex items-center flex-wrap gap-1.5 sm:gap-2 mt-auto relative z-10"
          onClick={(e) => e.preventDefault()}
        >
          {/* Mobile Vote Panel */}
          <div className="flex sm:hidden items-center gap-1 bg-sidebar-bg border border-border rounded-full px-2 py-1">
            <button className="cursor-pointer text-base-100 hover:text-orange-600">
              <IconChevronUp size={18} stroke={1.5} />
            </button>
            <span className="text-xs font-bold text-base-200 min-w-5 text-center">
              {feedback.upvotes}
            </span>
            <button className="cursor-pointer text-base-100 hover:text-blue-600">
              <IconChevronDown size={18} stroke={1.5} />
            </button>
          </div>

          <Link
            to={`/request/${feedback.id}#discussions`}
            onClick={(e) => e.stopPropagation()}
            className="flex cursor-pointer items-center gap-1.5 hover:bg-sidebar-bg px-2 py-1.5 sm:px-2.5 rounded-lg transition-colors text-xs sm:text-sm font-medium text-base-100 hover:text-base-200"
          >
            <IconMessageCircle size={18} stroke={1.5} />
            <span>{feedback.comments} Replies</span>
          </Link>

          <button className="flex cursor-pointer items-center gap-1.5 hover:bg-sidebar-bg px-2 py-1.5 sm:px-2.5 rounded-lg transition-colors text-xs sm:text-sm font-medium text-base-100 hover:text-base-200">
            <IconShare3 size={18} stroke={1.5} />
            <span>Share</span>
          </button>
        </div>
      </Link>
    </div>
  )
}

export default function PublicFeedbackBoard({
  feedbacks = mockFeedbacks,
}: {
  feedbacks?: Feedback[]
}) {
  return (
    <div className="bg-background">
      <div className="mx-auto w-full px-1 sm:px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-[minmax(0,840px)_320px] lg:justify-center gap-6">
        <main className="min-w-0">
          {/* Header & Tabs */}
          <div className="mb-6">
            {/* Reddit-like Sort Tabs */}
            <div className="flex items-center gap-2 border border-border bg-card-bg px-2 py-2 rounded-xl mb-6 overflow-x-auto shadow-none">
              <button className="cursor-pointer flex items-center gap-1.5 px-4 py-2 bg-border text-base-200 rounded-lg text-sm font-semibold transition-colors shrink-0">
                <IconFlame size={18} stroke={2} className="text-orange-600" /> Trending
              </button>
              <button className="cursor-pointer flex items-center gap-1.5 px-4 py-2 hover:bg-sidebar-bg text-base-100 hover:text-base-200 rounded-lg text-sm font-medium transition-colors shrink-0">
                <IconClock size={18} stroke={2} className="text-blue-600" /> New
              </button>
              <button className="cursor-pointer flex items-center gap-1.5 px-4 py-2 hover:bg-sidebar-bg text-base-100 hover:text-base-200 rounded-lg text-sm font-medium transition-colors shrink-0">
                <IconTrendingUp size={18} stroke={2} className="text-green-600" /> Top
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {feedbacks.map((f) => (
              <FeedbackCard key={f.id} feedback={f} />
            ))}
          </div>
        </main>

        <aside className="hidden lg:block space-y-4">
          <div className="bg-card-bg border border-border rounded-xl p-5 shadow-none">
            <h3 className="text-sm font-bold text-base-200 mb-2 uppercase tracking-wider text-[11px]">
              Platform Overview
            </h3>
            <p className="text-sm text-base-100 mb-4 leading-relaxed">
              Help companies build better products. Upvote the features you care about or request
              new ones directly from the teams who can build them.
            </p>
            <div className="flex justify-between text-center pb-4 mb-4 border-b border-border">
              <div>
                <div className="text-lg font-bold">{feedbacks.length}</div>
                <div className="text-xs text-base-100">Requests</div>
              </div>
              <div>
                <div className="text-lg font-bold">12.5k</div>
                <div className="text-xs text-base-100">Users</div>
              </div>
            </div>
            <button className="cursor-pointer w-full btn btn-primary py-2 font-semibold">
              Request a Feature
            </button>
          </div>

          <div className="bg-card-bg border border-border rounded-xl p-5 shadow-none">
            <h3 className="text-sm font-bold text-base-200 mb-3 uppercase tracking-wider text-[11px]">
              Recent Requests
            </h3>
            <div className="flex flex-col gap-4">
              {feedbacks.slice(0, 3).map((f) => (
                <div key={`recent-${f.id}`} className="group cursor-pointer">
                  <div className="text-xs text-base-100 mb-1">
                    {f.upvotes} upvotes · {f.comments} comments
                  </div>
                  <h4 className="text-sm font-medium text-base-200 group-hover:text-primary-600 line-clamp-2 leading-snug">
                    {f.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card-bg border border-border rounded-xl p-5 shadow-none">
            <h3 className="text-sm font-bold text-base-200 mb-3 uppercase tracking-wider text-[11px]">
              Top Requester
            </h3>
            <div className="flex flex-col gap-3">
              {Array.from(
                feedbacks
                  .flatMap((f) => f.reachedTo.map((r) => r.name))
                  .reduce(
                    (m, name) => m.set(name, (m.get(name) || 0) + 1),
                    new Map<string, number>()
                  )
              ).map(([name, count]) => (
                <div key={name} className="flex items-center gap-3">
                  <Avatar name={name} />
                  <div className="flex-1 text-sm font-medium text-base-200">{name}</div>
                  <div className="text-xs text-base-100 font-medium">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
