import { useState } from "react";
import { submitReview } from "../../lib/review.api";

export type ReviewFormProps = {
  rideId: number;
  onSubmitted?: () => void;
};

export default function ReviewForm({ rideId, onSubmitted }: ReviewFormProps) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await submitReview(rideId, stars, comment);
      setSuccess(true);
      if (onSubmitted) onSubmitted();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Er is iets misgegaan.");
      } else {
        setError("Er is iets misgegaan.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-green-700 font-bold">Bedankt voor je review!</div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold mb-1">Beoordeling</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              filled={n <= stars}
              onClick={() => setStars(n)}
              disabled={loading}
            />
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">
          Opmerking (optioneel)
        </label>
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={loading}
        />
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <button
        type="submit"
        className="btn-primary px-4 py-2"
        disabled={loading}
      >
        Review versturen
      </button>
    </form>
  );
}

function Star({
  filled,
  onClick,
  disabled,
}: {
  filled: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={filled ? "text-yellow-400" : "text-gray-300"}
      aria-label={filled ? "Gevulde ster" : "Lege ster"}
      style={{
        fontSize: 28,
        cursor: disabled ? "not-allowed" : "pointer",
        background: "none",
        border: "none",
        padding: 0,
      }}
    >
      ★
    </button>
  );
}
