import { useParams } from 'react-router-dom'
import { IconClock, IconChevronDown } from '@tabler/icons-react'
import { useGetCompanyBySlugQuery } from '../store/api/companyApi'
import FeedbackCard from '../components/FeedbackCard'
import CompanyInfo from '../components/CompanyInfo'
import StatsCard from '../components/StatsCard'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import NotFoundState from '../components/NotFoundState'

export default function CompanyBoardPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: company, isLoading, isError } = useGetCompanyBySlugQuery(slug!, { skip: !slug })

  if (isLoading) return <LoadingSpinner />
  if (isError || !company) return <NotFoundState />

  return (
    <div className="bg-background">
      <div className="max-w-6xl mx-auto px-1 sm:px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 lg:gap-8">
        {/* Left column — Company info, tabs, feedback */}
        <div className="min-w-0">
          <CompanyInfo company={company} />

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button className="px-4 py-1.5 text-sm font-medium text-primary-600 bg-primary-100 rounded-full transition-colors">
              Overview
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-base-100 hover:bg-border/50 rounded-full transition-colors">
              Posts
            </button>
            <button className="px-4 py-1.5 text-sm font-medium text-base-100 hover:bg-border/50 rounded-full transition-colors">
              Comments
            </button>
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
