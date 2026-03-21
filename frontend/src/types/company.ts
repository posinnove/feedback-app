export interface CompanySummary {
  id: number
  name: string
  slug: string
  description?: string | null
  followerCount?: number
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
  followerCount?: number
  feedbacks: CompanyFeedback[]
}

export interface CompanyFeedback {
  id: number
  title: string
  description: string | null
  feedbackType?: {
    id: number
    name: string
    slug: string
  } | null
  status: 'planned' | 'in-progress' | 'completed' | 'under-review' | 'rejected'
  userVote?: 'up' | 'down' | null
  upvotes: number
  downvotes?: number
  createdAt: string
}
