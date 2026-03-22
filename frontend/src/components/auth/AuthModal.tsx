import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { IconBuilding, IconUser, IconEye, IconEyeOff } from '@tabler/icons-react'
import { useAppDispatch } from '../../store/hooks'
import { setCredentials } from '../../store/slices/authSlice'
import {
  useLoginMutation,
  useGoogleLoginMutation,
  extractEntityFromUnifiedResponse,
  type UnifiedLoginResponse,
} from '../../store/api/authApi'
import CompanyRegisterForm from './CompanyRegisterForm'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useGsapReveal, useGsapStagger } from '../../utils/gsapMotion'
import { motionProfile } from '../../utils/motionProfile'

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
  const [registerType, setRegisterType] = useState<RegisterType>('company')
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null)
  const [isGoogleApiReady, setIsGoogleApiReady] = useState(false)
  const [waitingForCompanyDetails, setWaitingForCompanyDetails] = useState(false)
  const modeRef = useRef<Mode>(mode)
  const registerTypeRef = useRef<RegisterType>(registerType)
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useGsapReveal(dialogRef, [open, mode], {
    y: motionProfile.auth.reveal.y,
    duration: motionProfile.auth.reveal.duration,
    enabled: open,
  })

  useGsapStagger(dialogRef, '[data-gsap-auth-item]', [open, mode, registerType], {
    y: motionProfile.auth.content.y,
    duration: motionProfile.auth.content.duration,
    stagger: motionProfile.auth.content.stagger,
    delay: motionProfile.auth.content.delay,
    enabled: open,
  })

  const reason = searchParams.get('reason')
  const reasonMessage = reason ? REASON_COPY[reason] : null
  const isCompanyDetailsStep =
    mode === 'register' &&
    (waitingForCompanyDetails || searchParams.get('companyStep') === 'details')

  const [login, { isLoading: isEmailLoading }] = useLoginMutation()
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation()
  const [companyEmail, setCompanyEmail] = useState('')
  const [companyPassword, setCompanyPassword] = useState('')

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    registerTypeRef.current = registerType
  }, [registerType])

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
      onClose()
      navigate('/feed', { replace: true })
    },
    [dispatch, navigate, onClose]
  )

  const handleCompanyDetailsSuccess = useCallback(() => {
    setWaitingForCompanyDetails(false)
    onClose()
    navigate('/feed', { replace: true })
  }, [navigate, onClose])

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

  async function handleCompanyEmailLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setApiError(null)

    if (!companyEmail || !companyPassword) {
      setApiError('Please enter email and password')
      return
    }

    try {
      const response = await login({ email: companyEmail, password: companyPassword }).unwrap()
      const entity = extractEntityFromUnifiedResponse(response)
      dispatch(
        setCredentials({
          entity,
          type: response.type,
          accessToken: response.accessToken,
        })
      )
      onClose()
      navigate('/feed', { replace: true })
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message
      setApiError(msg ?? 'Login failed. Please try again.')
    }
  }

  function handleGoogleButtonClick() {
    const googleApi = (window as GoogleApiWindow).google?.accounts?.id
    if (!googleApi) {
      setApiError('Google sign in is still loading. Please try again.')
      return
    }

    setApiError(null)
    googleApi.prompt()
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
            const currentMode = modeRef.current
            const currentRegisterType = registerTypeRef.current
            const result = await googleLogin({
              idToken: response.credential,
              accountType: currentMode === 'register' ? currentRegisterType : undefined,
            }).unwrap()

            // For company signup via Google, show the company details form
            if (currentMode === 'register' && currentRegisterType === 'company') {
              const entity = extractEntityFromUnifiedResponse(result)
              dispatch(
                setCredentials({
                  entity,
                  type: result.type,
                  accessToken: result.accessToken,
                })
              )
              setWaitingForCompanyDetails(true)
              setSignupSuccess(null)
              const nextParams = new URLSearchParams(searchParams)
              nextParams.set('companyStep', 'details')
              navigate(`/auth/register?${nextParams.toString()}`, { replace: true })
            } else {
              await handleUnifiedSuccess(result)
            }
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
  }, [
    open,
    mode,
    registerType,
    googleClientId,
    googleLogin,
    handleUnifiedSuccess,
    dispatch,
    searchParams,
    navigate,
  ])

  function goToMode(next: Mode) {
    setApiError(null)
    setSignupSuccess(null)
    setWaitingForCompanyDetails(false)
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('companyStep')
    const search = nextParams.toString()
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
      <DialogContent ref={dialogRef} className="max-h-[92vh] overflow-y-auto custom-scroll">
        <DialogHeader data-gsap-auth-item>
          <DialogTitle>Welcome to Voxella</DialogTitle>
          <DialogDescription>
            {reasonMessage ?? 'Join the conversation around product feedback.'}
          </DialogDescription>
        </DialogHeader>

        {apiError && (
          <div
            data-gsap-auth-item
            className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {apiError}
          </div>
        )}

        {mode === 'login' && (
          <div data-gsap-auth-item className="mt-5 space-y-4">
            <form onSubmit={handleCompanyEmailLogin} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-base-200 mb-1.5">Email</label>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="company@example.com"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base-200 mb-1.5">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={companyPassword}
                    onChange={(e) => setCompanyPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 h-auto w-auto px-0 py-0 text-base-100 hover:bg-transparent hover:text-base-200"
                  >
                    {showPassword ? (
                      <IconEyeOff size={17} stroke={1.5} />
                    ) : (
                      <IconEye size={17} stroke={1.5} />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" disabled={isEmailLoading} className="w-full">
                {isEmailLoading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

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
                className="h-auto px-0 py-0 text-primary-400 hover:bg-transparent hover:underline"
              >
                Sign up
              </Button>
            </p>
          </div>
        )}

        {mode === 'register' && (
          <div data-gsap-auth-item className="mt-5">
            {!isCompanyDetailsStep && (
              <div className="mb-5">
                <label className="block text-xs text-base-100 mb-1.5">Account Type</label>
                <div className="flex gap-1 bg-sidebar-bg border border-border rounded-xl p-1">
                  {(['company', 'user'] as RegisterType[]).map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setRegisterType(type)
                        setApiError(null)
                        setSignupSuccess(null)
                        setWaitingForCompanyDetails(false)
                        const nextParams = new URLSearchParams(searchParams)
                        nextParams.delete('companyStep')
                        navigate(
                          `/auth/register${nextParams.toString() ? `?${nextParams.toString()}` : ''}`,
                          {
                            replace: true,
                          }
                        )
                      }}
                      className={`h-auto flex-1 py-2 text-sm font-medium transition-colors ${
                        registerType === type
                          ? 'bg-border text-base-300 shadow-sm'
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
            )}

            {signupSuccess && (
              <div className="mb-5 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                {signupSuccess}
              </div>
            )}

            {!signupSuccess && (registerType === 'company' || isCompanyDetailsStep) && (
              <>
                {isCompanyDetailsStep ? (
                  <CompanyRegisterForm
                    key="company-google-details"
                    onSuccess={handleCompanyDetailsSuccess}
                    onApiError={(message) => setApiError(message || null)}
                    isGoogleAuth={true}
                  />
                ) : (
                  <CompanyRegisterForm
                    key="company-email-register"
                    onSuccess={setSignupSuccess}
                    onApiError={(message) => setApiError(message || null)}
                  />
                )}
              </>
            )}

            {!signupSuccess && (
              <>
                {registerType === 'user' && (
                  <div className="space-y-3">
                    {googleClientId && (
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        onClick={handleGoogleButtonClick}
                        disabled={isGoogleLoading || !isGoogleApiReady}
                      >
                        {isGoogleLoading ? 'Signing up…' : 'Sign up with Google'}
                      </Button>
                    )}
                  </div>
                )}

                {registerType === 'company' && !isCompanyDetailsStep && (
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
                        {isGoogleLoading ? 'Signing up…' : 'Continue with Google'}
                      </Button>
                    )}
                  </>
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
                  className="h-auto px-0 py-0 text-primary-400 hover:bg-transparent hover:underline"
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
