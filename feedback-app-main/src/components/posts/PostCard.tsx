import { Post } from "../../types/post";
import StatusSelector from "./StatusSelector";
import ReplyBox from "./ReplyBox";

interface Props {
  post: Post;
  onStatusChange: (id: string, status: Post["status"]) => void;
  onReply: (id: string, message: string) => void;
}

export default function PostCard({ post, onStatusChange, onReply }: Props) {
  return (
    <div className="bg-white border rounded-xl p-5 space-y-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">{post.title}</h3>
        <StatusSelector
          value={post.status}
          onChange={(status) => onStatusChange(post.id, status)}
        />
      </div>

      <p className="text-sm text-gray-600">{post.description}</p>

      <div className="text-sm text-gray-500">
        Votes: {post.votes}
      </div>

      <div className="space-y-2">
        {post.replies.map((reply) => (
          <div key={reply.id} className="text-sm bg-gray-50 p-2 rounded">
            <strong>{reply.author}:</strong> {reply.message}
          </div>
        ))}
      </div>

      <ReplyBox onSubmit={(msg) => onReply(post.id, msg)} />
    </div>
  );
}