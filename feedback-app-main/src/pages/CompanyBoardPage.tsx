import { useParams, Link } from 'react-router-dom'
import {
    IconDotsVertical,
    IconMessage,
    IconClock,
    IconChevronDown,
    IconAlertCircle,
    IconCircleX,
} from '@tabler/icons-react'
import type { CompanyData, CompanyFeedback } from '../types/company'
import { useGetCompanyBySlugQuery } from '../store/api/companyApi'
import StatusBadge from '../components/ui/StatusBadge'
import VoteButtons from '../components/ui/VoteButtons'
import ShareButton from '../components/ui/ShareButton'
import { timeAgo } from '../utils/formatDate'

function FeedbackCard({ feedback, companySlug }: { feedback: CompanyFeedback; companySlug: string }) {
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
                    <p className="text-sm text-base-100 leading-relaxed line-clamp-3">{feedback.description}</p>
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

function CompanyInfo({ company }: { company: CompanyData }) {
    return (
        <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-primary-100 flex items-center justify-center border border-border shrink-0">
                {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.name} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                    <span className="text-xl lg:text-2xl font-bold text-primary-600">{company.name.charAt(0).toUpperCase()}</span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h1 className="text-xl lg:text-2xl font-bold text-base-200 truncate">{company.name}</h1>
                {company.description && (
                    <p className="text-sm text-base-100 mt-0.5 line-clamp-1">{company.description.split('.')[0]}.</p>
                )}
            </div>
            {/* Mobile share button — visible only when stats card is hidden */}
            <div className="lg:hidden shrink-0">
                <ShareButton size={16} label="" />
            </div>
        </div>
    )
}

function StatsCard({ company }: { company: CompanyData }) {
    const totalUpvotes = company.feedbacks.reduce((sum, f) => sum + f.upvotes, 0)

    return (
        <div className="card p-4 sticky top-6">
            <ShareButton variant="primary" size={14} className="mb-3" />
            <div className="text-sm text-base-100 mb-2">400 followers</div>
            <p className="text-xs text-base-100 mb-3 leading-relaxed">
                {company.description ?? `Welcome to ${company.name}'s feedback board.`}
            </p>
            <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                    <div className="text-lg font-bold text-base-200">{company.feedbacks.length}</div>
                    <div className="text-xs text-base-100">Posts</div>
                </div>
                <div>
                    <div className="text-lg font-bold text-base-200">{totalUpvotes.toLocaleString()}</div>
                    <div className="text-xs text-base-100">Total Upvotes</div>
                </div>
            </div>
        </div>
    )
}

function EmptyState() {
    return (
        <div className="card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                <IconAlertCircle size={28} stroke={2} className="text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-base-200 mb-2">No feedback yet</h3>
            <p className="text-sm text-base-100 max-w-sm mx-auto">
                This company hasn't received any feedback submissions yet. Check back later!
            </p>
        </div>
    )
}

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-base-100">Loading company board...</p>
            </div>
        </div>
    )
}

function NotFoundState() {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="card p-12 text-center max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <IconCircleX size={28} stroke={2} className="text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-base-200 mb-2">Company not found</h3>
                <p className="text-sm text-base-100 mb-4">
                    The company you're looking for doesn't exist or the URL may be incorrect.
                </p>
                <Link to="/" className="btn btn-primary inline-block text-sm">
                    Go to Home
                </Link>
            </div>
        </div>
    )
}

export default function CompanyBoardPage() {
    const { slug } = useParams<{ slug: string }>()
    const { data: company, isLoading, isError } = useGetCompanyBySlugQuery(slug!, { skip: !slug })

    if (isLoading) return <LoadingSpinner />
    if (isError || !company) return <NotFoundState />

    return (
        <div className="bg-background">
            <div className="max-w-6xl mx-auto px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 lg:gap-8">
                {/* Left column — Company info, tabs, feedback */}
                <div className="min-w-0">
                    <CompanyInfo company={company} />

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button className="px-4 py-1.5 text-sm font-medium text-primary-600 bg-primary-100 rounded-full transition-colors">Overview</button>
                        <button className="px-4 py-1.5 text-sm font-medium text-base-100 hover:bg-gray-100 rounded-full transition-colors">Posts</button>
                        <button className="px-4 py-1.5 text-sm font-medium text-base-100 hover:bg-gray-100 rounded-full transition-colors">Comments</button>
                    </div>

                    {/* Feedback list */}
                    {company.feedbacks.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-base-100 mb-2">
                                <IconClock size={16} stroke={1.5} />
                                Showing all content
                                <IconChevronDown size={14} stroke={1.5} className="ml-auto" />
                            </div>
                            {company.feedbacks.map((feedback) => (
                                <FeedbackCard key={feedback.id} feedback={feedback} companySlug={slug!} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right column — Stats/Share card (hidden on mobile) */}
                <div className="hidden lg:block">
                    <StatsCard company={company} />
                </div>
            </div>
        </div>
    )
}
