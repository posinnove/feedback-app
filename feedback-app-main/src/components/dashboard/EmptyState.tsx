export default function EmptyState() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-dashed border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        No feedback yet
      </h2>

      <p className="text-gray-500 mb-6">
        Share your feedback board link to start collecting ideas from users.
      </p>

      <button className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2 rounded-lg">
        Copy Feedback Link
      </button>
    </div>
  );
}