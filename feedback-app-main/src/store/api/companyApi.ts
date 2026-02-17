import { apiSlice } from './apiSlice'
import type { CompanyData } from '../../types/company'

const companyApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCompanyBySlug: builder.query<CompanyData, string>({
            query: (slug) => `/companies/${slug}`,
            providesTags: (_result, _error, slug) => [
                { type: 'Company', id: slug },
            ],
        }),
    }),
})

export const { useGetCompanyBySlugQuery } = companyApi
