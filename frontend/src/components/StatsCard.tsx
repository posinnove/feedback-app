import type { CompanyData } from '../types/company'
import ShareButton from './ui/ShareButton'

interface StatsCardProps {
    company: CompanyData
    children?: React.ReactNode
}

export default function StatsCard({ company, children }: StatsCardProps) {
    const totalUpvotes = company.feedbacks.reduce((sum, f) => sum + f.upvotes, 0)

    return (
        <div className="card p-4 sticky top-6">
            <ShareButton variant="primary" size={14} className="mb-3" />
            <div className="text-sm text-base-100 mb-2">400 followers</div>
            <p className="text-xs text-base-100 mb-3 leading-relaxed">
                {company.description ?? `Welcome to ${company.name}'s feedback board.`}
            </p>
            <div className="grid grid-cols-2 gap-3 text-center mb-4">
                <div>
                    <div className="text-lg font-bold text-base-200">{company.feedbacks.length}</div>
                    <div className="text-xs text-base-100">Posts</div>
                </div>
                <div>
                    <div className="text-lg font-bold text-base-200">{totalUpvotes.toLocaleString()}</div>
                    <div className="text-xs text-base-100">Total Upvotes</div>
                </div>
            </div>
            {children}
        </div>
    )
}
