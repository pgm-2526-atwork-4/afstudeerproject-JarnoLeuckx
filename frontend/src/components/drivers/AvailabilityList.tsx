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

export default function AvailabilityList({
  availabilities,
  onDeleted,
}: Props) {
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
    (a.date + a.start_time).localeCompare(b.date + b.start_time)
  );

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
        Mijn beschikbaarheden
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

      {sorted.length === 0 && (
        <p style={{ opacity: 0.7 }}>Geen beschikbaarheden toegevoegd.</p>
      )}

      {sorted.map((a) => (
        <div
          key={a.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 12,
            border: "1px solid #eee",
            borderRadius: 12,
            marginBottom: 8,
          }}
        >
          <div>
            <div style={{ fontWeight: 800 }}>
              {a.date} • {a.start_time.slice(0, 5)} -{" "}
              {a.end_time.slice(0, 5)}
            </div>
            <div
              style={{
                fontSize: 13,
                opacity: 0.8,
                color:
                  a.status === "available" ? "green" : "red",
              }}
            >
              {a.status === "available"
                ? "Beschikbaar"
                : "Niet beschikbaar"}
            </div>
          </div>

          <button
            onClick={() => handleDelete(a.id)}
            disabled={loadingId === a.id}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer",
            }}
          >
            {loadingId === a.id ? "..." : "Verwijderen"}
          </button>
        </div>
      ))}
    </div>
  );
}