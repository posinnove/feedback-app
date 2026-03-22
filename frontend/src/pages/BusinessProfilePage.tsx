import { useGetMyFeaturesQuery } from '../store/api/companyApi'
import { useAppSelector } from '../store/hooks'
import CompanyInfo from '../components/CompanyInfo'
import FeedbackCard from '../components/FeedbackCard'
import StatsCard from '../components/StatsCard'
import type { CompanyData } from '../types/company'

export default function BusinessProfilePage() {
    const { entity } = useAppSelector((s) => s.auth)
    const { data: stats, isLoading, isError } = useGetMyFeaturesQuery()

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (isError || !stats) {
        return (
            <div className="p-8 text-center text-red-500">
                Failed to load profile data.
            </div>
        )
    }

    const { features } = stats

    const companyData: CompanyData = {
        id: entity?.id || 0,
        name: entity?.name || 'Company',
        slug: entity?.slug || '',
        email: entity?.email || '',
        location: entity?.location || null,
        website: null,
        description: null,
        logoUrl: null,
        createdAt: (entity as any)?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        feedbacks: features || []
    }

    return (
        <div className="flex-1 bg-background h-full">
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Company Info & Feature Requests */}
                <main className="lg:col-span-2">
                    <CompanyInfo company={companyData} />

                    <h2 className="text-lg font-semibold text-base-200 mb-4">Feature Requests</h2>
                    
                    {features.length === 0 ? (
                        <div className="card p-8 text-center text-base-100">
                            No feedback posts yet.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {features.map((f: any) => (
                                <FeedbackCard key={f.id} feedback={f} companySlug={companyData.slug} />
                            ))}
                        </div>
                    )}
                </main>

                {/* Right Column: Stats & Actions */}
                <aside className="space-y-4">
                    <StatsCard company={companyData}>
                        <button className="w-full btn btn-primary py-2.5 mt-2">
                            Update Profile
                        </button>
                    </StatsCard>
                </aside>
            </div>
        </div>
    )
}
