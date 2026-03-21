import { Link } from 'react-router-dom'
import { IconCircleX } from '@tabler/icons-react'
import { Card } from './ui/card'
import { Button } from './ui/button'

export default function NotFoundState() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="max-w-md p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <IconCircleX size={28} stroke={2} className="text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-base-200 mb-2">Company not found</h3>
        <p className="text-sm text-base-100 mb-4">
          The company you're looking for doesn't exist or the URL may be incorrect.
        </p>
        <Link to="/" className="inline-flex">
          <Button size="sm">Go to Home</Button>
        </Link>
      </Card>
    </div>
  )
}
