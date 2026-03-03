import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompanyPost } from "../api/companyFeedback";

export default function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }
    try {
      setLoading(true);
      const created = await createCompanyPost({ title, description, category });
      navigate(`/posts/${created.id}`);
    } catch (e: any) {
      setError(e.message ?? "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl space-y-4">
      <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 hover:underline">
        ← Back
      </button>

      <h1 className="text-2xl font-semibold">Create Post</h1>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="e.g. Improve dashboard UI"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="general">general</option>
            <option value="feature">feature</option>
            <option value="bug">bug</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-600">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-2"
            rows={5}
            placeholder="Describe the post..."
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
}