const BASE_URL = "http://localhost:8080";

export function mediaUrl(path?: string | null) {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${BASE_URL}${path}`;
}