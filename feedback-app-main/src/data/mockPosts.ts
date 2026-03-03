import { Post } from "../types/post";

export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Add dark mode",
    description: "Please add dark mode for better night usability.",
    status: "UNDER_REVIEW",
    votes: 23,
    replies: [
      {
        id: "r1",
        message: "Thanks for the suggestion! We're reviewing this.",
        author: "COMPANY",
        createdAt: "2026-01-15",
      },
    ],
    createdAt: "2026-01-14",
  },
];