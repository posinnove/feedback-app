import { IconArrowUp, IconArrowDown } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import type { MouseEvent } from 'react'

interface VoteButtonsProps {
  upvotes: number
  downvotes: number
  onUpvote?: () => void
  onDownvote?: () => void
  userVote?: 'up' | 'down' | null
}

export default function VoteButtons({
  upvotes,
  downvotes,
  onUpvote,
  onDownvote,
  userVote,
}: VoteButtonsProps) {
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)

  function handleVote(event: MouseEvent<HTMLButtonElement>, handler?: () => void) {
    event.preventDefault()
    event.stopPropagation()

    if (!isAuthenticated) {
      navigate('/auth/login?reason=vote')
      return
    }
    handler?.()
  }

  return (
    <div className="flex items-center gap-1 text-xs text-base-100 bg-border/50 rounded-md px-1.5 py-1">
      <button
        type="button"
        onClick={(event) => handleVote(event, onUpvote)}
        className={`p-0.5 rounded hover:bg-blue-100 hover:cursor-pointer hover:text-blue-600 transition-colors ${userVote === 'up' ? 'text-primary-600' : ''}`}
        aria-label="Upvote"
      >
        <IconArrowUp size={14} stroke={1.5} />
      </button>
      <span className="font-medium min-w-[2ch] text-center">{upvotes}</span>
      <button
        type="button"
        onClick={(event) => handleVote(event, onDownvote)}
        className={`p-0.5 rounded hover:bg-red-100 hover:cursor-pointer hover:text-red-600 transition-colors ${userVote === 'down' ? 'text-status-rejected' : ''}`}
        aria-label="Downvote"
      >
        <IconArrowDown size={14} stroke={1.5} />
      </button>
      <span className="font-medium min-w-[2ch] text-center">{downvotes}</span>
    </div>
  )
}
