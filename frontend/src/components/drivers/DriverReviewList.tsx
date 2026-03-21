import { useEffect, useState } from "react";
import { getDriverReviews, Review } from "../../lib/review.api";

export default function DriverReviewList({ driverId }: { driverId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => setLoading(true));
    getDriverReviews(driverId)
      .then(setReviews)
      .catch((e) => setError(e.message || "Fout bij laden"))
      .finally(() => setLoading(false));
  }, [driverId]);

  if (loading) return <div>Bezig met laden...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (reviews.length === 0) return <div>Geen reviews gevonden.</div>;

  return (
    <div className="mt-4">
      <h4 className="font-bold mb-2">Reviews van klanten</h4>
      <ul className="space-y-3">
        {reviews.map((r) => (
          <li key={r.id} className="rounded border p-3 bg-slate-50">
            <div className="flex items-center gap-2 mb-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={i < r.stars ? "text-yellow-400" : "text-gray-300"}
                  style={{ fontSize: 18 }}
                >
                  ★
                </span>
              ))}
              <span className="ml-2 text-xs text-slate-500">
                {new Date(r.created_at).toLocaleDateString()}
              </span>
            </div>
            {r.comment && <div className="text-slate-800">{r.comment}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
