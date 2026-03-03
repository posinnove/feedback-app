import { FeedbackSummary } from "../../types/dashboard";

interface Props {
  feedback: FeedbackSummary[];
}

export default function RecentFeedback({ feedback }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">
        Recent Feedback
      </h2>

      <ul className="space-y-3">
        {feedback.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">
                Status: {item.status}
              </p>
            </div>
            <span className="font-semibold">
              {item.votes} votes
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}