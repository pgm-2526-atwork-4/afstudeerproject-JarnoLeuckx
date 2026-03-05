import { useState } from "react";
import { createAvailability } from "../../lib/driver.api";
import CalendarDateField from "../forms/CalendarDateField";

type Props = {
  onCreated: () => void;
};

export default function AvailabilityForm({ onCreated }: Props) {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("16:00");
  const [availabilityType, setAvailabilityType] = useState<
    "available" | "sick" | "leave"
  >("available");
  const [periodMonths, setPeriodMonths] = useState<1 | 6>(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

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
        availability_type: availabilityType,
        period_months: periodMonths,
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
        <CalendarDateField
          id="driver-availability-date"
          label="Datum"
          value={date}
          onChange={setDate}
          required
          minDate={todayString}
        />

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

        <label className="grid gap-1.5">
          <span className="form-label">Type</span>
          <select
            value={availabilityType}
            onChange={(e) =>
              setAvailabilityType(
                e.target.value as "available" | "sick" | "leave",
              )
            }
            className="form-select"
          >
            <option value="available">Beschikbaar</option>
            <option value="sick">Ziekte</option>
            <option value="leave">Verlof</option>
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="form-label">Periode</span>
          <select
            value={periodMonths}
            onChange={(e) => setPeriodMonths(Number(e.target.value) as 1 | 6)}
            className="form-select"
          >
            <option value={1}>1 maand</option>
            <option value={6}>6 maanden</option>
          </select>
        </label>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          {availabilityType === "leave" ? (
            <p className="text-sm text-amber-800">
              Verlofaanvragen worden eerst ter goedkeuring naar een admin
              gestuurd.
            </p>
          ) : availabilityType === "sick" ? (
            <p className="text-sm text-red-700">
              Ziekte wordt meteen als niet beschikbaar verwerkt voor de gekozen
              periode.
            </p>
          ) : (
            <p className="text-sm text-emerald-700">
              Beschikbaarheid wordt meteen toegepast voor de gekozen periode.
            </p>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Bezig..." : "Toevoegen"}
        </button>
      </form>
    </div>
  );
}
