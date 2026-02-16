interface VoteButtonsProps {
    count: number
    onUpvote?: () => void
    onDownvote?: () => void
    userVote?: 'up' | 'down' | null
}

export default function VoteButtons({ count, onUpvote, onDownvote, userVote }: VoteButtonsProps) {
    return (
        <div className="flex items-center gap-1 text-xs text-base-100">
            <button
                onClick={onUpvote}
                className={`p-0.5 rounded hover:bg-gray-100 transition-colors ${userVote === 'up' ? 'text-primary-600' : ''
                    }`}
                aria-label="Upvote"
            >
                <svg
                    width="14"
                    height="14"
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
            </button>
            <span className="font-medium min-w-[1ch] text-center">{count}</span>
            <button
                onClick={onDownvote}
                className={`p-0.5 rounded hover:bg-gray-100 transition-colors ${userVote === 'down' ? 'text-status-rejected' : ''
                    }`}
                aria-label="Downvote"
            >
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M8 3V13M8 13L4 9M8 13L12 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    )
}
