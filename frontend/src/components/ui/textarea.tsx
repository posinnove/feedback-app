import * as React from 'react'
import { cn } from '../../lib/utils'

type TextareaProps = React.ComponentProps<'textarea'>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-border bg-sidebar-bg px-3 py-2 text-base-200 placeholder:text-base-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-70',
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
