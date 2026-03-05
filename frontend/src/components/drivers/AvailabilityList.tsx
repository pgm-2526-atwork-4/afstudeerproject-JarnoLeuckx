import { useState } from "react";
import { deleteAvailability } from "../../lib/driver.api";

type Availability = {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: "available" | "unavailable";
};

type Props = {
  availabilities: Availability[];
  onDeleted: () => void;
};

export default function AvailabilityList({ availabilities, onDeleted }: Props) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: number) {
    setError(null);
    setLoadingId(id);

    try {
      await deleteAvailability(id);
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kon niet verwijderen.");
    } finally {
      setLoadingId(null);
    }
  }

  const sorted = [...availabilities].sort((a, b) =>
    (a.date + a.start_time).localeCompare(b.date + b.start_time),
  );

  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-extrabold text-slate-900">
        Mijn beschikbaarheden
      </h3>

      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {sorted.length === 0 && (
        <p className="text-sm text-slate-500">
          Geen beschikbaarheden toegevoegd.
        </p>
      )}

      {sorted.map((a) => (
        <div
          key={a.id}
          className="mb-2 flex items-center justify-between rounded-xl border border-slate-200 p-3"
        >
          <div>
            <div className="font-extrabold text-slate-900">
              {a.date} • {a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}
            </div>
            <div
              className={`text-sm ${
                a.status === "available" ? "text-emerald-700" : "text-red-700"
              }`}
            >
              {a.status === "available" ? "Beschikbaar" : "Niet beschikbaar"}
            </div>
          </div>

          <button
            onClick={() => handleDelete(a.id)}
            disabled={loadingId === a.id}
            className="btn-outline px-3 py-1.5"
          >
            {loadingId === a.id ? "..." : "Verwijderen"}
          </button>
        </div>
      ))}
    </div>
  );
}
