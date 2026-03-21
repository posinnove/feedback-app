export type FeedbackStatus = 'planned' | 'completed' | 'in-progress' | 'rejected' | 'under-review'

export interface ReachedUser {
  id: string
  name: string
  slug?: string
  avatar?: string
}

export interface Feedback {
  id: string
  postId: string
  title: string
  description?: string
  image?: string
  status?: FeedbackStatus
  category?: string
  visibility?: 'public' | 'anonymous'
  createdAt: string
  author?: string
  userVote?: 'up' | 'down' | null
  upvotes: number
  downvotes?: number
  views: number
  comments: number
  reachedTo: ReachedUser[]
}
