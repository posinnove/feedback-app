import { IconArrowUp, IconArrowDown } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'
import type { MouseEvent } from 'react'
import { Button } from './button'
import { cn } from '../../lib/utils'

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
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={(event) => handleVote(event, onUpvote)}
        className={cn(
          'h-6 w-6 rounded p-0 text-base-100 hover:bg-blue-100 hover:text-blue-600',
          userVote === 'up' ? 'text-primary-600' : ''
        )}
        aria-label="Upvote"
      >
        <IconArrowUp size={14} stroke={1.5} />
      </Button>
      <span className="font-medium min-w-[2ch] text-center">{upvotes}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={(event) => handleVote(event, onDownvote)}
        className={cn(
          'h-6 w-6 rounded p-0 text-base-100 hover:bg-red-100 hover:text-red-600',
          userVote === 'down' ? 'text-status-rejected' : ''
        )}
        aria-label="Downvote"
      >
        <IconArrowDown size={14} stroke={1.5} />
      </Button>
      <span className="font-medium min-w-[2ch] text-center">{downvotes}</span>
    </div>
  )
}
