import type { Feedback } from '../types/feedback'

interface FeedbackBoardProps {
  feedbacks: Feedback[]
}

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
      {/* Header */}
      <div className="flex items-start justify-between gap-2 p-4 pb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-base-200 truncate">{feedback.title}</h3>
          <p className="text-xs text-base-100 mt-1">#{feedback.postId}</p>
        </div>
        <button className="text-base-100 hover:text-base-200 p-1">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 10.8333C10.4602 10.8333 10.8333 10.4602 10.8333 10C10.8333 9.53976 10.4602 9.16667 10 9.16667C9.53976 9.16667 9.16667 9.53976 9.16667 10C9.16667 10.4602 9.53976 10.8333 10 10.8333Z"
              fill="currentColor"
            />
            <path
              d="M10 5.83333C10.4602 5.83333 10.8333 5.46024 10.8333 5C10.8333 4.53976 10.4602 4.16667 10 4.16667C9.53976 4.16667 9.16667 4.53976 9.16667 5C9.16667 5.46024 9.53976 5.83333 10 5.83333Z"
              fill="currentColor"
            />
            <path
              d="M10 15.8333C10.4602 15.8333 10.8333 15.4602 10.8333 15C10.8333 14.5398 10.4602 14.1667 10 14.1667C9.53976 14.1667 9.16667 14.5398 9.16667 15C9.16667 15.4602 9.53976 15.8333 10 15.8333Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* Image */}
      {feedback.image && (
        <div className="w-full h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 overflow-hidden">
          <img src={feedback.image} alt={feedback.title} className="w-full h-full object-cover" />
        </div>
      )}
      {!feedback.image && (
        <div className="w-full h-48 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-blue-400/30 blur-3xl -translate-x-8"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-purple-400/40 blur-2xl translate-x-8"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-indigo-300/50 blur-xl"></div>
          </div>
        </div>
      )}

      {/* Description (if exists) */}
      {feedback.description && (
        <div className="px-4 pt-4 pb-2">
          <p className="text-sm text-base-100 leading-relaxed">{feedback.description}</p>
        </div>
      )}

      {/* Footer */}
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
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 11C9.65685 11 11 9.65685 11 8C11 6.34315 9.65685 5 8 5C6.34315 5 5 6.34315 5 8C5 9.65685 6.34315 11 8 11Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 2.5L4.5 4.5M11.5 4.5L13.5 2.5M13.5 13.5L11.5 11.5M4.5 11.5L2.5 13.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{feedback.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 6C3 4.89543 3.89543 4 5 4H11C12.1046 4 13 4.89543 13 6V11C13 12.1046 12.1046 13 11 13H8L5 15V13H5C3.89543 13 3 12.1046 3 11V6Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{feedback.comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 13V3M8 3L4 7M8 3L12 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{feedback.upvotes}</span>
            </div>
            <span>{feedback.views + feedback.comments + feedback.upvotes}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FeedbackBoard({ feedbacks }: FeedbackBoardProps) {
  return (
    <div className="flex-1 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Breadcrumbs */}
        <nav className="mb-4">
          <ol className="flex items-center gap-2 text-sm text-base-100">
            <li>Home</li>
            <li>/</li>
            <li className="text-base-200 font-medium">Feedback Posts</li>
          </ol>
        </nav>

        {/* Header with Title and Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-base-200">Feedback Posts</h1>
          <button className="btn btn-primary flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 4V16M4 10H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Feed back post
          </button>
        </div>

        {feedbacks.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-base-100">No feedback available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feedbacks.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
