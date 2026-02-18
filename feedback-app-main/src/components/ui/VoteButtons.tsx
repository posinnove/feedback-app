import { IconArrowUp, IconArrowDown } from '@tabler/icons-react'

interface VoteButtonsProps {
    count: number
    onUpvote?: () => void
    onDownvote?: () => void
    userVote?: 'up' | 'down' | null
}

export default function VoteButtons({ count, onUpvote, onDownvote, userVote }: VoteButtonsProps) {
    return (
        <div className="flex items-center gap-1 text-xs text-base-100 bg-gray-100 rounded-md px-1.5 py-1">
            <button
                onClick={onUpvote}
                className={`p-0.5 rounded hover:bg-blue-100 hover:text-blue-600 transition-colors ${userVote === 'up' ? 'text-primary-600' : ''
                    }`}
                aria-label="Upvote"
            >
                <IconArrowUp size={14} stroke={1.5} />
            </button>
            <span className="font-medium min-w-[1ch] text-center">{count}</span>
            <button
                onClick={onDownvote}
                className={`p-0.5 rounded hover:bg-red-100 hover:text-red-600 transition-colors ${userVote === 'down' ? 'text-status-rejected' : ''
                    }`}
                aria-label="Downvote"
            >
                <IconArrowDown size={14} stroke={1.5} />
            </button>
        </div>
    )
}
