import { useParams, Link } from 'react-router-dom'
import type { CompanyData, CompanyFeedback } from '../types/company'
import { useCompany } from '../api/company'

const STATUS_COLORS: Record<string, string> = {
    planned: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
    'under-review': 'bg-gray-100 text-gray-600',
    rejected: 'bg-red-100 text-red-700',
}

function StatusBadge({ status }: { status: string }) {
    const color = STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-600'
    const label = status.replace(/-/g, ' ')
    return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${color}`}>
            {label}
        </span>
    )
}

function FeedbackCard({ feedback }: { feedback: CompanyFeedback }) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const day = date.getDate()
        const month = date.toLocaleDateString('en-US', { month: 'short' })
        const year = date.getFullYear()
        return `${day} ${month}, ${year}`
    }

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
                        <span>{formatDate(feedback.createdAt)}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-base-200 leading-snug">{feedback.title}</h3>
                </div>
                <button className="text-base-100 hover:text-base-200 p-1 shrink-0">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="5" r="1.2" fill="currentColor" />
                        <circle cx="10" cy="10" r="1.2" fill="currentColor" />
                        <circle cx="10" cy="15" r="1.2" fill="currentColor" />
                    </svg>
                </button>
            </div>

            {/* Description */}
            {feedback.description && (
                <div className="px-4 pb-3">
                    <p className="text-sm text-base-100 leading-relaxed line-clamp-3">{feedback.description}</p>
                    <ul className="mt-2 space-y-1 text-sm text-base-100 list-disc pl-4">
                        <li>Super fast setup. I had auth, database, and file handling running almost immediately.</li>
                        <li>Local first development felt simple and predictable.</li>
                        <li>It handled small but important things like user management and permissions without extra layers....</li>
                    </ul>
                </div>
            )}

            {/* Footer */}
            <div className="px-4 pb-3 pt-2 mt-auto border-t border-border/50">
                <div className="flex items-center gap-3 text-xs text-base-100">
                    {/* Upvotes */}
                    <div className="flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 13V3M8 3L4 7M8 3L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-medium">{feedback.upvotes}</span>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 3V13M8 13L4 9M8 13L12 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    {/* Comments placeholder */}
                    <div className="flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6C3 4.89543 3.89543 4 5 4H11C12.1046 4 13 4.89543 13 6V11C13 12.1046 12.1046 13 11 13H8L5 15V13H5C3.89543 13 3 12.1046 3 11V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>0</span>
                    </div>

                    {/* Share */}
                    <button className="flex items-center gap-1 ml-auto px-2 py-1 rounded-md hover:bg-gray-100 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 8V13H12V8M8 2V10M8 2L5 5M8 2L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Share</span>
                    </button>
                </div>
            </div>

            {/* Status badge */}
            <div className="px-4 pb-3">
                <StatusBadge status={feedback.status} />
            </div>
        </div>
    )
}

function CompanyHeader({ company }: { company: CompanyData }) {
    const totalUpvotes = company.feedbacks.reduce((sum, f) => sum + f.upvotes, 0)

    return (
        <div className="flex items-start gap-8 mb-6">
            {/* Company info */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center border border-border">
                    {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                        <span className="text-2xl font-bold text-primary-600">{company.name.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-base-200">{company.name}</h1>
                    {company.description && (
                        <p className="text-sm text-base-100 mt-0.5">{company.description.split('.')[0]}.</p>
                    )}
                </div>
            </div>

            {/* Stats sidebar */}
            <div className="ml-auto card p-4 min-w-[200px]">
                <button className="btn btn-primary flex items-center gap-2 w-full justify-center mb-3 text-sm">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 8V13H12V8M8 2V10M8 2L5 5M8 2L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Share
                </button>
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
        </div>
    )
}

function EmptyState() {
    return (
        <div className="card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-600">
                    <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
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
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500">
                        <path d="M12 9V13M12 17H12.01M4.93 4.93L19.07 19.07M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
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
    const { data: company, isLoading, isError } = useCompany(slug)

    if (isLoading) return <LoadingSpinner />
    if (isError || !company) return <NotFoundState />

    return (
        <div className="min-h-screen bg-background">
            {/* Top bar */}
            <header className="bg-white border-b border-border px-6 py-3">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold text-primary-600">VOXELLA</Link>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-base-100">
                                    <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-1.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="max-w-6xl mx-auto px-6 py-6">
                <CompanyHeader company={company} />

                {/* Tabs */}
                <div className="flex gap-0 mb-6 border-b border-border">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-t-lg">Overview</button>
                    <button className="px-4 py-2 text-sm font-medium text-base-100 hover:text-base-200 transition-colors">Posts</button>
                    <button className="px-4 py-2 text-sm font-medium text-base-100 hover:text-base-200 transition-colors">Comments</button>
                </div>

                {/* Feedback list */}
                {company.feedbacks.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-base-100 mb-2">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-base-100">
                                <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M10 7V10L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            Showing all content
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="ml-auto">
                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        {company.feedbacks.map((feedback) => (
                            <FeedbackCard key={feedback.id} feedback={feedback} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
