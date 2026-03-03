type DashboardStats = {
  totalPosts: number;
  totalUpvotes: number;
  totalDownvotes: number;
  activePosts: number;
};

export default function OverviewCards({ data }: { data: DashboardStats }) {
  const cards = [
    {
      label: "Total Posts",
      value: data.totalPosts,
      color: "text-indigo-600",
    },
    {
      label: "Total Upvotes",
      value: data.totalUpvotes,
      color: "text-green-600",
    },
    {
      label: "Total Downvotes",
      value: data.totalDownvotes,
      color: "text-red-500",
    },
    {
      label: "Active Posts",
      value: data.activePosts,
      color: "text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
        >
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className={`text-3xl font-semibold mt-1 ${card.color}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}