import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBuilding, IconUser, IconX, IconEye, IconEyeOff } from '@tabler/icons-react'
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
  renderButton: (
    parent: HTMLElement,
    options: {
      theme: 'outline' | 'filled_blue' | 'filled_black'
      size: 'large' | 'medium' | 'small'
      width?: number
      text?: string
    }
  ) => void
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
  const googleButtonRef = useRef<HTMLDivElement | null>(null)
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
    if (!open || !googleClientId || !googleButtonRef.current) return

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    ) as HTMLScriptElement | null

    const initializeGoogle = () => {
      const googleApi = (window as GoogleApiWindow).google?.accounts?.id
      if (!googleApi || !googleButtonRef.current) return

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

      googleButtonRef.current.innerHTML = ''
      googleApi.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 360,
        text: 'continue_with',
      })
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

  function goToMode(next: Mode) {
    setApiError(null)
    setSignupSuccess(null)
    const search = searchParams.toString()
    navigate(`/auth/${next}${search ? `?${search}` : ''}`)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        aria-label="Close auth modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />

      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-card-bg p-5 sm:p-6 shadow-xl custom-scroll">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 p-1.5 rounded-md text-base-100 hover:text-base-200 hover:bg-sidebar-bg"
          aria-label="Close"
        >
          <IconX size={18} stroke={1.7} />
        </button>

        <h2 className="text-2xl font-bold text-base-200">Welcome to Voxella</h2>
        <p className="mt-1 text-sm text-base-100">
          {reasonMessage ?? 'Join the conversation around product feedback.'}
        </p>

        {apiError && (
          <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleSubmit(onLoginSubmit)} className="mt-5 space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-base-200 mb-1.5">Email</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`input ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-base-200 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`input pr-10 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-base-100 hover:text-base-200"
                >
                  {showPassword ? (
                    <IconEyeOff size={17} stroke={1.5} />
                  ) : (
                    <IconEye size={17} stroke={1.5} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoginBusy}
              className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoginBusy ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs text-base-100 uppercase tracking-wide">or</span>
              <div className="h-px bg-border flex-1" />
            </div>

            {googleClientId ? (
              <div className="flex justify-center">
                <div
                  ref={googleButtonRef}
                  className={`min-h-10 ${isGoogleLoading ? 'opacity-70 pointer-events-none' : ''}`}
                />
              </div>
            ) : (
              <p className="text-xs text-base-100 text-center">Google sign in is not configured.</p>
            )}

            <p className="text-xs text-base-100 text-center">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => goToMode('register')}
                className="text-primary-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          </form>
        )}

        {mode === 'register' && (
          <div className="mt-5">
            <div className="mb-5">
              <label className="block text-xs text-base-100 mb-1.5">Account Type</label>
              <div className="flex gap-1 bg-sidebar-bg border border-border rounded-xl p-1">
                {(['user', 'company'] as RegisterType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setRegisterType(type)
                      setApiError(null)
                      setSignupSuccess(null)
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                  </button>
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

                {googleClientId ? (
                  <div className="flex justify-center mt-3">
                    <div
                      ref={googleButtonRef}
                      className={`min-h-10 ${isGoogleLoading ? 'opacity-70 pointer-events-none' : ''}`}
                    />
                  </div>
                ) : (
                  <p className="text-xs text-base-100 text-center mt-3">
                    Google sign in is not configured.
                  </p>
                )}
              </>
            )}

            {signupSuccess && (
              <button
                type="button"
                onClick={() => goToMode('login')}
                className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-800 transition-colors"
              >
                Continue to sign in ({registerTypeLabel})
              </button>
            )}

            {!signupSuccess && (
              <p className="text-xs text-base-100 text-center mt-3">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => goToMode('login')}
                  className="text-primary-600 hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
