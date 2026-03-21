import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { IconArrowLeft, IconCheck, IconAlertCircle, IconEye, IconEyeOff } from '@tabler/icons-react'
import { useResetPasswordMutation } from '../../store/api/authApi'
import AuthImagePanel from '../../components/auth/AuthImagePanel'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import forgotBg from '../../assets/auth - signup - 4.jpg'

interface ResetFormValues {
  password: string
  confirm: string
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({ defaultValues: { password: '', confirm: '' } })

  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const isBusy = isSubmitting || isLoading
  const watchedPassword = useWatch({ control, name: 'password', defaultValue: '' })

  async function onSubmit(values: ResetFormValues) {
    setApiError(null)
    if (!token) {
      setApiError('No reset token found. Please request a new password reset link.')
      return
    }
    try {
      await resetPassword({ token, password: values.password }).unwrap()
      setSuccess(true)
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message
      setApiError(msg ?? 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      <AuthImagePanel backgroundImage={forgotBg}>
        <div>
          <h2 className="text-3xl font-bold mb-3">Create a new password</h2>
          <p className="opacity-80 text-sm leading-relaxed">
            Choose a strong password to keep your account secure.
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
          <h1 className="text-2xl font-bold text-base-200 mb-2">Set new password</h1>
          <p className="text-base-100 text-sm mb-8">Enter your new password below.</p>

          {apiError && (
            <div className="mb-5 px-4 py-3 bg-sidebar-bg border border-border rounded-lg flex items-start gap-2 text-sm text-base-200">
              <IconAlertCircle size={16} className="mt-0.5 shrink-0 text-status-rejected" />
              {apiError}
            </div>
          )}

          {!token && !success && (
            <div className="mb-5 px-4 py-3 bg-sidebar-bg border border-border rounded-lg text-sm text-base-200">
              No reset token found in the URL. Please use the link from your email.
            </div>
          )}

          {success ? (
            <div className="px-4 py-5 bg-sidebar-bg border border-border rounded-xl text-center">
              <div className="w-12 h-12 bg-card-bg border border-border rounded-full flex items-center justify-center mx-auto mb-3">
                <IconCheck size={22} className="text-status-completed" />
              </div>
              <p className="font-medium text-base-200">Password reset successfully!</p>
              <p className="text-base-100 text-sm mt-1">
                You can now log in with your new password.
              </p>
              <Link to="/auth/login" className="mt-4 inline-flex">
                <Button className="px-6">Sign in</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* New password */}
              <div>
                <label className="block text-sm font-medium text-base-200 mb-1.5">
                  New password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    className={`pr-10 ${errors.password ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Must be at least 8 characters' },
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 h-auto w-auto -translate-y-1/2 px-0 py-0 text-base-100 transition-colors hover:bg-transparent hover:text-base-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-base-200 mb-1.5">
                  Confirm password
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  className={errors.confirm ? 'border-red-400 focus-visible:ring-red-400' : ''}
                  {...register('confirm', {
                    required: 'Please confirm your password',
                    validate: (val) => val === watchedPassword || "Passwords don't match",
                  })}
                />
                {errors.confirm && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirm.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isBusy || !token} className="w-full">
                {isBusy ? 'Resetting…' : 'Reset password'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
