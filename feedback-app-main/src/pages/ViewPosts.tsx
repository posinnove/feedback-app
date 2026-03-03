import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCompanyFeedback, Feedback } from "../api/companyFeedback";
import { statusDot, statusPill } from "../utils/statusStyles";

export default function ViewPosts() {
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
        setError(e.message ?? "Failed to load posts");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Feedback Posts</h1>
          <p className="text-sm text-gray-500">Manage posts, status and replies</p>
        </div>

        <button
          onClick={() => navigate("/posts/create")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          + Create Post
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((f) => (
          <button
            key={f.id}
            onClick={() => navigate(`/posts/${f.id}`)}
            className="text-left group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${statusDot(f.status)}`} />
                  <p className="text-[11px] text-gray-500 truncate">#{f.id}</p>
                </div>

                <h3 className="mt-1 font-semibold text-gray-900 leading-snug line-clamp-2">
                  {f.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{f.description}</p>
              </div>

              <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full border ${statusPill(f.status)}`}>
                {f.status}
              </span>
            </div>

            {/* Footer row */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Category: <span className="text-gray-700">{f.category}</span>
              </span>

              <span className="text-xs font-medium text-indigo-600 group-hover:underline">
                Open →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}