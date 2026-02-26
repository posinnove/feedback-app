import { useState } from 'react'
import { IconShare } from '@tabler/icons-react'
import { toast } from 'sonner'

interface ShareButtonProps {
    /** URL to share. Defaults to the current page URL. */
    url?: string
    /** Label text shown next to icon. Defaults to "Share". */
    label?: string
    /** Additional CSS classes for the button. */
    className?: string
    /** Icon size in pixels. */
    size?: number
    /** Visual variant. */
    variant?: 'default' | 'primary'
}

export default function ShareButton({
    url,
    label = 'Share',
    className = '',
    size = 16,
    variant = 'default',
}: ShareButtonProps) {
    const [sharing, setSharing] = useState(false)

    const handleShare = async () => {
        const shareUrl = url ?? window.location.href

        // Try native share API first (mobile)
        if (navigator.share) {
            try {
                setSharing(true)
                await navigator.share({ url: shareUrl })
            } catch (err) {
                // User cancelled — ignore AbortError
                if (err instanceof Error && err.name !== 'AbortError') {
                    console.error('Share failed:', err)
                }
            } finally {
                setSharing(false)
            }
            return
        }

        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(shareUrl)
            toast.success('Link copied to clipboard!')
        } catch {
            toast.error('Failed to copy link')
        }
    }

    const baseStyles =
        variant === 'primary'
            ? 'btn btn-primary flex items-center gap-2 w-full justify-center text-sm'
            : 'flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors text-xs text-base-100'

    return (
        <button
            onClick={handleShare}
            disabled={sharing}
            className={`${baseStyles} ${className}`}
            aria-label="Share"
        >
            <IconShare size={size} stroke={1.5} />
            {label && <span>{label}</span>}
        </button>
    )
}
