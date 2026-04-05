export interface CompanySummary {
  id: number
  name: string
  slug: string
  description?: string | null
  followerCount?: number
  logoUrl?: string | null
  isApproved?: boolean
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
  isApproved?: boolean
}

export interface CompanyFeedback {
  id: number
  title: string
  description: string | null
  visibility?: 'public' | 'anonymous'
  feedbackType?: {
    id: number
    name: string
    slug: string
  } | null
  requester?: {
    id: number
    name: string
  } | null
  status: 'planned' | 'in-progress' | 'completed' | 'under-review' | 'rejected'
  userVote?: 'up' | 'down' | null
  upvotes: number
  downvotes?: number
  viewCount?: number
  replyCount?: number
  createdAt: string
}
