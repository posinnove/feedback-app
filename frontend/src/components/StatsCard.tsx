import type { CompanyData } from '../types/company'
import ShareButton from './ui/ShareButton'
import { Card } from './ui/card'

interface StatsCardProps {
  company: CompanyData
}

export default function StatsCard({ company }: StatsCardProps) {
  const totalUpvotes = company.feedbacks.reduce((sum, f) => sum + f.upvotes, 0)
  const totalDownvotes = company.feedbacks.reduce((sum, f) => sum + (f.downvotes ?? 0), 0)
  const followerCount = company.followerCount ?? 0

  return (
    <Card className="sticky top-6 p-4">
      <ShareButton variant="primary" size={14} className="mb-3 h-9" />
      <div className="text-sm text-base-100 mb-2">{followerCount.toLocaleString()} followers</div>
      <p className="text-xs text-base-100 mb-3 leading-relaxed">
        {company.description ?? `Welcome to ${company.name}'s feedback board.`}
      </p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-lg font-bold text-base-200">{company.feedbacks.length}</div>
          <div className="text-xs text-base-100">Posts</div>
        </div>
        <div>
          <div className="text-lg font-bold text-base-200">{totalUpvotes.toLocaleString()}</div>
          <div className="text-xs text-base-100">Upvotes</div>
        </div>
        <div>
          <div className="text-lg font-bold text-base-200">{totalDownvotes.toLocaleString()}</div>
          <div className="text-xs text-base-100">Downvotes</div>
        </div>
      </div>
    </Card>
  )
}
