import * as React from 'react'
import { cn } from '../../lib/utils'

type InputProps = React.ComponentProps<'input'>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-lg border border-border bg-sidebar-bg px-3 py-2 text-base-200 placeholder:text-base-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-70',
        className
      )}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export { Input }
