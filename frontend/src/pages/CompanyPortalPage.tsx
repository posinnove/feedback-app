import { useState, type DragEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { IconLayoutKanban } from '@tabler/icons-react'
import { useGetCompanyBySlugQuery, useUpdateFeedbackStatusMutation } from '../store/api/companyApi'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import NotFoundState from '../components/NotFoundState'
import { useAppSelector } from '../store/hooks'

type FeedbackStatus = 'planned' | 'in-progress' | 'under-review' | 'completed' | 'rejected'

const KANBAN_COLUMNS: Array<{
  status: FeedbackStatus
  label: string
  accentClass: string
}> = [
  { status: 'planned', label: 'Planned', accentClass: 'border-status-planned' },
  { status: 'in-progress', label: 'In Progress', accentClass: 'border-status-in-progress' },
  { status: 'under-review', label: 'Under Review', accentClass: 'border-status-under-review' },
  { status: 'completed', label: 'Completed', accentClass: 'border-status-completed' },
  { status: 'rejected', label: 'Rejected', accentClass: 'border-status-rejected' },
]

export default function CompanyPortalPage() {
  const { entity, type, isAuthenticated } = useAppSelector((s) => s.auth)
  const isCompanyPortal = isAuthenticated && type === 'company'
  const companySlug = isCompanyPortal ? entity?.slug : undefined
  const [draggedFeedbackId, setDraggedFeedbackId] = useState<number | null>(null)
  const [statusOverrides, setStatusOverrides] = useState<Record<number, FeedbackStatus>>({})

  const {
    data: company,
    isLoading,
    isError,
  } = useGetCompanyBySlugQuery(companySlug!, {
    skip: !isCompanyPortal || !companySlug,
  })

  const [updateFeedbackStatus] = useUpdateFeedbackStatusMutation()

  if (!isCompanyPortal) {
    return <Navigate to="/feed" replace />
  }

  if (isLoading) return <LoadingSpinner />
  if (isError || !company) return <NotFoundState />

  const feedbacksWithOptimisticStatus = company.feedbacks.map((feedback) => ({
    ...feedback,
    status: statusOverrides[feedback.id] ?? feedback.status,
  }))

  const feedbacksByStatus = KANBAN_COLUMNS.map((column) => ({
    ...column,
    items: feedbacksWithOptimisticStatus.filter((feedback) => feedback.status === column.status),
  }))

  const handleDragStart = (feedbackId: number) => {
    setDraggedFeedbackId(feedbackId)
  }

  const handleDragEnd = () => {
    setDraggedFeedbackId(null)
  }

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.currentTarget.classList.add('bg-border/20')
  }

  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    e.currentTarget.classList.remove('bg-border/20')
  }

  const handleDrop = async (e: DragEvent<HTMLElement>, newStatus: FeedbackStatus) => {
    e.preventDefault()
    e.currentTarget.classList.remove('bg-border/20')

    if (draggedFeedbackId === null || !companySlug) return

    const currentFeedback = feedbacksWithOptimisticStatus.find(
      (feedback) => feedback.id === draggedFeedbackId
    )
    const previousStatus = currentFeedback?.status as FeedbackStatus | undefined
    if (!previousStatus || previousStatus === newStatus) {
      setDraggedFeedbackId(null)
      return
    }

    // Optimistic UI: move card immediately.
    setStatusOverrides((prev) => ({
      ...prev,
      [draggedFeedbackId]: newStatus,
    }))

    try {
      await updateFeedbackStatus({
        slug: companySlug,
        feedbackId: draggedFeedbackId,
        status: newStatus,
      }).unwrap()
    } catch (error) {
      // Rollback if API fails.
      setStatusOverrides((prev) => ({
        ...prev,
        [draggedFeedbackId]: previousStatus,
      }))
      console.error('Failed to update feedback status:', error)
    }

    setDraggedFeedbackId(null)
  }

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-1 sm:px-4 lg:px-6 py-6">
        {feedbacksWithOptimisticStatus.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            <div className="flex items-center gap-2 text-sm text-base-100 mb-4">
              <IconLayoutKanban size={16} stroke={1.5} />
              Kanban Board
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
              {feedbacksByStatus.map((column) => (
                <section
                  key={column.status}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.status)}
                  className="bg-card-bg border border-border rounded-xl p-3 min-h-60 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-base-200">{column.label}</h3>
                    <span
                      className={`text-xs h-6 w-6 rounded-full bg-border/60 text-base-200 border inline-flex items-center justify-center ${column.accentClass}`}
                    >
                      {column.items.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {column.items.length === 0 ? (
                      <p className="text-xs text-base-100">No feedback in this stage.</p>
                    ) : (
                      column.items.map((feedback) => (
                        <article
                          key={feedback.id}
                          draggable
                          onDragStart={() => handleDragStart(feedback.id)}
                          onDragEnd={handleDragEnd}
                          className={`border border-border rounded-lg p-3 bg-background cursor-move transition-all ${draggedFeedbackId === feedback.id ? 'opacity-50' : 'hover:border-border/60 hover:bg-card-bg'}`}
                        >
                          <Link
                            to={`/request/${feedback.id}`}
                            className="text-sm font-semibold text-base-200 hover:text-primary-400 line-clamp-2"
                          >
                            {feedback.title}
                          </Link>
                          {feedback.feedbackType?.name ? (
                            <p className="text-[11px] text-base-100 mt-1">
                              {feedback.feedbackType.name}
                            </p>
                          ) : null}
                          <div className="flex items-center gap-3 mt-2 text-[11px] text-base-100">
                            <span>{feedback.upvotes} up</span>
                            <span>{feedback.downvotes ?? 0} down</span>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
