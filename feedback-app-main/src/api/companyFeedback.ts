export type FeedbackStatus = 'open' | 'reviewed' | 'resolved'

export interface Feedback {
  id: number
  title: string
  description: string
  category: string
  status: FeedbackStatus
  companyId: number
  postType: 'company' | 'user'
  linkUrl?: string | null
  imageUrl?: string | null
  videoUrl?: string | null
  createdAt: string
  updatedAt: string
}

const BASE_URL = 'http://localhost:8080'

export async function fetchCompanyFeedback(): Promise<Feedback[]> {
  const res = await fetch(`${BASE_URL}/api/company/feedback`)
  if (!res.ok) throw new Error(`Failed to fetch feedback (${res.status})`)
  return res.json()
}

export async function fetchFeedbackById(id: number): Promise<Feedback> {
  const res = await fetch(`${BASE_URL}/api/company/feedback/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch feedback (${res.status})`)
  return res.json()
}

export async function createCompanyPost(formData: FormData): Promise<Feedback> {
  const res = await fetch(`${BASE_URL}/api/company/feedback`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(`Failed to create post (${res.status})`);

  return res.json();
}
export async function updateFeedbackStatusApi(
  id: number,
  status: FeedbackStatus
): Promise<Feedback> {
  const res = await fetch(`${BASE_URL}/api/company/feedback/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error(`Failed to update status (${res.status})`)
  return res.json()
}

export interface FeedbackReply {
  id: number
  feedbackId: number
  author: 'COMPANY' | 'USER'
  message: string
  createdAt: string
  updatedAt: string
}

export async function fetchReplies(id: number): Promise<FeedbackReply[]> {
  const res = await fetch(`${BASE_URL}/api/company/feedback/${id}/replies`)
  if (!res.ok) throw new Error(`Failed to fetch replies (${res.status})`)
  return res.json()
}

export async function addReply(id: number, message: string): Promise<FeedbackReply> {
  const res = await fetch(`${BASE_URL}/api/company/feedback/${id}/replies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  if (!res.ok) throw new Error(`Failed to add reply (${res.status})`)
  return res.json()
}
