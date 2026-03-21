import { Badge } from './badge'
import { cn } from '../../lib/utils'

type Status = 'planned' | 'in-progress' | 'completed' | 'under-review' | 'rejected'

interface StatusBadgeProps {
  status: string
}

const STATUS_STYLES: Record<Status, string> = {
  planned: 'bg-status-planned/10 text-status-planned',
  'in-progress': 'bg-status-in-progress/10 text-status-in-progress',
  completed: 'bg-status-completed/10 text-status-completed',
  'under-review': 'bg-status-under-review/10 text-status-under-review',
  rejected: 'bg-status-rejected/10 text-status-rejected',
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status as Status] ?? STATUS_STYLES['under-review']
  const label = status.replace(/-/g, ' ')

  return (
    <Badge
      className={cn(
        'border-0 px-2.5 py-1 text-[11px] font-semibold capitalize tracking-normal',
        style
      )}
    >
      {label}
    </Badge>
  )
}
