import { IconArrowUp, IconArrowDown } from '@tabler/icons-react'
import { useAppSelector } from '../../store/hooks'
import { useGoogleSilentLogin } from '../../hooks/useGoogleSilentLogin'
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
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const triggerSilentLogin = useGoogleSilentLogin()

  function handleVote(event: MouseEvent<HTMLButtonElement>, handler?: () => void) {
    event.preventDefault()
    event.stopPropagation()

    if (!isAuthenticated) {
      triggerSilentLogin()
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
          'h-6 w-6 rounded p-0 text-base-100 hover:bg-blue-500/15 hover:text-blue-500',
          userVote === 'up' ? 'text-blue-500' : ''
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
          'h-6 w-6 rounded p-0 text-base-100 hover:bg-red-500/15 hover:text-red-500',
          userVote === 'down' ? 'text-red-500' : ''
        )}
        aria-label="Downvote"
      >
        <IconArrowDown size={14} stroke={1.5} />
      </Button>
      <span className="font-medium min-w-[2ch] text-center">{downvotes}</span>
    </div>
  )
}
