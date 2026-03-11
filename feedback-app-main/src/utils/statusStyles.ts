export function statusPill(status: string) {
  switch (status) {
    case "open":
      return "bg-blue-100 text-blue-700 border-blue-200";

    case "reviewed":
      return "bg-amber-100 text-amber-700 border-amber-200";

    case "resolved":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";

    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

export function statusDot(status: string) {
  switch (status) {
    case "open":
      return "bg-blue-500";

    case "reviewed":
      return "bg-amber-500";

    case "resolved":
      return "bg-emerald-500";

    default:
      return "bg-gray-400";
  }
}