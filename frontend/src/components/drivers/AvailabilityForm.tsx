import { useState } from "react";
import { createAvailability } from "../../lib/driver.api";

type Props = {
  onCreated: () => void;
};

export default function AvailabilityForm({ onCreated }: Props) {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("16:00");
  const [isAvailable, setIsAvailable] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    if (!date) {
      setError("Datum is verplicht.");
      return;
    }

    if (date < todayString) {
      setError("Datum mag niet in het verleden liggen.");
      return;
    }

    if (!start || !end) {
      setError("Starttijd en eindtijd zijn verplicht.");
      return;
    }

    if (end <= start) {
      setError("Eindtijd moet na de starttijd liggen.");
      return;
    }

    setLoading(true);

    try {
      await createAvailability({
        date,
        start_time: start,
        end_time: end,
        status: isAvailable ? "available" : "unavailable",
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
      <p className="mb-4 text-sm text-slate-600">
        Vul je werkuren duidelijk in. Velden met
        <span className="form-required"> *</span> zijn verplicht.
      </p>

      {error && (
        <div role="alert" className="form-alert-error mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-layout">
        <label className="grid gap-1.5">
          <span className="form-label">
            Datum<span className="form-required">*</span>
          </span>
          <input
            type="date"
            value={date}
            required
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
          />
        </label>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="form-label">
              Starttijd<span className="form-required">*</span>
            </span>
            <input
              type="time"
              value={start}
              required
              onChange={(e) => setStart(e.target.value)}
              className="form-input"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="form-label">
              Eindtijd<span className="form-required">*</span>
            </span>
            <input
              type="time"
              value={end}
              required
              onChange={(e) => setEnd(e.target.value)}
              className="form-input"
            />
          </label>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-800 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="form-checkbox"
            />
            Ik ben beschikbaar op dit tijdslot
          </label>
          <p className="form-help mt-2">
            Uitgevinkt betekent: niet beschikbaar.
          </p>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Bezig..." : "Toevoegen"}
        </button>
      </form>
    </div>
  );
}
