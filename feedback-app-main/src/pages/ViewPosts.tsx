import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCompanyFeedback, Feedback } from '../api/companyFeedback'
import PostCard from '../components/posts/PostCard'
import KanbanColumn from '../components/posts/KanbanColumn'
import { LayoutGrid, Columns3, Rows3 } from 'lucide-react'

type ViewMode = 'board' | 'kanban-horizontal' | 'kanban-vertical'

export default function ViewPosts() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('board')

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const data = await fetchCompanyFeedback()
        setItems(data)
      } catch (e: any) {
        setError(e.message ?? 'Failed to load posts')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const grouped = useMemo(() => {
    return {
      open: items.filter((item) => item.status === 'open'),
      reviewed: items.filter((item) => item.status === 'reviewed'),
      resolved: items.filter((item) => item.status === 'resolved'),
    }
  }, [items])

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Feedback Posts</h1>
          <p className="text-sm text-gray-500">Manage posts in board or kanban view</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setViewMode('board')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'board'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutGrid size={18} />
            </button>

            <button
              onClick={() => setViewMode('kanban-horizontal')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'kanban-horizontal'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Columns3 size={18} />
            </button>

            <button
              onClick={() => setViewMode('kanban-vertical')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'kanban-vertical'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Rows3 size={18} />
            </button>
          </div>

          <button
            onClick={() => navigate('/posts/create')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            + Create Post
          </button>
        </div>
      </div>

      {viewMode === 'board' && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {viewMode === 'kanban-horizontal' && (
        <div className="grid gap-4 xl:grid-cols-3">
          <KanbanColumn title="Open" posts={grouped.open} status="open" />
          <KanbanColumn title="Reviewed" posts={grouped.reviewed} status="reviewed" />
          <KanbanColumn title="Resolved" posts={grouped.resolved} status="resolved" />
        </div>
      )}

      {viewMode === 'kanban-vertical' && (
        <div className="space-y-6">
          <KanbanColumn title="Open" posts={grouped.open} status="open" />
          <KanbanColumn title="Reviewed" posts={grouped.reviewed} status="reviewed" />
          <KanbanColumn title="Resolved" posts={grouped.resolved} status="resolved" />
        </div>
      )}
    </div>
  )
}
