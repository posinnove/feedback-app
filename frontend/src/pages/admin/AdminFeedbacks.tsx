import { useGetAdminFeedbacksQuery, useDeleteAdminFeedbackMutation } from '../../store/api/adminApi'
import { Button } from '../../components/ui/button'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useState } from 'react'
import { IconTrash, IconExternalLink } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

export default function AdminFeedbacks() {
  const { data: feedbacks, isLoading } = useGetAdminFeedbacksQuery()
  const [deleteFeedback] = useDeleteAdminFeedbackMutation()
  const [loadingId, setLoadingId] = useState<number | null>(null)

  if (isLoading) return <LoadingSpinner />

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
    <div className="flex flex-col h-full space-y-4 max-h-[100%]">
      <h2 className="text-lg font-semibold text-base-200 shrink-0">Manage Feedbacks</h2>
      
      <div className="overflow-x-auto overflow-y-auto w-full custom-scroll pr-2 h-full">
        <table className="w-full text-sm text-left align-middle border-collapse">
          <thead className="bg-border/30 text-base-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
              <th className="px-4 py-3 font-medium text-center">Score</th>
              <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {!feedbacks?.length ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-base-100 bg-background/50 rounded-b-lg">No feedbacks found.</td>
              </tr>
            ) : (
              feedbacks.map((fb) => (
                <tr key={fb.id} className="hover:bg-border/10">
                  <td className="px-4 py-3 font-medium max-w-xs xl:max-w-md truncate" title={fb.title}>{fb.title}</td>
                  <td className="px-4 py-3 text-base-100">{fb.company?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-center capitalize text-base-100">
                    <span className="bg-border/30 px-2 py-0.5 rounded-full text-xs shrink-0">{fb.status.replace('-', ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-base-100">
                    <span className={fb.upvotes - fb.downvotes > 0 ? "text-emerald-500" : fb.upvotes - fb.downvotes < 0 ? "text-red-500" : ""}>
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
    </div>
  )
}
