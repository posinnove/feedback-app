import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'
import type { CompanyData } from '../types/company'

export const companyKeys = {
    all: ['companies'] as const,
    bySlug: (slug: string) => [...companyKeys.all, slug] as const,
}

const fetchCompanyBySlug = async (slug: string): Promise<CompanyData> => {
    const { data } = await api.get<CompanyData>(`/companies/${slug}`)
    return data
}

export const useCompany = (slug: string | undefined) =>
    useQuery({
        queryKey: companyKeys.bySlug(slug!),
        queryFn: () => fetchCompanyBySlug(slug!),
        enabled: !!slug,
    })
