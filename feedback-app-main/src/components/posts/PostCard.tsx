import { useNavigate } from "react-router-dom";
import { Feedback } from "../../api/companyFeedback";
import { formatDateTime } from "../../utils/formatDateTime";
import {
  postCardAccent,
  postTypeBadge,
  postTypeLabel,
} from "../../utils/postTypeStyles";
import { statusDot, statusPill } from "../../utils/statusStyles";
import PostMediaPreview from "./PostMediaPreview";

interface Props {
  post: Feedback;
}

export default function PostCard({ post }: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/posts/${post.id}`)}
      className={`w-full text-left group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition ${postCardAccent(
        post.postType
      )}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`h-2.5 w-2.5 rounded-full ${statusDot(post.status)}`} />
            <p className="text-[11px] text-gray-500 truncate">#{post.id}</p>

            <span
              className={`text-[11px] px-2 py-0.5 rounded-full border ${postTypeBadge(
                post.postType
              )}`}
            >
              {postTypeLabel(post.postType)}
            </span>
          </div>

          <h3 className="mt-1 font-semibold text-gray-900 leading-snug line-clamp-2">
            {post.title}
          </h3>

          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {post.description}
          </p>
        </div>

        <span
          className={`shrink-0 text-xs px-2.5 py-1 rounded-full border ${statusPill(
            post.status
          )}`}
        >
          {post.status}
        </span>
      </div>

      {(post.imageUrl || post.videoUrl || post.linkUrl) && (
        <div className="mt-3">
          <PostMediaPreview
            imageUrl={post.imageUrl}
            videoUrl={post.videoUrl}
            linkUrl={post.linkUrl}
            compact
          />
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="space-y-1">
          <span className="block text-xs text-gray-500">
            Category: <span className="text-gray-700">{post.category}</span>
          </span>
          <span className="block text-xs text-gray-400">
            Created: {formatDateTime(post.createdAt)}
          </span>
        </div>

        <span className="text-xs font-medium text-indigo-600 group-hover:underline">
          Open →
        </span>
      </div>
    </button>
  );
}