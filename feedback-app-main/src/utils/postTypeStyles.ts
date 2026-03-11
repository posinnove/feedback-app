export function postTypeBadge(postType: string) {
  switch (postType) {
    case "company":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "user":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export function postCardAccent(postType: string) {
  switch (postType) {
    case "company":
      return "border-l-4 border-l-indigo-500";
    case "user":
      return "border-l-4 border-l-emerald-500";
    default:
      return "border-l-4 border-l-gray-300";
  }
}

export function postTypeLabel(postType: string) {
  switch (postType) {
    case "company":
      return "Company Post";
    case "user":
      return "User Post";
    default:
      return "Post";
  }
}