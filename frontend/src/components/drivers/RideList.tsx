import {
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  MapPinned,
  Phone,
  Route,
  UserRound,
  Wrench,
  Waves,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  acceptRide,
  completeRide,
  rejectRide,
  type Ride,
} from "../../lib/driver.api";

type Props = {
  rides: Ride[];
  statusFilter: "all" | "assigned" | "accepted" | "completed";
  onAccepted: () => void;
};

export default function RideList({ rides, statusFilter, onAccepted }: Props) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openRideId, setOpenRideId] = useState<number | null>(null);

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

  async function handleComplete(id: number) {
    setError(null);
    setLoadingId(id);

    try {
      await completeRide(id);
      onAccepted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kon rit niet afronden.");
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
        <div
          className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {sorted.length === 0 && (
        <p className="text-sm text-slate-500">Geen ritten gevonden.</p>
      )}

      {sorted.map((ride) => (
        <div
          key={ride.id}
          className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <button
            type="button"
            onClick={() =>
              setOpenRideId((current) => (current === ride.id ? null : ride.id))
            }
            aria-expanded={openRideId === ride.id}
            aria-controls={`ride-details-${ride.id}`}
            aria-label={`Toon details van rit R-${String(ride.id).padStart(3, "0")}`}
            className="flex w-full flex-col gap-4 p-4 text-left transition hover:bg-[#F8FBFF] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
          >
            <div>
              <div className="text-base font-black text-slate-900">
                R-{String(ride.id).padStart(3, "0")}
              </div>

              <div className="mt-1 text-sm font-semibold text-slate-700">
                {ride.pickup_city} → {ride.dropoff_city}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {new Date(ride.pickup_datetime).toLocaleString()}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <StatusBadge status={ride.status} />

              <span className="inline-flex items-center gap-2 rounded-full border border-[#D6E6FF] bg-[#EAF3FF] px-3 py-1 text-xs font-bold text-[#0043A8]">
                Details
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className={`transition-transform ${openRideId === ride.id ? "rotate-180" : "rotate-0"}`}
                />
              </span>
            </div>
          </button>

          {openRideId === ride.id && (
            <div
              id={`ride-details-${ride.id}`}
              className="border-t border-slate-200 bg-[#F8FBFF] p-4"
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <InlineBadge
                  label={serviceTypeLabel(ride.service_type)}
                  tone="blue"
                />
                <InlineBadge label={statusLabel(ride.status)} tone="slate" />
                <InlineBadge
                  label={formatRideWindow(
                    ride.pickup_datetime,
                    ride.return_datetime,
                  )}
                  tone="amber"
                />
              </div>

              <div className="mb-4 rounded-2xl border border-[#D6E6FF] bg-white p-4 shadow-sm">
                <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Route size={16} />
                  Route-overzicht
                </div>

                <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                  <RouteStop
                    title="Ophaalpunt"
                    primary={ride.pickup_city}
                    secondary={
                      ride.pickup_address ?? formatAddress(ride, "pickup")
                    }
                    accent="blue"
                  />

                  <div className="hidden lg:flex items-center justify-center text-slate-300">
                    <div className="h-px w-12 bg-[#B8D3FF]" />
                    <MapPinned size={18} className="mx-3 text-[#0043A8]" />
                    <div className="h-px w-12 bg-[#B8D3FF]" />
                  </div>

                  <RouteStop
                    title="Bestemming"
                    primary={ride.dropoff_city}
                    secondary={
                      ride.dropoff_address ?? formatAddress(ride, "dropoff")
                    }
                    accent="emerald"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <DetailCard
                  icon={<CalendarClock size={16} />}
                  label="Tijdstip"
                  value={formatRideWindow(
                    ride.pickup_datetime,
                    ride.return_datetime,
                  )}
                />
                <DetailCard
                  icon={<MapPinned size={16} />}
                  label="Ophaaladres"
                  value={ride.pickup_address ?? formatAddress(ride, "pickup")}
                />
                <DetailCard
                  icon={<MapPinned size={16} />}
                  label="Bestemming"
                  value={ride.dropoff_address ?? formatAddress(ride, "dropoff")}
                />
                <DetailCard
                  icon={<UserRound size={16} />}
                  label="Klant"
                  value={ride.customer_name ?? "Niet beschikbaar"}
                />
                <DetailCard
                  icon={<Phone size={16} />}
                  label="Telefoon"
                  value={ride.customer_phone ?? "Niet beschikbaar"}
                />
                <DetailCard
                  icon={<Wrench size={16} />}
                  label="Dienst"
                  value={serviceTypeLabel(ride.service_type)}
                />
                <DetailCard
                  icon={<Waves size={16} />}
                  label={
                    ride.service_type === "wheelchair"
                      ? "Soort rolstoel"
                      : "Assistentie / extra info"
                  }
                  value={ride.notes?.trim() || "Niet opgegeven"}
                />
              </div>

              {ride.status === "assigned" && (
                <div className="mt-4 flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                  <button
                    onClick={() => handleAccept(ride.id)}
                    disabled={loadingId === ride.id}
                    className="w-full rounded-xl border border-emerald-600 bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:border-emerald-700 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 sm:w-auto"
                  >
                    {loadingId === ride.id ? "..." : "Bevestigen"}
                  </button>

                  <button
                    onClick={() => handleReject(ride.id)}
                    disabled={loadingId === ride.id}
                    className="w-full rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:border-red-100 disabled:bg-red-50 disabled:text-red-300 sm:w-auto"
                  >
                    {loadingId === ride.id ? "..." : "Weigeren"}
                  </button>
                </div>
              )}

              {(ride.status === "accepted" ||
                ride.status === "in_progress") && (
                <div className="mt-4 flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                  <button
                    onClick={() => handleComplete(ride.id)}
                    disabled={loadingId === ride.id}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#0043A8] bg-[#0043A8] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:border-[#00337f] hover:bg-[#00337f] disabled:cursor-not-allowed disabled:border-[#8ab1e8] disabled:bg-[#8ab1e8] sm:w-auto"
                  >
                    <CheckCircle2 size={16} />
                    {loadingId === ride.id ? "..." : "Rit afronden"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function InlineBadge({
  label,
  tone,
}: {
  label: string;
  tone: "blue" | "amber" | "slate";
}) {
  const className = {
    blue: "border-[#D6E6FF] bg-[#EAF3FF] text-[#0043A8]",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    slate: "border-slate-200 bg-white text-slate-700",
  }[tone];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold shadow-sm ${className}`}
    >
      {label}
    </span>
  );
}

function DetailCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-1 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </div>
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function RouteStop({
  title,
  primary,
  secondary,
  accent,
}: {
  title: string;
  primary: string;
  secondary: string;
  accent: "blue" | "emerald";
}) {
  const accentClass = accent === "blue" ? "bg-blue-500" : "bg-emerald-500";

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${accentClass}`} />
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </span>
      </div>
      <div className="text-base font-black text-slate-900">{primary}</div>
      <div className="mt-1 text-sm font-medium text-slate-600">{secondary}</div>
    </div>
  );
}

function formatAddress(ride: Ride, prefix: "pickup" | "dropoff") {
  const street = prefix === "pickup" ? ride.pickup_street : ride.dropoff_street;
  const number = prefix === "pickup" ? ride.pickup_number : ride.dropoff_number;
  const postcode =
    prefix === "pickup" ? ride.pickup_postcode : ride.dropoff_postcode;
  const city = prefix === "pickup" ? ride.pickup_city : ride.dropoff_city;

  return [
    [street, number].filter(Boolean).join(" ").trim(),
    [postcode, city].filter(Boolean).join(" ").trim(),
  ]
    .filter(Boolean)
    .join(", ");
}

function serviceTypeLabel(serviceType?: string) {
  switch (serviceType) {
    case "airport":
      return "Luchthavenvervoer";
    case "wheelchair":
      return "Rolstoelvervoer";
    case "medical":
      return "Medische rit";
    case "assistance":
      return "Assistentie";
    default:
      return serviceType ?? "Niet opgegeven";
  }
}

function formatRideWindow(pickupAt: string, returnAt?: string | null) {
  const pickup = new Date(pickupAt);
  const pickupLabel = pickup.toLocaleString("nl-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!returnAt) {
    return pickupLabel;
  }

  const dropoff = new Date(returnAt);
  const sameDay = pickup.toDateString() === dropoff.toDateString();

  if (sameDay) {
    return `${pickupLabel} - ${dropoff.toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}`;
  }

  return `${pickupLabel} - ${dropoff.toLocaleString("nl-BE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}`;
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
      return {
        background: "#EAF3FF",
        color: "#0043A8",
        border: "1px solid #D6E6FF",
      };
    case "accepted":
      return {
        background: "#dcfce7",
        color: "#166534",
        border: "1px solid #bbf7d0",
      };
    case "completed":
      return {
        background: "#f1f5f9",
        color: "#0f172a",
        border: "1px solid #cbd5e1",
      };
    case "cancelled":
      return {
        background: "#fee2e2",
        color: "#991b1b",
        border: "1px solid #fecaca",
      };
    default:
      return {
        background: "#e5e7eb",
        color: "#111827",
        border: "1px solid #cbd5e1",
      };
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
