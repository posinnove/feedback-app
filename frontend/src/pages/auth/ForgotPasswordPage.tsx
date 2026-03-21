import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { IconArrowLeft, IconCheck } from '@tabler/icons-react'
import { useForgotPasswordMutation } from '../../store/api/authApi'
import AuthImagePanel from '../../components/auth/AuthImagePanel'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import forgotBg from '../../assets/auth - signup - 4.jpg'

interface ForgotFormValues {
  email: string
}

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({ defaultValues: { email: '' } })

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const isBusy = isSubmitting || isLoading

  async function onSubmit(values: ForgotFormValues) {
    setApiError(null)
    try {
      await forgotPassword({ email: values.email }).unwrap()
      setSubmitted(true)
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message
      setApiError(msg ?? 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      <AuthImagePanel backgroundImage={forgotBg}>
        <div>
          <h2 className="text-3xl font-bold mb-3">Forgot your password?</h2>
          <p className="opacity-80 text-sm leading-relaxed">
            No worries — it happens to the best of us. Enter your email and we'll send you a reset
            link right away.
          </p>
        </div>
      </AuthImagePanel>

      {/* Right form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-12 bg-card-bg lg:border-l lg:border-border">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 text-sm text-base-100 hover:text-base-200 mb-8 transition-colors"
        >
          <IconArrowLeft size={16} stroke={1.5} />
          Back to login
        </Link>

        <div className="max-w-md w-full mx-auto">
          <h1 className="text-2xl font-bold text-base-200 mb-2">Reset your password</h1>
          <p className="text-base-100 text-sm mb-8">
            Enter your registered email and we'll send you a link to reset your password.
          </p>

          {apiError && (
            <div className="mb-5 px-4 py-3 bg-sidebar-bg border border-border text-base-200 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          {submitted ? (
            <div className="px-4 py-5 bg-sidebar-bg border border-border rounded-xl text-center">
              <div className="w-12 h-12 bg-card-bg border border-border rounded-full flex items-center justify-center mx-auto mb-3">
                <IconCheck size={22} className="text-status-completed" />
              </div>
              <p className="font-medium text-base-200">Check your inbox!</p>
              <p className="text-base-100 text-sm mt-1">
                If <strong>{getValues('email')}</strong> is registered, you'll receive a reset link
                shortly.
              </p>
              <Link
                to="/auth/login"
                className="mt-4 inline-block text-sm text-primary-600 hover:underline font-medium"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div>
                <label className="block text-sm font-medium text-base-200 mb-1.5">
                  Email address
                </label>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={errors.email ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email',
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isBusy} className="w-full">
                {isBusy ? 'Sending…' : 'Send reset link'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
