export interface CompanySummary {
  id: number
  name: string
  slug: string
}

export interface CompanyData {
  id: number
  userId: number
  name: string
  slug: string
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
