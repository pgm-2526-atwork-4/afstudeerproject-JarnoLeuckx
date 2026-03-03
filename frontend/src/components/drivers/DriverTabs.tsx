type Props = {
  activeTab: "availabilities" | "rides";
  setActiveTab: (tab: "availabilities" | "rides") => void;
};

export default function DriverTabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="mb-5 flex flex-wrap gap-3">
      <Tab
        active={activeTab === "availabilities"}
        onClick={() => setActiveTab("availabilities")}
      >
        Beschikbaarheden
      </Tab>

      <Tab active={activeTab === "rides"} onClick={() => setActiveTab("rides")}>
        Toegewezen ritten
      </Tab>
    </div>
  );
}

function Tab({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-bold transition-all ${
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-900 hover:border-slate-300"
      }`}
    >
      {children}
    </button>
  );
}
