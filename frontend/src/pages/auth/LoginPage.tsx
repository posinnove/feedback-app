import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconArrowLeft } from '@tabler/icons-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setCredentials } from '../../store/slices/authSlice'
import { useGoogleLoginMutation, extractEntityFromUnifiedResponse } from '../../store/api/authApi'
import AuthImagePanel from '../../components/auth/AuthImagePanel'
import { Button } from '../../components/ui/button'
import signupBg from '../../assets/auth - signup - 1.jpg'

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

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)

  const [apiError, setApiError] = useState<string | null>(null)
  const [isGoogleApiReady, setIsGoogleApiReady] = useState(false)
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation()

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (!googleClientId) return

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
            }).unwrap()
            const entity = extractEntityFromUnifiedResponse(result)
            dispatch(
              setCredentials({
                entity,
                type: result.type,
                accessToken: result.accessToken,
              })
            )
            navigate('/', { replace: true })
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
  }, [googleClientId, googleLogin, dispatch, navigate])

  function handleGoogleButtonClick() {
    const googleApi = (window as GoogleApiWindow).google?.accounts?.id
    if (!googleApi) {
      setApiError('Google sign in is still loading. Please try again.')
      return
    }

    setApiError(null)
    googleApi.prompt()
  }

  const panelContent = (
    <div>
      <blockquote className="text-xl font-light leading-relaxed mb-6 opacity-90">
        "The best feedback is the kind that helps you grow — and Voxella makes sure it reaches the
        right ears."
      </blockquote>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 rounded-full ${i === 0 ? 'w-8 bg-white' : 'w-3 bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-background">
      <AuthImagePanel
        backgroundImage={signupBg}
        overlayClassName="bg-gradient-to-br from-primary-800/80 to-primary-600/60"
      >
        {panelContent}
      </AuthImagePanel>

      {/* Right: Form Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-12 bg-card-bg lg:border-l lg:border-border">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-base-100 hover:text-base-200 mb-8 transition-colors"
        >
          <IconArrowLeft size={16} stroke={1.5} />
          Back to Voxella
        </Link>

        <div className="max-w-md w-full mx-auto">
          <h1 className="text-2xl font-bold text-base-200 mb-1">Welcome back</h1>
          <p className="text-base-100 text-sm mb-8">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-primary-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>

          {/* API Error */}
          {apiError && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          <div className="space-y-4">
            {googleClientId && (
              <Button
                ref={buttonRef}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={handleGoogleButtonClick}
                disabled={isGoogleLoading || !isGoogleApiReady}
              >
                {isGoogleLoading ? 'Signing in…' : 'Continue with Google'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
