import { useMemo, useState } from "react";
import { acceptRide, rejectRide } from "../../lib/driver.api";

type Ride = {
  id: number;
  pickup_datetime: string;
  pickup_city: string;
  dropoff_city: string;
  status: string;
};

type Props = {
  rides: Ride[];
  statusFilter: "all" | "assigned" | "accepted" | "completed";
  onAccepted: () => void;
};

export default function RideList({ rides, statusFilter, onAccepted }: Props) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept(id: number) {
    setError(null);
    setLoadingId(id);

    try {
      await acceptRide(id);
      onAccepted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kon rit niet bevestigen.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleReject(id: number) {
    setError(null);
    setLoadingId(id);

    try {
      await rejectRide(id);
      onAccepted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kon rit niet weigeren.");
    } finally {
      setLoadingId(null);
    }
  }

  const sorted = useMemo(() => {
    const filtered =
      statusFilter === "all"
        ? rides
        : rides.filter((ride) => ride.status === statusFilter);

    return [...filtered].sort(
      (a, b) =>
        new Date(a.pickup_datetime).getTime() -
        new Date(b.pickup_datetime).getTime(),
    );
  }, [rides, statusFilter]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-extrabold text-slate-900">
        Toegewezen ritten
      </h3>

      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {sorted.length === 0 && (
        <p className="text-sm text-slate-500">Geen ritten gevonden.</p>
      )}

      {sorted.map((ride) => (
        <div
          key={ride.id}
          className="mb-3 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
        >
          <div>
            <div className="text-base font-black text-slate-900">
              R-{String(ride.id).padStart(3, "0")}
            </div>

            <div className="mt-1 text-sm text-slate-700">
              {ride.pickup_city} → {ride.dropoff_city}
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {new Date(ride.pickup_datetime).toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {ride.status === "assigned" && (
              <>
                <button
                  onClick={() => handleAccept(ride.id)}
                  disabled={loadingId === ride.id}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingId === ride.id ? "..." : "Bevestigen"}
                </button>

                <button
                  onClick={() => handleReject(ride.id)}
                  disabled={loadingId === ride.id}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingId === ride.id ? "..." : "Weigeren"}
                </button>
              </>
            )}

            <StatusBadge status={ride.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = getStatusColor(status);

  return (
    <span style={color} className="rounded-full px-2.5 py-1 text-xs font-bold">
      {statusLabel(status)}
    </span>
  );
}

function getStatusColor(status: string): React.CSSProperties {
  switch (status) {
    case "assigned":
    case "pending":
      return { background: "#fef3c7", color: "#92400e" };
    case "accepted":
      return { background: "#d1fae5", color: "#065f46" };
    case "completed":
      return { background: "#e0e7ff", color: "#3730a3" };
    case "cancelled":
      return { background: "#fee2e2", color: "#991b1b" };
    default:
      return { background: "#e5e7eb", color: "#111827" };
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "assigned":
      return "Toegewezen";
    case "pending":
      return "In afwachting";
    case "accepted":
      return "Geaccepteerd";
    case "completed":
      return "Afgerond";
    case "cancelled":
      return "Geannuleerd";
    default:
      return status;
  }
}
