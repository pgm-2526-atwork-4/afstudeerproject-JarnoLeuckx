import { useState } from "react";
import { createAvailability } from "../../lib/driver.api";

type Props = {
  onCreated: () => void;
};

export default function AvailabilityForm({ onCreated }: Props) {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("16:00");
  const [status, setStatus] = useState<"available" | "unavailable">(
    "available",
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createAvailability({
        date,
        start_time: start,
        end_time: end,
        status,
      });

      setDate("");
      onCreated(); // refresh parent
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-extrabold text-slate-900">
        Beschikbaarheid toevoegen
      </h3>

      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm font-semibold text-slate-700">Datum</span>
          <input
            type="date"
            value={date}
            required
            onChange={(e) => setDate(e.target.value)}
            className="h-11 rounded-lg border border-slate-300 bg-white px-3 outline-none transition focus:border-slate-400"
          />
        </label>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm font-semibold text-slate-700">
              Starttijd
            </span>
            <input
              type="time"
              value={start}
              required
              onChange={(e) => setStart(e.target.value)}
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 outline-none transition focus:border-slate-400"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-semibold text-slate-700">
              Eindtijd
            </span>
            <input
              type="time"
              value={end}
              required
              onChange={(e) => setEnd(e.target.value)}
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 outline-none transition focus:border-slate-400"
            />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-semibold text-slate-700">Status</span>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "available" | "unavailable")
            }
            className="h-11 rounded-lg border border-slate-300 bg-white px-3 outline-none transition focus:border-slate-400"
          >
            <option value="available">Beschikbaar</option>
            <option value="unavailable">Niet beschikbaar</option>
          </select>
        </label>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Bezig..." : "Toevoegen"}
        </button>
      </form>
    </div>
  );
}
