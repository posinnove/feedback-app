import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import OverviewCards from "../components/dashboard/OverviewCards";
import EmptyState from "../components/dashboard/EmptyState";
import { fetchCompanyFeedback, Feedback } from "../api/companyFeedback";
import { statusPill } from "../utils/statusStyles";

export default function Dashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchCompanyFeedback();
        setItems(data);
      } catch (e: any) {
        setError(e.message ?? "Failed to load feedback");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const recent = useMemo(() => items.slice(0, 5), [items]);

  const stats = useMemo(() => {
    const totalPosts = items.length;
    const activePosts = items.filter((f) => f.status !== "resolved").length;
    // votes not present yet in your model -> show 0 until added later
    return { totalPosts, totalUpvotes: 0, totalDownvotes: 0, activePosts };
  }, [items]);

  const hasFeedback = items.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of your audience feedback</p>
        </div>

        <button
          onClick={() => navigate("/posts/create")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          + Create Post
        </button>
      </div>

      {/* Overview Cards */}
      <OverviewCards data={stats} />

      {/* Recent feedback */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Feedback</h2>
          <button
            onClick={() => navigate("/posts/view")}
            className="text-sm text-indigo-600 hover:underline"
          >
            View all
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl p-6 border border-gray-100">Loading...</div>
        ) : error ? (
          <div className="bg-white rounded-xl p-6 border border-gray-100 text-red-600">
            {error}
          </div>
        ) : hasFeedback ? (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {recent.map((f) => (
              <button
                key={f.id}
                onClick={() => navigate(`/posts/${f.id}`)}
                className="w-full text-left px-5 py-4 hover:bg-gray-50 border-b last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{f.title}</p>
                  <span className={`text-xs px-2 py-1 rounded ${statusPill(f.status)}`}>
                    {f.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{f.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}