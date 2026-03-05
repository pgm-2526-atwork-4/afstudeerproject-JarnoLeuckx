type RideStatusFilter = "all" | "assigned" | "accepted" | "completed";

type Props = {
  availabilitiesCount: number;
  ridesPendingCount: number;
  ridesAcceptedCount: number;
  ridesCompletedCount: number;
  activeTab: "availabilities" | "rides";
  activeRideFilter: RideStatusFilter;
  onSelectAvailabilities: () => void;
  onSelectRideFilter: (filter: RideStatusFilter) => void;
};

export default function DriverStats({
  availabilitiesCount,
  ridesPendingCount,
  ridesAcceptedCount,
  ridesCompletedCount,
  activeTab,
  activeRideFilter,
  onSelectAvailabilities,
  onSelectRideFilter,
}: Props) {
  return (
    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat
        title="Beschikbaarheden"
        value={String(availabilitiesCount)}
        active={activeTab === "availabilities"}
        onClick={onSelectAvailabilities}
      />
      <Stat
        title="In afwachting"
        value={String(ridesPendingCount)}
        active={activeTab === "rides" && activeRideFilter === "assigned"}
        onClick={() => onSelectRideFilter("assigned")}
      />
      <Stat
        title="Geaccepteerd"
        value={String(ridesAcceptedCount)}
        active={activeTab === "rides" && activeRideFilter === "accepted"}
        onClick={() => onSelectRideFilter("accepted")}
      />
      <Stat
        title="Afgerond"
        value={String(ridesCompletedCount)}
        active={activeTab === "rides" && activeRideFilter === "completed"}
        onClick={() => onSelectRideFilter("completed")}
      />
    </div>
  );
}

function Stat({
  title,
  value,
  active,
  onClick,
}: {
  title: string;
  value: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition-all ${
        active
          ? "border-[#0043A8] bg-[#EAF3FF] shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </div>
      <div className="mt-2 text-3xl font-black text-slate-900">{value}</div>
    </button>
  );
}
