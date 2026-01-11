import type { Feedback } from '../types/feedback'
import { mockFeedbacks } from '../data/mockFeedback'

function Avatar({ name, avatar }: { name: string; avatar?: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className="w-6 h-6 rounded-full object-cover border-2 border-white"
      />
    )
  }

  const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-violet-500']
  const colorIndex = name.charCodeAt(0) % colors.length
  const bgColor = colors[colorIndex]

  return (
    <div
      className={`w-6 h-6 rounded-full ${bgColor} text-white text-xs flex items-center justify-center font-medium border-2 border-white`}
    >
      {initials}
    </div>
  )
}

function FeedbackCard({ feedback }: { feedback: Feedback }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const year = date.getFullYear()
    return `${day} ${month}, ${year}`
  }

  return (
    <div className="card flex flex-col p-0 overflow-hidden">
      <div className="flex items-start justify-between gap-2 p-4 pb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-base-200 truncate">{feedback.title}</h3>
          <p className="text-xs text-base-100 mt-1">#{feedback.postId}</p>
        </div>
        <div className="text-base-100 p-1">{formatDate(feedback.createdAt)}</div>
      </div>

      {feedback.description && (
        <div className="px-4 pt-0 pb-4">
          <p className="text-sm text-base-100 leading-relaxed">{feedback.description}</p>
        </div>
      )}

      <div className="px-4 pb-4 pt-3 mt-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-base-100">Reached to:</span>
          <div className="flex items-center -space-x-2">
            {feedback.reachedTo.slice(0, 5).map((user) => (
              <Avatar key={user.id} name={user.name} avatar={user.avatar} />
            ))}
            {feedback.reachedTo.length > 5 && (
              <div className="w-6 h-6 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center font-medium border-2 border-white">
                +{feedback.reachedTo.length - 5}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-base-100">
          <span>{formatDate(feedback.createdAt)}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span>{feedback.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{feedback.comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{feedback.upvotes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PublicFeedbackBoard({
  feedbacks = mockFeedbacks,
}: {
  feedbacks?: Feedback[]
}) {
  return (
    <div className="flex-1 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <main className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-base-200">Public Feedback</h1>
              <p className="text-sm text-base-100">
                See what your audience is saying — public submissions only.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="search"
                placeholder="Search feedback..."
                className="px-3 py-2 border border-border rounded-md focus:outline-none"
              />
              <select className="px-3 py-2 border border-border rounded-md">
                <option>Sort: Newest</option>
                <option>Sort: Most Upvotes</option>
                <option>Sort: Most Comments</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map((f) => (
              <FeedbackCard key={f.id} feedback={f} />
            ))}
          </div>
        </main>

        <aside className="space-y-4">
          <div className="card p-4">
            <h3 className="text-sm font-medium text-base-200 mb-2">Overview</h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="text-2xl font-bold">{feedbacks.length}</div>
                <div className="text-xs text-base-100">Total posts</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {feedbacks.reduce((s, x) => s + x.upvotes, 0)}
                </div>
                <div className="text-xs text-base-100">Total upvotes</div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-base-200 mb-2">Filters</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> <span className="text-sm">Show images</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> <span className="text-sm">Only open</span>
              </label>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium text-base-200 mb-2">Top Contributors</h3>
            <div className="flex flex-col gap-2">
              {Array.from(
                feedbacks
                  .flatMap((f) => f.reachedTo.map((r) => r.name))
                  .reduce(
                    (m, name) => m.set(name, (m.get(name) || 0) + 1),
                    new Map<string, number>()
                  )
              ).map(([name, count]) => (
                <div key={name} className="flex items-center gap-3">
                  <Avatar name={name} />
                  <div className="flex-1 text-sm">{name}</div>
                  <div className="text-xs text-base-100">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
