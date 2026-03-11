import { mediaUrl } from "../../utils/mediaUrl";

interface PostMediaPreviewProps {
  imageUrl?: string | null;
  videoUrl?: string | null;
  linkUrl?: string | null;
  compact?: boolean;
}

export default function PostMediaPreview({
  imageUrl,
  videoUrl,
  linkUrl,
  compact = false,
}: PostMediaPreviewProps) {
  const fullImageUrl = mediaUrl(imageUrl);
  const fullVideoUrl = mediaUrl(videoUrl);

  return (
    <div className="space-y-3">
      {fullImageUrl && (
        <img
          src={fullImageUrl}
          alt="Post media"
          className={`w-full rounded-2xl border border-gray-100 object-cover ${
            compact ? "max-h-44" : "max-h-80"
          }`}
        />
      )}

      {!fullImageUrl && fullVideoUrl && (
        <video
          src={fullVideoUrl}
          controls
          className={`w-full rounded-2xl border border-gray-100 bg-black ${
            compact ? "max-h-44" : "max-h-80"
          }`}
        />
      )}

      {linkUrl && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noreferrer"
          className="block rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 transition hover:bg-indigo-100"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
            External Link
          </p>
          <p className="mt-1 truncate text-sm font-medium text-indigo-700">
            {linkUrl}
          </p>
        </a>
      )}
    </div>
  );
}