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
      className={`rounded-full px-4 py-2 ${
        active ? "btn-primary" : "btn-outline"
      }`}
    >
      {children}
    </button>
  );
}
