import { cn } from '../../lib/utils'

interface PopoverHeaderProps {
  title: string
  meta?: string
  className?: string
}

function PopoverHeader({ title, meta, className }: PopoverHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 border-b border-border px-4 py-3',
        className
      )}
    >
      <p className="text-sm font-semibold text-base-200">{title}</p>
      {meta ? <span className="text-xs text-base-100">{meta}</span> : null}
    </div>
  )
}

export { PopoverHeader }
