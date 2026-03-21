import { IconAlertCircle } from '@tabler/icons-react'
import { Card } from './ui/card'

export default function EmptyState() {
  return (
    <Card className="p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
        <IconAlertCircle size={28} stroke={2} className="text-primary-600" />
      </div>
      <h3 className="text-lg font-semibold text-base-200 mb-2">No feedback yet</h3>
      <p className="text-sm text-base-100 max-w-sm mx-auto">
        This company hasn't received any feedback submissions yet. Check back later!
      </p>
    </Card>
  )
}
