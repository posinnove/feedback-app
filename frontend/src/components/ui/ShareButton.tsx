import { useState } from 'react'
import {
  IconShare3,
  IconCopy,
  IconBrandWhatsapp,
  IconBrandInstagram,
  IconBrandX,
  IconBrandLinkedin,
} from '@tabler/icons-react'
import { toast } from 'sonner'
import type { MouseEvent } from 'react'
import { Button } from './button'
import { cn } from '../../lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu'

interface ShareButtonProps {
  url?: string
  label?: string
  className?: string
  size?: number
  variant?: 'default' | 'primary'
}

export default function ShareButton({
  url,
  label = 'Share',
  className = '',
  size = 16,
  variant = 'default',
}: ShareButtonProps) {
  const [copying, setCopying] = useState(false)

  const shareUrl = url ?? window.location.href

  const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const copyLink = async () => {
    try {
      setCopying(true)
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard!')
    } catch {
      toast.error('Failed to copy link')
    } finally {
      setCopying(false)
    }
  }

  const openShareWindow = (destination: 'whatsapp' | 'instagram' | 'x' | 'linkedin') => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedText = encodeURIComponent('Check this out')

    if (destination === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, '_blank', 'noopener,noreferrer')
      return
    }

    if (destination === 'x') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
        '_blank',
        'noopener,noreferrer'
      )
      return
    }

    if (destination === 'linkedin') {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        '_blank',
        'noopener,noreferrer'
      )
      return
    }

    void copyLink()
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer')
    toast.message('Instagram opened. Paste your copied link in a post or DM.')
  }

  const isPrimary = variant === 'primary'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isPrimary ? 'default' : 'secondary'}
          size="sm"
          onClick={handleTriggerClick}
          disabled={copying}
          className={cn(
            isPrimary
              ? 'w-full justify-center gap-2 text-sm'
              : 'h-7 gap-1 bg-border/50 px-2 py-1 text-xs font-medium text-base-100 hover:bg-border',
            className
          )}
          aria-label="Share"
        >
          <IconShare3 size={size} stroke={1.5} />
          {label && <span>{label}</span>}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Share Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void copyLink()}>
          <IconCopy size={16} stroke={1.5} />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => openShareWindow('whatsapp')}>
          <IconBrandWhatsapp size={16} stroke={1.5} />
          Share to WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => openShareWindow('instagram')}>
          <IconBrandInstagram size={16} stroke={1.5} />
          Share to Instagram
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => openShareWindow('x')}>
          <IconBrandX size={16} stroke={1.5} />
          Share to X
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => openShareWindow('linkedin')}>
          <IconBrandLinkedin size={16} stroke={1.5} />
          Share to LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
