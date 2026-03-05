import { useState } from "react";
import { createAvailability } from "../../lib/driver.api";
import CalendarDateField from "../forms/CalendarDateField";

type Props = {
  onCreated: () => void;
};

type PeriodPreset = "one_day" | "one_month" | "six_months" | "custom";

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function calculateEndDate(startDate: string, preset: PeriodPreset) {
  if (!startDate) {
    return "";
  }

  if (preset === "one_day") {
    return startDate;
  }

  if (preset === "custom") {
    return startDate;
  }

  const [year, month, day] = startDate.split("-").map(Number);
  const start = new Date(year, month - 1, day);

  if (preset === "one_month") {
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setDate(end.getDate() - 1);
    return formatDate(end);
  }

  const end = new Date(start);
  end.setMonth(end.getMonth() + 6);
  end.setDate(end.getDate() - 1);
  return formatDate(end);
}

export default function AvailabilityForm({ onCreated }: Props) {
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>("one_day");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("16:00");
  const [availabilityType, setAvailabilityType] = useState<
    "available" | "sick" | "leave"
  >("available");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const previewEndDate =
    periodPreset === "custom" ? endDate : calculateEndDate(date, periodPreset);
  const highlightVariant =
    availabilityType === "available"
      ? "available"
      : availabilityType === "sick"
        ? "sick"
        : "leave_pending";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!date) {
      setError("Startdatum is verplicht.");
      return;
    }

    if (date < todayString) {
      setError("Startdatum mag niet in het verleden liggen.");
      return;
    }

    const finalEndDate =
      periodPreset === "custom"
        ? endDate
        : calculateEndDate(date, periodPreset);

    if (!finalEndDate) {
      setError("Einddatum is verplicht.");
      return;
    }

    if (finalEndDate < date) {
      setError("Einddatum moet op of na de startdatum liggen.");
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
        end_date: finalEndDate,
        start_time: start,
        end_time: end,
        availability_type: availabilityType,
      });

      setDate("");
      setEndDate("");
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
          <span className="form-label">Periode</span>
          <select
            value={periodPreset}
            onChange={(e) => {
              const preset = e.target.value as PeriodPreset;
              setPeriodPreset(preset);

              if (!date) {
                setEndDate("");
                return;
              }

              if (preset === "custom") {
                setEndDate((current) =>
                  current && current >= date ? current : date,
                );
                return;
              }

              setEndDate(calculateEndDate(date, preset));
            }}
            className="form-select"
          >
            <option value="one_day">1 dag</option>
            <option value="one_month">1 maand</option>
            <option value="six_months">6 maanden</option>
            <option value="custom">Aangepaste periode</option>
          </select>
        </label>

        {periodPreset === "custom" ? (
          <CalendarDateField
            id="driver-availability-period"
            label="Periode"
            value={date}
            onChange={setDate}
            rangeStart={date}
            rangeEnd={endDate}
            onRangeChange={(startDate, finishDate) => {
              setDate(startDate);
              setEndDate(finishDate);
            }}
            highlightVariant={highlightVariant}
            required
            minDate={todayString}
          />
        ) : (
          <CalendarDateField
            id="driver-availability-start"
            label="Startdatum"
            value={date}
            onChange={(startDate) => {
              setDate(startDate);
              setEndDate(calculateEndDate(startDate, periodPreset));
            }}
            highlightStart={date}
            highlightEnd={previewEndDate}
            highlightVariant={highlightVariant}
            required
            minDate={todayString}
          />
        )}

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Legenda
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-800">
              Beschikbaar
            </span>
            <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 font-medium text-orange-800">
              Verlof toegekend
            </span>
            <span className="rounded-full border border-gray-300 bg-gray-100 px-2.5 py-1 font-medium text-gray-700">
              Verlof in afwachting
            </span>
            <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 font-medium text-red-800">
              Ziekte / afwezig
            </span>
          </div>
        </div>

        {date && endDate && periodPreset !== "custom" && (
          <p className="text-xs text-slate-600">
            Periode: van {date} t.e.m. {endDate}
          </p>
        )}

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
