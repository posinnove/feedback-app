import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type AuthEntityType = 'user' | 'company'

export interface AuthUser {
  id: number
  email: string
  themeMode?: 'system' | 'light' | 'dark'
  avatarUrl?: string | null
  logoUrl?: string | null
  phoneNumber?: string | null
  // User-specific
  firstName?: string
  lastName?: string
  // Company-specific
  name?: string
  slug?: string
  location?: string
  website?: string | null
  description?: string | null
  emailNotifications?: boolean
  weeklyDigest?: boolean
  publicProfile?: boolean
  isAdmin?: boolean
  isApproved?: boolean
}

interface AuthState {
  entity: AuthUser | null
  type: AuthEntityType | null
  accessToken: string | null
  isAuthenticated: boolean
  hasAuthError: boolean
}

// Rehydrate from localStorage on app load
function loadFromStorage(): Partial<AuthState> {
  try {
    const serialized = localStorage.getItem('auth')
    if (!serialized) return {}
    return JSON.parse(serialized) as Partial<AuthState>
  } catch {
    return {}
  }
}

const persisted = loadFromStorage()

const initialState: AuthState = {
  entity: persisted.entity ?? null,
  type: persisted.type ?? null,
  accessToken: persisted.accessToken ?? null,
  isAuthenticated: !!persisted.accessToken,
  hasAuthError: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        entity: AuthUser
        type: AuthEntityType
        accessToken: string
      }>
    ) {
      const { entity, type, accessToken } = action.payload
      state.entity = entity
      state.type = type
      state.accessToken = accessToken
      state.isAuthenticated = true

      localStorage.setItem('auth', JSON.stringify({ entity, type }))
    },

    clearCredentials(state) {
      state.entity = null
      state.type = null
      state.accessToken = null
      state.isAuthenticated = false
      state.hasAuthError = true
      localStorage.removeItem('auth')
    },

    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
      state.isAuthenticated = true

      localStorage.setItem(
        'auth',
        JSON.stringify({
          entity: state.entity,
          type: state.type,
        })
      )
    },

    setAuthError(state, action: PayloadAction<boolean>) {
      state.hasAuthError = action.payload
    },
  },
})

export const { setCredentials, clearCredentials, setAccessToken, setAuthError } = authSlice.actions
export default authSlice.reducer
