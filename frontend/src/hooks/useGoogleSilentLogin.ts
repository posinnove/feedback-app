import { useEffect, useRef, useCallback } from 'react'
import { useAppDispatch } from '../store/hooks'
import { setCredentials } from '../store/slices/authSlice'
import { useGoogleLoginMutation, extractEntityFromUnifiedResponse } from '../store/api/authApi'

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

export function useGoogleSilentLogin() {
  const dispatch = useAppDispatch()
  const [googleLogin] = useGoogleLoginMutation()
  const isInitializedRef = useRef(false)
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    if (!googleClientId || isInitializedRef.current) return

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    ) as HTMLScriptElement | null

    const initializeGoogle = () => {
      const googleApi = (window as GoogleApiWindow).google?.accounts?.id
      if (!googleApi || isInitializedRef.current) return

      googleApi.initialize({
        client_id: googleClientId,
        callback: async (response: { credential?: string }) => {
          if (!response.credential) return

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
          } catch {
            // Silent failure - user can try again
          }
        },
      })
      isInitializedRef.current = true
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
  }, [googleClientId, googleLogin, dispatch])

  const triggerSilentLogin = useCallback(() => {
    const googleApi = (window as GoogleApiWindow).google?.accounts?.id
    if (!googleApi) return
    googleApi.prompt()
  }, [])

  return triggerSilentLogin
}
