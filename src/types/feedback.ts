export type FeedbackStatus = 'planned' | 'completed' | 'in-progress' | 'rejected' | 'under-review'

export interface ReachedUser {
  id: string
  name: string
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
  createdAt: string
  author?: string
  upvotes: number
  views: number
  comments: number
  reachedTo: ReachedUser[]
}
