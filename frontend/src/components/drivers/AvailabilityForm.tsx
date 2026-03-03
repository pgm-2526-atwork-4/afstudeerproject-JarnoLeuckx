import { useState } from "react";
import { createAvailability } from "../../lib/driver.api";

type Props = {
  onCreated: () => void;
};

export default function AvailabilityForm({ onCreated }: Props) {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("16:00");
  const [status, setStatus] = useState<"available" | "unavailable">("available");

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
    <div
      style={{
        padding: 16,
        borderRadius: 14,
        border: "1px solid #e5e7eb",
        marginBottom: 20,
        background: "white",
      }}
    >
      <h3 style={{ fontWeight: 800, marginBottom: 12 }}>
        Beschikbaarheid toevoegen
      </h3>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Datum
          <input
            type="date"
            value={date}
            required
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <label>
            Starttijd
            <input
              type="time"
              value={start}
              required
              onChange={(e) => setStart(e.target.value)}
            />
          </label>

          <label>
            Eindtijd
            <input
              type="time"
              value={end}
              required
              onChange={(e) => setEnd(e.target.value)}
            />
          </label>
        </div>

        <label>
          Status
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "available" | "unavailable")
            }
          >
            <option value="available">Beschikbaar</option>
            <option value="unavailable">Niet beschikbaar</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "none",
            background: "#111827",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loading ? "Bezig..." : "Toevoegen"}
        </button>
      </form>
    </div>
  );
}