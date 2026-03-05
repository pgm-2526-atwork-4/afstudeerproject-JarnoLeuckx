import { useState } from "react";
import { deleteAvailability, type Availability } from "../../lib/driver.api";

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
            <div className="font-extrabold text-slate-900">{a.date}</div>
            <div
              className={`text-sm ${
                a.status === "available" ? "text-emerald-700" : "text-red-700"
              }`}
            >
              {a.status_label ??
                (a.status === "available" ? "Beschikbaar" : "Niet beschikbaar")}
            </div>

            {a.availability_type && (
              <div className="mt-1 text-xs text-slate-600">
                Type: {a.availability_type_label ?? a.availability_type}
                {a.availability_type === "leave" && (
                  <span>
                    {" "}
                    · Goedkeuring:{" "}
                    {a.approval_status_label ??
                      a.approval_status ??
                      "Niet nodig"}
                  </span>
                )}
              </div>
            )}
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
