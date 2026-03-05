export interface CompanySummary {
    id: number
    name: string
    slug: string
}

export interface CompanyData {
    id: number
    name: string
    slug: string
    email: string
    location: string | null
    website: string | null
    description: string | null
    logoUrl: string | null
    createdAt: string
    updatedAt: string
    feedbacks: CompanyFeedback[]
}

export interface CompanyFeedback {
    id: number
    title: string
    description: string | null
    status: 'planned' | 'in-progress' | 'completed' | 'under-review' | 'rejected'
    upvotes: number
    createdAt: string
}
