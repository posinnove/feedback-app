import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { IconCircleCheck, IconAlertCircle, IconLoader2 } from '@tabler/icons-react'
import { useVerifyEmailQuery } from '../../store/api/authApi'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const { isLoading, isSuccess, isError } = useVerifyEmailQuery(token, { skip: !token })

  // scroll to top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full text-center py-12 px-8">
        {/* Logo */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xl font-bold text-primary-600 mb-8"
        >
          <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-lg font-black">
            V
          </span>
          VOXELLA
        </Link>

        {isLoading && (
          <>
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconLoader2 size={32} className="icon-adaptive animate-spin" />
            </div>
            <h1 className="text-xl font-semibold text-base-200 mb-2">Verifying your email…</h1>
            <p className="text-base-100 text-sm">Please wait a moment.</p>
          </>
        )}

        {!token && (
          <>
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconAlertCircle size={32} className="text-yellow-500" />
            </div>
            <h1 className="text-xl font-semibold text-base-200 mb-2">No token provided</h1>
            <p className="text-base-100 text-sm mb-6">
              The verification link appears to be invalid.
            </p>
            <Link to="/" className="inline-flex">
              <Button className="px-6">Go home</Button>
            </Link>
          </>
        )}

        {isSuccess && (
          <>
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconCircleCheck size={32} className="text-green-500" />
            </div>
            <h1 className="text-xl font-semibold text-base-200 mb-2">Email verified!</h1>
            <p className="text-base-100 text-sm mb-6">
              Your account is now active. You can log in and start using Voxella.
            </p>
            <Link to="/auth/login" className="inline-flex">
              <Button className="px-6">Sign in</Button>
            </Link>
          </>
        )}

        {isError && (
          <>
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconAlertCircle size={32} className="text-red-500" />
            </div>
            <h1 className="text-xl font-semibold text-base-200 mb-2">Verification failed</h1>
            <p className="text-base-100 text-sm mb-6">
              The link may have expired or already been used. Request a new verification email.
            </p>
            <Link to="/auth/login" className="inline-flex">
              <Button className="px-6">Back to login</Button>
            </Link>
          </>
        )}
      </Card>
    </div>
  )
}
