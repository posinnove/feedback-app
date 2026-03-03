import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchFeedbackById,
  Feedback,
  fetchReplies,
  FeedbackReply,
  addReply,
  updateFeedbackStatusApi,
  FeedbackStatus,
} from "../api/companyFeedback";
import { statusDot,statusPill ,statusSelect } from "../utils/statusStyles";


export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const feedbackId = Number(id);

  const [item, setItem] = useState<Feedback | null>(null);
  const [replies, setReplies] = useState<FeedbackReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    if (!id || Number.isNaN(feedbackId)) {
      setLoading(false);
      setError("Invalid post id in URL.");
      return;
    }

    try {
      const [f, r] = await Promise.all([
        fetchFeedbackById(feedbackId),
        fetchReplies(feedbackId),
      ]);
      setItem(f);
      setReplies(r);
    } catch (e: any) {
      setItem(null);
      setReplies([]);
      setError(e?.message ?? "Failed to load post details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const changeStatus = async (status: FeedbackStatus) => {
    if (!item) return;
    setError(null);
    try {
      const updated = await updateFeedbackStatusApi(item.id, status);
      setItem(updated);
    } catch (e: any) {
      setError(e?.message ?? "Failed to update status");
    }
  };

  const submitReply = async () => {
    if (!item) return;
    if (!replyText.trim()) return;

    setError(null);
    try {
      const newReply = await addReply(item.id, replyText.trim());
      setReplies((prev) => [...prev, newReply]);
      setReplyText("");
    } catch (e: any) {
      setError(e?.message ?? "Failed to reply");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  // IMPORTANT: show error instead of silent "Not found"
  if (error) {
    return (
      <div className="p-6 space-y-3">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back
        </button>
        <div className="text-red-600 text-sm">{error}</div>
        <div className="text-sm text-gray-500">
          Tip: test in browser:
          <div className="font-mono text-xs mt-1">
            http://localhost:8080/api/company/feedback/{id}
          </div>
        </div>
      </div>
    );
  }

  if (!item) return <div className="p-6">Not found</div>;

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-indigo-600 hover:underline"
      >
        ← Back
      </button>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
  {/* Header row */}
  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${statusDot(item.status)}`} />
        <span className="text-xs text-gray-500">Post #{item.id}</span>
        <span className={`text-xs px-2.5 py-1 rounded-full border ${statusPill(item.status)}`}>
          {item.status}
        </span>
      </div>

      <h1 className="mt-2 text-2xl font-semibold text-gray-900 leading-snug">
        {item.title}
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        Category: <span className="text-gray-800 font-medium">{item.category}</span>
      </p>
    </div>

    {/* Status dropdown (no "Status" label) */}
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Change:</span>
      <select
        value={item.status}
        onChange={(e) => changeStatus(e.target.value as FeedbackStatus)}
        className={`rounded-xl px-3 py-2 text-sm border outline-none focus:ring-2 transition ${statusSelect(
          item.status
        )}`}
      >
        <option value="open">Open</option>
        <option value="reviewed">Reviewed</option>
        <option value="resolved">Resolved</option>
      </select>
    </div>
  </div>

  {/* Description */}
  <div className="mt-5 border-t pt-5">
    <h2 className="text-sm font-semibold text-gray-900">Details</h2>
    <p className="mt-2 text-gray-700 leading-relaxed">{item.description}</p>
  </div>
</div>
      <div className="bg-white border rounded-xl p-6 space-y-3">
        <h2 className="font-semibold">Replies</h2>

        {replies.length === 0 ? (
          <p className="text-sm text-gray-500">No replies yet.</p>
        ) : (
          <div className="space-y-2">
            {replies.map((r) => (
              <div key={r.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="text-xs text-gray-500 mb-1">{r.author}</div>
                <div className="text-gray-800">{r.message}</div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 space-y-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a company reply..."
            className="w-full border rounded-lg p-2 text-sm"
          />
          <button
            onClick={submitReply}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}