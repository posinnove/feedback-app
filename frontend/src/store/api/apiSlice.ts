import { createApi, fetchBaseQuery, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'
import { clearCredentials, setAccessToken } from '../slices/authSlice'

const configuredApiBase = import.meta.env.VITE_API_BASE?.trim() ?? ''
const normalizedApiBase = configuredApiBase.replace(/\/+$/, '').replace(/\/api$/, '')
const baseUrl = normalizedApiBase ? `${normalizedApiBase}/api` : '/api'

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithErrorHandler = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions)

  const status = (result.error as FetchBaseQueryError | undefined)?.status
  const requestUrl = typeof args === 'string' ? args : args?.url
  const isRefreshRequest =
    typeof requestUrl === 'string' && requestUrl.includes('/auth/refresh-token')

  // On unauthorized responses, try refresh token once and retry the original request.
  if (status === 401 && !isRefreshRequest) {
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh-token',
        method: 'POST',
      },
      api,
      extraOptions
    )

    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as { accessToken?: string }).accessToken

      if (newAccessToken) {
        api.dispatch(setAccessToken(newAccessToken))
        result = await baseQuery(args, api, extraOptions)
      } else {
        api.dispatch(clearCredentials())
      }
    } else {
      api.dispatch(clearCredentials())
    }
  } else if (status === 401 && isRefreshRequest) {
    api.dispatch(clearCredentials())
  }

  return result
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandler,
  tagTypes: ['Company', 'AuthUser', 'AuthCompany', 'PublicFeed'],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
})
