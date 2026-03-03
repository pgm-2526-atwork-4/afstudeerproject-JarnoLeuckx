import type { CustomerRide } from "../../lib/customer.api";

type RideStatusFilter =
  | "all"
  | "pending"
  | "assigned"
  | "accepted"
  | "completed"
  | "cancelled";

type Props = {
  rides: CustomerRide[];
  statusFilter: RideStatusFilter;
};

export default function CustomerRideList({ rides, statusFilter }: Props) {
  const filtered =
    statusFilter === "all"
      ? rides
      : rides.filter((r) => r.status === statusFilter);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-extrabold text-slate-900">
        Alle ritten
      </h3>

      {filtered.length === 0 && (
        <p className="text-sm text-slate-500">Geen ritten gevonden.</p>
      )}

      <div className="grid gap-3">
        {filtered.map((r) => (
          <RideCard key={r.id} ride={r} />
        ))}
      </div>
    </div>
  );
}

function RideCard({ ride }: { ride: CustomerRide }) {
  const rideNotes = ride.notes;
  const price =
    ride.total_price !== null && ride.total_price !== undefined
      ? Number(ride.total_price).toFixed(2)
      : null;

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-lg font-black text-slate-900">
            {ride.title ?? "Rit"}
          </div>
          <div className="text-xs text-slate-500">
            Rit ID: R-{String(ride.id).padStart(4, "0")}
          </div>
        </div>
        <StatusPill status={ride.status} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Van
          </div>
          <div className="font-bold text-slate-900">
            {ride.pickup_address ?? ride.pickup_city}
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Datum & Tijd
          </div>
          <div className="font-bold text-slate-900">
            {new Date(ride.pickup_datetime).toLocaleString()}
          </div>
        </div>

        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Naar
          </div>
          <div className="font-bold text-slate-900">
            {ride.dropoff_address ?? ride.dropoff_city}
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Chauffeur
          </div>
          <div className="font-bold text-slate-900">
            {ride.driver_name ?? "-"}
          </div>
        </div>

        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Prijs
          </div>
          <div className="font-bold text-slate-900">€{price ?? "0.00"}</div>
        </div>
      </div>

      {rideNotes && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Opmerkingen
          </div>
          <div className="font-semibold text-slate-800">{rideNotes}</div>
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300"
          onClick={() => alert("Bewerken later")}
        >
          ✏️ Bewerken
        </button>
        <button
          className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
          onClick={() => alert("Annuleren later")}
        >
          🗑️ Annuleren
        </button>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const style = pillStyle(status);
  return (
    <span style={style} className="rounded-full px-2.5 py-1 text-xs font-bold">
      {statusLabel(status)}
    </span>
  );
}

function pillStyle(status: string): React.CSSProperties {
  switch (status) {
    case "accepted":
      return {
        padding: "6px 10px",
        borderRadius: 999,
        background: "#d1fae5",
        color: "#065f46",
        fontWeight: 800,
        fontSize: 13,
      };
    case "pending":
    case "assigned":
      return {
        padding: "6px 10px",
        borderRadius: 999,
        background: "#ffedd5",
        color: "#9a3412",
        fontWeight: 800,
        fontSize: 13,
      };
    case "completed":
      return {
        padding: "6px 10px",
        borderRadius: 999,
        background: "#e0e7ff",
        color: "#3730a3",
        fontWeight: 800,
        fontSize: 13,
      };
    case "cancelled":
      return {
        padding: "6px 10px",
        borderRadius: 999,
        background: "#fee2e2",
        color: "#991b1b",
        fontWeight: 800,
        fontSize: 13,
      };
    default:
      return {
        padding: "6px 10px",
        borderRadius: 999,
        background: "#e5e7eb",
        color: "#111827",
        fontWeight: 800,
        fontSize: 13,
      };
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "accepted":
      return "Bevestigd";
    case "pending":
      return "In behandeling";
    case "assigned":
      return "In behandeling";
    case "completed":
      return "Afgerond";
    case "cancelled":
      return "Geannuleerd";
    default:
      return status;
  }
}
