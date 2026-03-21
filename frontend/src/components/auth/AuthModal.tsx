import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBuilding, IconUser, IconEye, IconEyeOff } from '@tabler/icons-react'
import { useAppDispatch } from '../../store/hooks'
import { setCredentials } from '../../store/slices/authSlice'
import {
  useLoginMutation,
  useGoogleLoginMutation,
  extractEntityFromUnifiedResponse,
  type UnifiedLoginResponse,
} from '../../store/api/authApi'
import { loginSchema, type LoginInput } from '../../schemas/auth.schema'
import UserRegisterForm from './UserRegisterForm'
import CompanyRegisterForm from './CompanyRegisterForm'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

type Mode = 'login' | 'register'
type RegisterType = 'user' | 'company'

interface Props {
  open: boolean
  mode: Mode
  onClose: () => void
}

interface GoogleIdApi {
  initialize: (config: {
    client_id: string
    callback: (response: { credential?: string }) => void
  }) => void
  prompt: () => void
}

interface GoogleApiWindow extends Window {
  google?: {
    accounts?: {
      id?: GoogleIdApi
    }
  }
}

const REASON_COPY: Record<string, string> = {
  vote: 'Sign in to vote on feedback.',
  'vote-feedback': 'Sign in to vote on feedback.',
  follow: 'Sign in to follow companies.',
  'request-feedback': 'Sign in to submit feedback requests.',
  'session-timeout': 'Your session expired due to inactivity. Please sign in again.',
}

export default function AuthModal({ open, mode, onClose }: Props) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [registerType, setRegisterType] = useState<RegisterType>('user')
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null)
  const [isGoogleApiReady, setIsGoogleApiReady] = useState(false)
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  const reason = searchParams.get('reason')
  const reasonMessage = reason ? REASON_COPY[reason] : null

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const [login, { isLoading }] = useLoginMutation()
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation()
  const isLoginBusy = isSubmitting || isLoading

  const handleUnifiedSuccess = useCallback(
    async (response: UnifiedLoginResponse) => {
      const entity = extractEntityFromUnifiedResponse(response)
      dispatch(
        setCredentials({
          entity,
          type: response.type,
          accessToken: response.accessToken,
        })
      )
      reset()
      onClose()
      navigate('/feed', { replace: true })
    },
    [dispatch, navigate, onClose, reset]
  )

  useEffect(() => {
    if (!open) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const registerTypeLabel = useMemo(
    () => (registerType === 'user' ? 'Personal' : 'Business'),
    [registerType]
  )

  async function onLoginSubmit(values: LoginInput) {
    setApiError(null)
    try {
      const response = await login(values).unwrap()
      await handleUnifiedSuccess(response)
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message
      setApiError(msg ?? 'Login failed. Please try again.')
    }
  }

  useEffect(() => {
    if (!open || !googleClientId) return

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    ) as HTMLScriptElement | null

    const initializeGoogle = () => {
      const googleApi = (window as GoogleApiWindow).google?.accounts?.id
      if (!googleApi) return

      googleApi.initialize({
        client_id: googleClientId,
        callback: async (response: { credential?: string }) => {
          setApiError(null)
          if (!response.credential) {
            setApiError('Google login failed. Please try again.')
            return
          }

          try {
            const result = await googleLogin({
              idToken: response.credential,
              accountType: mode === 'register' ? registerType : undefined,
            }).unwrap()
            await handleUnifiedSuccess(result)
          } catch (err: unknown) {
            const msg = (err as { data?: { message?: string } })?.data?.message
            setApiError(msg ?? 'Google login failed. Please try again.')
          }
        },
      })
      setIsGoogleApiReady(true)
    }

    if (existingScript) {
      if ((window as GoogleApiWindow).google?.accounts?.id) {
        initializeGoogle()
      } else {
        existingScript.addEventListener('load', initializeGoogle, { once: true })
      }
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = initializeGoogle
    document.head.appendChild(script)
  }, [open, mode, registerType, googleClientId, googleLogin, handleUnifiedSuccess])

  function handleGoogleButtonClick() {
    const googleApi = (window as GoogleApiWindow).google?.accounts?.id
    if (!googleApi) {
      setApiError('Google sign in is still loading. Please try again.')
      return
    }

    setApiError(null)
    googleApi.prompt()
  }

  function goToMode(next: Mode) {
    setApiError(null)
    setSignupSuccess(null)
    const search = searchParams.toString()
    navigate(`/auth/${next}${search ? `?${search}` : ''}`)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose()
        }
      }}
    >
      <DialogContent className="max-h-[92vh] overflow-y-auto custom-scroll">
        <DialogHeader>
          <DialogTitle>Welcome to Voxella</DialogTitle>
          <DialogDescription>
            {reasonMessage ?? 'Join the conversation around product feedback.'}
          </DialogDescription>
        </DialogHeader>

        {apiError && (
          <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleSubmit(onLoginSubmit)} className="mt-5 space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-base-200 mb-1.5">Email</label>
              <Input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={errors.email ? 'border-red-400 focus-visible:ring-red-400' : ''}
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-base-200 mb-1.5">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`pr-10 ${errors.password ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                  {...register('password')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 h-auto w-auto px-0 py-0 text-base-100 hover:bg-transparent hover:text-base-200"
                >
                  {showPassword ? (
                    <IconEyeOff size={17} stroke={1.5} />
                  ) : (
                    <IconEye size={17} stroke={1.5} />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
              <div className="mt-2 text-right">
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-primary-600 hover:underline"
                  onClick={() => onClose()}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" disabled={isLoginBusy} className="w-full">
              {isLoginBusy ? 'Signing in…' : 'Sign in'}
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs text-base-100 uppercase tracking-wide">or</span>
              <div className="h-px bg-border flex-1" />
            </div>

            {googleClientId && (
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={handleGoogleButtonClick}
                disabled={isGoogleLoading || !isGoogleApiReady}
              >
                {isGoogleLoading ? 'Signing in…' : 'Continue with Google'}
              </Button>
            )}

            <p className="text-xs text-base-100 text-center">
              Don&apos;t have an account?{' '}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => goToMode('register')}
                className="h-auto px-0 py-0 text-primary-600 hover:bg-transparent hover:underline"
              >
                Sign up
              </Button>
            </p>
          </form>
        )}

        {mode === 'register' && (
          <div className="mt-5">
            <div className="mb-5">
              <label className="block text-xs text-base-100 mb-1.5">Account Type</label>
              <div className="flex gap-1 bg-sidebar-bg border border-border rounded-xl p-1">
                {(['user', 'company'] as RegisterType[]).map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRegisterType(type)
                      setApiError(null)
                      setSignupSuccess(null)
                    }}
                    className={`h-auto flex-1 py-2 text-sm font-medium transition-colors ${
                      registerType === type
                        ? 'bg-card-bg text-primary-600 shadow-sm'
                        : 'text-base-100 hover:text-base-200'
                    }`}
                  >
                    {type === 'user' ? (
                      <IconUser size={16} stroke={1.5} />
                    ) : (
                      <IconBuilding size={16} stroke={1.5} />
                    )}
                    {type === 'user' ? 'Personal' : 'Business'}
                  </Button>
                ))}
              </div>
            </div>

            {signupSuccess && (
              <div className="mb-5 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                {signupSuccess}
              </div>
            )}

            {!signupSuccess && registerType === 'user' && (
              <UserRegisterForm
                onSuccess={setSignupSuccess}
                onApiError={(message) => setApiError(message || null)}
              />
            )}

            {!signupSuccess && registerType === 'company' && (
              <CompanyRegisterForm
                onSuccess={setSignupSuccess}
                onApiError={(message) => setApiError(message || null)}
              />
            )}

            {!signupSuccess && (
              <>
                <div className="flex items-center gap-3 mt-4">
                  <div className="h-px bg-border flex-1" />
                  <span className="text-xs text-base-100 uppercase tracking-wide">or</span>
                  <div className="h-px bg-border flex-1" />
                </div>

                {googleClientId && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-3 w-full"
                    onClick={handleGoogleButtonClick}
                    disabled={isGoogleLoading || !isGoogleApiReady}
                  >
                    {isGoogleLoading ? 'Signing in…' : 'Continue with Google'}
                  </Button>
                )}
              </>
            )}

            {signupSuccess && (
              <Button type="button" onClick={() => goToMode('login')} className="w-full">
                Continue to sign in ({registerTypeLabel})
              </Button>
            )}

            {!signupSuccess && (
              <p className="text-xs text-base-100 text-center mt-3">
                Already have an account?{' '}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => goToMode('login')}
                  className="h-auto px-0 py-0 text-primary-600 hover:bg-transparent hover:underline"
                >
                  Sign in
                </Button>
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
