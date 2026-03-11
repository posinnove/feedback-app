import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompanyPost } from "../api/companyFeedback";

const categoryOptions = [
  { value: "general", label: "General" },
  { value: "feature", label: "Feature" },
  { value: "bug", label: "Bug" },
];

export default function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [linkUrl, setLinkUrl] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCategoryLabel = useMemo(() => {
    return categoryOptions.find((item) => item.value === category)?.label ?? "General";
  }, [category]);

  const handleImageChange = (file?: File) => {
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (file?: File) => {
    if (!file) return;
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
  };

  const submit = async () => {
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("linkUrl", linkUrl.trim());

    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    try {
      setLoading(true);
      const created = await createCompanyPost(formData);
      navigate(`/posts/${created.id}`);
    } catch (e: any) {
      setError(e?.message ?? "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              ← Back
            </button>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Create Post
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Publish an announcement, update, or feedback topic with rich media.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          {/* Editor */}
          <div className="space-y-6">
            {/* Main content */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Content</h2>
                  <p className="text-sm text-gray-500">
                    Write the main message for your audience.
                  </p>
                </div>

                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                  Company Post
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Example: We’ve launched a new reporting dashboard"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-[1fr_220px]">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      rows={8}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Explain the update clearly. Mention what changed, why it matters, and what users should expect."
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    />
                    <div className="mt-2 text-right text-xs text-gray-400">
                      {description.length} characters
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    >
                      {categoryOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>

                    <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Publishing Tips
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-gray-600">
                        <li>Use a clear, outcome-focused title.</li>
                        <li>Keep the first lines informative.</li>
                        <li>Add media only when it improves clarity.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    External Link
                  </label>
                  <input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </div>

            {/* Media section */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Media</h2>
                <p className="text-sm text-gray-500">
                  Upload image or video to make the post more engaging.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {/* Image uploader */}
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Image</p>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
                    </div>

                    {image && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-6 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40">
                    <span className="text-sm font-medium text-gray-700">
                      Click to upload image
                    </span>
                    <span className="mt-1 text-xs text-gray-500">
                      or replace current preview
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(e.target.files?.[0])}
                    />
                  </label>

                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-4 h-52 w-full rounded-2xl object-cover"
                    />
                  )}
                </div>

                {/* Video uploader */}
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Video</p>
                      <p className="text-xs text-gray-500">MP4, WEBM, MOV</p>
                    </div>

                    {video && (
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-6 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40">
                    <span className="text-sm font-medium text-gray-700">
                      Click to upload video
                    </span>
                    <span className="mt-1 text-xs text-gray-500">
                      add a short visual update
                    </span>

                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleVideoChange(e.target.files?.[0])}
                    />
                  </label>

                  {videoPreview && (
                    <video
                      src={videoPreview}
                      controls
                      className="mt-4 h-52 w-full rounded-2xl bg-black object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preview panel */}
          <div className="space-y-6">
            <div className="sticky top-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
                  <p className="text-sm text-gray-500">How your post may appear.</p>
                </div>

                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                  {selectedCategoryLabel}
                </span>
              </div>

              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-gray-50">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Post preview"
                    className="h-52 w-full object-cover"
                  />
                ) : videoPreview ? (
                  <video
                    src={videoPreview}
                    controls
                    className="h-52 w-full bg-black object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-gradient-to-br from-indigo-50 to-emerald-50 text-sm text-gray-400">
                    Media preview will appear here
                  </div>
                )}

                <div className="space-y-4 p-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
                      Company Post
                    </span>
                    <span className="rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-1 text-[11px] font-medium text-yellow-700">
                      open
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold leading-snug text-gray-900">
                      {title.trim() || "Your post title will appear here"}
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                      {description.trim() ||
                        "Your post description preview will appear here as you type."}
                    </p>
                  </div>

                  {linkUrl.trim() && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Link
                      </p>
                      <p className="mt-1 truncate text-sm text-indigo-600">{linkUrl}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-xs text-gray-400">
                    <span>Just now</span>
                    <span>Preview mode</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">Title</p>
                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {title.trim() ? "Ready" : "Missing"}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">Media</p>
                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {image || video ? "Added" : "Optional"}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">Link</p>
                  <p className="mt-1 text-sm font-semibold text-gray-800">
                    {linkUrl.trim() ? "Included" : "Optional"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="flex flex-col gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-500">
            Review the preview, then publish when ready.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Publishing..." : "Publish Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}