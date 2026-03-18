import { useParams, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import {
  IconChevronUp,
  IconChevronDown,
  IconMessageCircle,
  IconArrowLeft,
  IconShare3,
} from '@tabler/icons-react'
import { mockFeedbacks } from '../data/mockFeedback'
import Avatar from '../components/ui/Avatar'
import { formatDate } from '../utils/formatDate'
import NotFoundState from '../components/NotFoundState'
import StatusBadge from '../components/ui/StatusBadge'

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#discussions') {
      setTimeout(() => {
        document.getElementById('discussions')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }
  }, [location])

  // In a real app we'd fetch this from an API
  const feedback = mockFeedbacks.find((f) => f.id === id)

  if (!feedback) {
    return <NotFoundState />
  }

  const companyName = feedback.reachedTo?.[0]?.name || 'a company'

  return (
    <div className="flex-1 bg-background min-h-screen">
      <div className="mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-base-100 hover:text-base-200 mb-6 transition-colors"
        >
          <IconArrowLeft size={16} stroke={2} />
          Back to Feed
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-8">
          {/* Main Content Area */}
          <div className="min-w-0">
            {/* Request Post */}
            <div className="bg-card-bg border border-border rounded-xl flex flex-row overflow-hidden p-0 shadow-none mb-6">
              {/* Desktop Vote Rail */}
              <div className="hidden sm:flex flex-col items-center bg-sidebar-bg/50 py-5 px-3 min-w-16 border-r border-border">
                <button className="cursor-pointer p-1.5 hover:bg-border rounded-md transition-colors text-base-100 hover:text-orange-600">
                  <IconChevronUp size={28} stroke={2} />
                </button>
                <span className="font-bold text-lg my-2 text-base-200 leading-none">
                  {feedback.upvotes}
                </span>
                <button className="cursor-pointer p-1.5 hover:bg-border rounded-md transition-colors text-base-100 hover:text-blue-600">
                  <IconChevronDown size={28} stroke={2} />
                </button>
              </div>

              <div className="flex-1 p-5 sm:p-6 lg:p-8 flex flex-col min-w-0">
                {/* Post Meta */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-base-100">
                    <Avatar name={feedback.author || 'Anonymous User'} size="sm" />
                    <span className="truncate">
                      <span className="font-semibold text-base-200">
                        {feedback.author || 'Anonymous'}
                      </span>{' '}
                      requested a feature for{' '}
                      <span className="font-semibold text-base-200">{companyName}</span>
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

                {feedback.description && (
                  <div className="text-base text-base-100 leading-relaxed space-y-4 mb-6 whitespace-pre-wrap">
                    {feedback.description}
                  </div>
                )}

                {/* Action Footer */}
                <div className="flex items-center gap-3 pt-4 border-t border-border mt-auto">
                  {/* Mobile Vote Panel */}
                  <div className="flex sm:hidden items-center gap-1 bg-sidebar-bg border border-border rounded-full px-3 py-1.5">
                    <button className="text-base-100 cursor-pointer hover:text-orange-600">
                      <IconChevronUp size={20} stroke={1.5} />
                    </button>
                    <span className="text-sm font-bold text-base-200 min-w-6 text-center">
                      {feedback.upvotes}
                    </span>
                    <button className="text-base-100 cursor-pointer hover:text-blue-600">
                      <IconChevronDown size={20} stroke={1.5} />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      document.getElementById('discussions')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="flex items-center cursor-pointer gap-1.5 hover:bg-sidebar-bg px-3 py-2 rounded-lg transition-colors text-sm font-medium text-base-100 hover:text-base-200"
                  >
                    <IconMessageCircle size={20} stroke={1.5} />
                    <span>{feedback.comments} Replies</span>
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
                Discussion ({feedback.comments})
              </h3>

              {/* Comment Input */}
              <div className="flex gap-3 text-sm mb-8">
                <Avatar name="Current User" size="md" />
                <div className="flex-1 bg-sidebar-bg border border-border focus-within:border-primary-600/50 focus-within:ring-2 focus-within:ring-primary-600/20 rounded-xl overflow-hidden transition-all">
                  <textarea
                    className="w-full bg-transparent p-3 outline-none resize-none min-h-20"
                    placeholder="What are your thoughts?"
                  />
                  <div className="flex justify-end p-2 bg-card-bg border-t border-border">
                    <button className="cursor-pointer btn btn-primary flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-medium text-sm">
                      Reply
                    </button>
                  </div>
                </div>
              </div>

              {/* Mock Comments Thread */}
              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <Avatar name="Jane Smith" size="sm" />
                    <div className="w-px h-full bg-border mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 text-xs mb-1.5">
                      <span className="font-bold text-base-200">Jane Smith</span>
                      <span className="text-base-100">· 2 days ago</span>
                    </div>
                    <p className="text-sm text-base-200 leading-relaxed mb-2">
                      I completely agree! This would save us so much time processing weekly reports.
                    </p>
                    <div className="flex items-center gap-2">
                      <button className="cursor-pointer flex items-center gap-1 text-xs font-medium text-base-100 hover:text-base-200 transition-colors">
                        <IconChevronUp size={16} stroke={2} /> 12
                      </button>
                      <button className="cursor-pointer flex items-center gap-1 text-xs font-medium text-base-100 hover:text-base-200 transition-colors">
                        <IconChevronDown size={16} stroke={2} />
                      </button>
                      <button className="cursor-pointer text-xs font-medium text-base-100 hover:text-base-200 transition-colors ml-2">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mock Company Reply nested */}
                <div className="flex gap-3 ml-8">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs ring-2 ring-card-bg">
                      C
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs mb-1.5">
                      <span className="font-bold text-base-200">{companyName} Team</span>
                      <span className="bg-primary-100 text-primary-800 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                        Company
                      </span>
                      <span className="text-base-100">· 1 day ago</span>
                    </div>
                    <p className="text-sm text-base-200 leading-relaxed mb-2">
                      Thanks for the feedback! We're actively looking into the infrastructure
                      requirements for this. We'll update the status to "In Progress" once scoping
                      is finished.
                    </p>
                    <div className="flex items-center gap-2">
                      <button className="cursor-pointer flex items-center gap-1 text-xs font-medium text-base-100 hover:text-base-200 transition-colors">
                        <IconChevronUp size={16} stroke={2} /> 45
                      </button>
                      <button className="cursor-pointer text-xs font-medium text-base-100 hover:text-base-200 transition-colors ml-2">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
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
                    <div className="w-5 h-5 rounded overflow-hidden bg-sidebar-bg flex items-center justify-center text-[10px] font-bold uppercase">
                      {companyName.charAt(0)}
                    </div>
                    {companyName}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-base-100 mb-1">Requester</div>
                  <div className="font-medium text-base-200 flex items-center gap-2">
                    <Avatar name={feedback.author || 'Anonymous'} size="sm" />
                    {feedback.author || 'Anonymous User'}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-base-100 mb-1">Engagement</div>
                  <div className="grid grid-cols-3 gap-2 mt-2 border border-border rounded-lg p-2 bg-sidebar-bg text-center">
                    <div>
                      <div className="font-bold text-base-200">{feedback.upvotes}</div>
                      <div className="text-[10px] text-base-100 uppercase mt-0.5">Votes</div>
                    </div>
                    <div className="border-l border-r border-border">
                      <div className="font-bold text-base-200">{feedback.comments}</div>
                      <div className="text-[10px] text-base-100 uppercase mt-0.5">Replies</div>
                    </div>
                    <div>
                      <div className="font-bold text-base-200">{feedback.views}</div>
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
