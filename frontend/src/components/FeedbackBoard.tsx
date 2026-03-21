import {
  IconDotsVertical,
  IconPlus,
  IconFocus2,
  IconMessage,
  IconArrowUp,
} from '@tabler/icons-react'
import type { Feedback } from '../types/feedback'
import Avatar from './ui/Avatar'
import SafeHtml from './SafeHtml'
import { formatDate } from '../utils/formatDate'
import { Button } from './ui/button'
import { Card } from './ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface FeedbackBoardProps {
  feedbacks: Feedback[]
}

function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return (
    <Card className="flex flex-col p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 p-4 pb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-base-200 truncate">{feedback.title}</h3>
          <p className="text-xs text-base-100 mt-1">#{feedback.postId}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto rounded-md p-1 text-base-100 transition-colors hover:bg-border/40 hover:text-base-200"
              aria-label="Feedback actions"
            >
              <IconDotsVertical size={20} stroke={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>Open</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Image */}
      {feedback.image && (
        <div className="w-full h-48 bg-linear-to-br from-blue-400 via-purple-500 to-pink-500 overflow-hidden">
          <img src={feedback.image} alt={feedback.title} className="w-full h-full object-cover" />
        </div>
      )}
      {!feedback.image && (
        <div className="w-full h-48 bg-linear-to-br from-blue-500 via-indigo-600 to-purple-600 relative overflow-hidden">
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

      {/* Description */}
      {feedback.description && (
        <div className="px-4 pt-4 pb-2">
          <SafeHtml html={feedback.description} className="text-sm text-base-100 leading-relaxed" />
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
              <div className="w-6 h-6 rounded-full bg-base-100 text-white text-xs flex items-center justify-center font-medium border-2 border-card-bg">
                +{feedback.reachedTo.length - 5}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-base-100">
          <span>{formatDate(feedback.createdAt)}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <IconFocus2 size={16} stroke={1.5} />
              <span>{feedback.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <IconMessage size={16} stroke={1.5} />
              <span>{feedback.comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <IconArrowUp size={16} stroke={1.5} />
              <span>{feedback.upvotes}</span>
            </div>
            <span>{feedback.views + feedback.comments + feedback.upvotes}</span>
          </div>
        </div>
      </div>
    </Card>
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
          <Button className="flex items-center gap-2">
            <IconPlus size={20} stroke={2} />
            Feedback post
          </Button>
        </div>

        {feedbacks.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-base-100">No feedback available at this time.</p>
          </Card>
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
