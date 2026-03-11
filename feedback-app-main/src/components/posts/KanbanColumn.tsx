import { Feedback } from "../../api/companyFeedback";
import { statusPill } from "../../utils/statusStyles";
import PostCard from "./PostCard";

interface KanbanColumnProps {
  title: string;
  posts: Feedback[];
  status: "open" | "reviewed" | "resolved";
}

export default function KanbanColumn({ title, posts, status }: KanbanColumnProps) {
  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-4 min-w-0">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <span className={`text-xs px-2.5 py-1 rounded-full border ${statusPill(status)}`}>
          {posts.length}
        </span>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-4 text-sm text-gray-400">
            No posts here.
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}