export type FeedbackStatus =
  | "UNDER_REVIEW"
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED";

export interface Reply {
  id: string;
  message: string;
  author: "COMPANY" | "USER";
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  status: FeedbackStatus;
  votes: number;
  replies: Reply[];
  createdAt: string;
}