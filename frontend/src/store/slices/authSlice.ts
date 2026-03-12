import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type AuthEntityType = 'user' | 'company'

export interface AuthUser {
    id: number
    email: string
    // User-specific
    username?: string
    firstName?: string
    lastName?: string
    // Company-specific
    name?: string
    slug?: string
    location?: string
}

interface AuthState {
    entity: AuthUser | null
    type: AuthEntityType | null
    accessToken: string | null
    isAuthenticated: boolean
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
            }>,
        ) {
            const { entity, type, accessToken } = action.payload
            state.entity = entity
            state.type = type
            state.accessToken = accessToken
            state.isAuthenticated = true

            localStorage.setItem(
                'auth',
                JSON.stringify({ entity, type, accessToken }),
            )
        },

        clearCredentials(state) {
            state.entity = null
            state.type = null
            state.accessToken = null
            state.isAuthenticated = false
            localStorage.removeItem('auth')
        },
    },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
