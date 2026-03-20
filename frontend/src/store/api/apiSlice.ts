import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

const configuredApiBase = import.meta.env.VITE_API_BASE?.trim() ?? ''
const normalizedApiBase = configuredApiBase.replace(/\/+$/, '').replace(/\/api$/, '')
const baseUrl = normalizedApiBase ? `${normalizedApiBase}/api` : '/api'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Company', 'AuthUser', 'AuthCompany'],
  endpoints: () => ({}),
})
