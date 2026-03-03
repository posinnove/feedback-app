export function statusPill(status: string) {
  switch (status) {
    case "open":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "reviewed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export function statusDot(status: string) {
  switch (status) {
    case "open":
      return "bg-yellow-500";
    case "reviewed":
      return "bg-blue-500";
    case "resolved":
      return "bg-green-500";
    default:
      return "bg-gray-400";
  }
}

export function statusSelect(status: string) {
  // styles for the dropdown itself
  switch (status) {
    case "open":
      return "border-yellow-200 bg-yellow-50 text-yellow-900 focus:ring-yellow-200";
    case "reviewed":
      return "border-blue-200 bg-blue-50 text-blue-900 focus:ring-blue-200";
    case "resolved":
      return "border-green-200 bg-green-50 text-green-900 focus:ring-green-200";
    default:
      return "border-gray-200 bg-gray-50 text-gray-900 focus:ring-gray-200";
  }
}