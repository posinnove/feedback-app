import {
  useGetAdminFeedbacksQuery,
  useDeleteAdminFeedbackMutation,
  type AdminFeedback,
} from '../../store/api/adminApi'
import { Button } from '../../components/ui/button'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useState } from 'react'
import { IconTrash, IconExternalLink, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui/badge'

const PAGE_LIMIT = 20

export default function AdminFeedbacks() {
  const [page, setPage] = useState(1)
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAdminFeedbacksQuery({
    page,
    limit: PAGE_LIMIT,
  })
  const [deleteFeedback] = useDeleteAdminFeedbackMutation()
  const [loadingId, setLoadingId] = useState<number | null>(null)

  if (isLoading) return <LoadingSpinner />

  const feedbacks: AdminFeedback[] = response?.feedbacks || []
  const totalPages = response?.totalPages || 1
  const total = response?.total || 0

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return

    setLoadingId(id)
    try {
      await deleteFeedback(id).unwrap()
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="flex flex-col h-full space-y-4 max-h-full">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-lg font-semibold text-base-200">Manage Feedbacks</h2>
        <p className="text-sm text-base-100">
          Showing {feedbacks.length > 0 ? (page - 1) * PAGE_LIMIT + 1 : 0} to{' '}
          {Math.min(page * PAGE_LIMIT, total)} of {total}
        </p>
      </div>

      <div className="overflow-x-auto overflow-y-auto w-full custom-scroll pr-2 flex-1 rounded-lg border border-border bg-background/60">
        <table className="w-full text-sm text-left align-middle border-collapse">
          <thead className="bg-sidebar-bg/80 text-base-200 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
              <th className="px-4 py-3 font-medium text-center">Votes</th>
              <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!feedbacks.length ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-base-100 bg-background/50 rounded-b-lg"
                >
                  No feedbacks found.
                </td>
              </tr>
            ) : (
              feedbacks.map((fb) => (
                <tr key={fb.id} className="hover:bg-border/20">
                  <td
                    className="px-4 py-3 font-medium max-w-xs xl:max-w-md truncate"
                    title={fb.title}
                  >
                    {fb.title}
                  </td>
                  <td className="px-4 py-3 text-base-100">{fb.company?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-center capitalize text-base-100">
                    <Badge className="normal-case tracking-normal bg-border/60 text-base-200 border-transparent shrink-0">
                      {fb.status.replace('-', ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-base-100">
                    <span
                      className={
                        fb.upvotes - fb.downvotes > 0
                          ? 'text-emerald-400'
                          : fb.upvotes - fb.downvotes < 0
                            ? 'text-rose-400'
                            : 'text-base-200'
                      }
                    >
                      {fb.upvotes - fb.downvotes}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center justify-end gap-1">
                    <Link
                      to={`/request/${fb.id}`}
                      className="text-base-100 hover:text-primary-600 p-1.5 rounded-md hover:bg-primary-600/10 transition-colors"
                      title="View Feedback"
                      target="_blank"
                    >
                      <IconExternalLink size={16} />
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8 p-0"
                      onClick={() => handleDelete(fb.id)}
                      disabled={loadingId === fb.id}
                      title="Delete Feedback"
                    >
                      <IconTrash size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between shrink-0 pt-2 px-2">
          <p className="text-sm text-base-100">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1 || isFetching}
              className="gap-1"
            >
              <IconChevronLeft size={16} />
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages || isFetching}
              className="gap-1"
            >
              Next
              <IconChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
