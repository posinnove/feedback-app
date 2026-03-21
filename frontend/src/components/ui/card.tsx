import * as React from 'react'
import { cn } from '../../lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('rounded-xl border border-border bg-card-bg', className)} {...props} />
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('p-5', className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return <h3 className={cn('text-base font-bold text-base-200', className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('text-sm text-base-100', className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('px-5 pb-5', className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
