import { useEffect, useState } from "react";
import DriverStats from "../components/drivers/DriverStats";
import DriverTabs from "../components/drivers/DriverTabs";
import AvailabilityForm from "../components/drivers/AvailabilityForm";
import RideList from "../components/drivers/RideList";
import { getCurrentUser } from "../auth/auth.api";
import {
  getMyAvailabilities,
  getMyRides,
  type Availability,
  type Ride,
} from "../lib/driver.api";

export default function DriverAccountPage() {
  const [activeRideFilter, setActiveRideFilter] = useState<
    "all" | "assigned" | "accepted" | "completed"
  >("all");

  const [activeTab, setActiveTab] = useState<"availabilities" | "rides">(
    "availabilities",
  );

  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);

  async function loadData() {
    const [a, r] = await Promise.all([getMyAvailabilities(), getMyRides()]);
    setAvailabilities(a);
    setRides(r);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const ridesPendingCount = rides.filter(
    (ride) => ride.status === "assigned",
  ).length;
  const ridesAcceptedCount = rides.filter(
    (ride) => ride.status === "accepted",
  ).length;
  const ridesCompletedCount = rides.filter(
    (ride) => ride.status === "completed",
  ).length;

  const currentUser = getCurrentUser();
  const displayName = currentUser?.name ?? "Gebruiker";

  return (
    <div className="page-modern">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-6 surface-card-strong p-6">
          <h1 className="text-3xl font-black text-slate-900">
            Chauffeur account · {displayName}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Beheer je beschikbaarheden en toegewezen ritten.
          </p>
        </div>

        <DriverStats
          availabilitiesCount={availabilities.length}
          ridesPendingCount={ridesPendingCount}
          ridesAcceptedCount={ridesAcceptedCount}
          ridesCompletedCount={ridesCompletedCount}
          activeTab={activeTab}
          activeRideFilter={activeRideFilter}
          onSelectAvailabilities={() => {
            setActiveTab("availabilities");
            setActiveRideFilter("all");
          }}
          onSelectRideFilter={(filter) => {
            setActiveTab("rides");
            setActiveRideFilter(filter);
          }}
        />

        <DriverTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "availabilities" && (
          <div className="space-y-5">
            <AvailabilityForm onCreated={loadData} />
          </div>
        )}

        {activeTab === "rides" && (
          <div className="surface-card p-5">
            <RideList
              rides={rides}
              statusFilter={activeRideFilter}
              onAccepted={loadData}
            />
          </div>
        )}
      </div>
    </div>
  );
}
