export type FeedbackStatus =
  | "UNDER_REVIEW"
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED";

export interface FeedbackSummary {
  id: string;
  title: string;
  votes: number;
  status: FeedbackStatus;
  createdAt: string;
}

export interface DashboardOverviewData {
  totalPosts: number;
  totalUpvotes: number;
  totalDownvotes: number;
  activePosts: number;
  recentFeedback: FeedbackSummary[];
}