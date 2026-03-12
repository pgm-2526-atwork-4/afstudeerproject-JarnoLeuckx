type RideStatusFilter =
  | "all"
  | "pending"
  | "assigned"
  | "accepted"
  | "completed"
  | "cancelled";

type Props = {
  ridesTotalCount: number;
  ridesAcceptedCount: number;
  ridesPendingCount: number;
  ridesCancelledCount: number;
  activeRideFilter: RideStatusFilter;
  onSelectRideFilter: (filter: RideStatusFilter) => void;
};

export default function CustomerStats({
  ridesTotalCount,
  ridesAcceptedCount,
  ridesPendingCount,
  ridesCancelledCount,
  activeRideFilter,
  onSelectRideFilter,
}: Props) {
  return (
    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat
        title="Totaal ritten"
        value={ridesTotalCount}
        icon="📅"
        active={activeRideFilter === "all"}
        onClick={() => onSelectRideFilter("all")}
      />
      <Stat
        title="Bevestigd"
        value={ridesAcceptedCount}
        icon="✅"
        active={activeRideFilter === "accepted"}
        onClick={() => onSelectRideFilter("accepted")}
      />
      <Stat
        title="In behandeling"
        value={ridesPendingCount}
        icon="✴️"
        active={
          activeRideFilter === "pending" || activeRideFilter === "assigned"
        }
        onClick={() => onSelectRideFilter("pending")}
      />
      <Stat
        title="Geannuleerd"
        value={ridesCancelledCount}
        icon="❌"
        active={activeRideFilter === "cancelled"}
        onClick={() => onSelectRideFilter("cancelled")}
      />
    </div>
  );
}

function Stat({
  title,
  value,
  icon,
  active,
  onClick,
}: {
  title: string;
  value: number;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`Filter ritten: ${title}`}
      className={`rounded-2xl bg-white p-4 text-left transition-all ${
        active
          ? "border-2 border-[#0043A8] bg-[#EAF3FF] shadow-sm"
          : "border border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </div>
        <div className="text-xl" aria-hidden="true">
          {icon}
        </div>
      </div>
      <div className="mt-2 text-3xl font-black text-slate-900">{value}</div>
    </button>
  );
}
