/**
 * Format a date string as "25 Sep, 2026"
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
        console.warn('[formatDate] Invalid date string:', dateString)
        return '—'
    }
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'short' })
    const year = date.getFullYear()
    return `${day} ${month}, ${year}`
}

/**
 * Format a date string as a relative time, e.g. "19 min. ago", "2 hours ago", "3 days ago"
 */
export function timeAgo(dateString: string): string {
    const now = new Date()
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
        console.warn('[timeAgo] Invalid date string:', dateString)
        return '—'
    }
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)

    if (diffSeconds < 60) return 'just now'
    if (diffMinutes < 60) return `${diffMinutes} min. ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`
}
