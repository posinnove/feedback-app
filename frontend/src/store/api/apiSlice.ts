import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { RootState } from '../store'
import { clearCredentials } from '../slices/authSlice'

const rawBaseQuery = fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
    },
})

/** Intercepts 401 responses, clears auth state, and redirects to login */
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions,
) => {
    const result = await rawBaseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
        api.dispatch(clearCredentials())
        // Use a hard redirect so the router is not needed in this non-component context
        window.location.replace('/auth/login')
    }

    return result
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Company', 'AuthUser', 'AuthCompany', 'CompanyFeatures'],
    endpoints: () => ({}),
})
