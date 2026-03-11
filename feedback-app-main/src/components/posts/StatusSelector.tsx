import { FeedbackStatus } from '../../types/post'

const statuses: FeedbackStatus[] = [
  'UNDER_REVIEW',
  'PLANNED',
  'IN_PROGRESS',
  'COMPLETED',
  'REJECTED',
]

interface Props {
  value: FeedbackStatus
  onChange: (status: FeedbackStatus) => void
}

export default function StatusSelector({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as FeedbackStatus)}
      className="border rounded-md px-3 py-1 text-sm"
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status.replace('_', ' ')}
        </option>
      ))}
    </select>
  )
}
