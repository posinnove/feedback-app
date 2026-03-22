import { apiSlice } from './apiSlice'
import type { CompanySummary, CompanyData } from '../../types/company'

const companyApi = apiSlice.injectEndpoints({

    endpoints: (builder) => ({
        getCompanies: builder.query<CompanySummary[], void>({
            query: () => '/companies',
            providesTags: [{ type: 'Company', id: 'LIST' }],
        }),
        getCompanyBySlug: builder.query<CompanyData, string>({
            query: (slug) => `/companies/${slug}`,
            providesTags: (_result, _error, slug) => [
                { type: 'Company', id: slug },
            ],
        }),
        getMyFeatures: builder.query<{ features: any[]; totalVoteCount: number }, void>({
            query: () => '/companies/me/features',
            providesTags: ['CompanyFeatures'],
        }),
    }),
})

export const { useGetCompaniesQuery, useGetCompanyBySlugQuery, useGetMyFeaturesQuery } = companyApi
