import * as React from 'react'
import { cn } from '../../lib/utils'

type InteractiveRowProps = React.ComponentProps<'button'>

const InteractiveRow = React.forwardRef<HTMLButtonElement, InteractiveRowProps>(
  ({ className, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'w-full rounded-lg text-left transition-colors hover:cursor-pointer hover:bg-border/40',
          className
        )}
        {...props}
      />
    )
  }
)

InteractiveRow.displayName = 'InteractiveRow'

export { InteractiveRow }
