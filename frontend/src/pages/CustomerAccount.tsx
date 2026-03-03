import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomerRideList from "../components/customers/CustomerRideList";
import CustomerStats from "../components/customers/CustomerStats";
import CustomerHeaderBar from "../components/customers/CustomerHeaderBar";
import { getCurrentUser } from "../auth/auth.api";
import { downloadCustomerContract } from "../lib/customerContract";

import { getMyCustomerRides, type CustomerRide } from "../lib/customer.api";

type RideStatusFilter =
  | "all"
  | "pending"
  | "assigned"
  | "accepted"
  | "completed"
  | "cancelled";

export default function CustomerAccountPage() {
  const [activeRideFilter, setActiveRideFilter] =
    useState<RideStatusFilter>("all");
  const [rides, setRides] = useState<CustomerRide[]>([]);

  async function loadData() {
    const result = await getMyCustomerRides();
    setRides(result);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const ridesTotalCount = rides.length;
  const ridesAcceptedCount = rides.filter(
    (r) => r.status === "accepted",
  ).length;
  const ridesPendingCount = rides.filter(
    (r) => r.status === "pending" || r.status === "assigned",
  ).length;
  const ridesCancelledCount = rides.filter(
    (r) => r.status === "cancelled",
  ).length;

  const currentUser = getCurrentUser();
  const displayName = currentUser?.name ?? "Gebruiker";

  async function handleDownloadContract() {
    if (!currentUser) return;
    await downloadCustomerContract(currentUser);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ✅ Full width topbar */}
      <CustomerHeaderBar name={displayName} />

      {/* ✅ Content container */}
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Mijn ritten
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Overzicht van al uw geboekte en geplande ritten
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/reserveren"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Rit aanvragen
              </Link>
              <button
                type="button"
                onClick={() => {
                  void handleDownloadContract();
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-400"
              >
                Contract downloaden
              </button>
            </div>
          </div>
        </div>

        <CustomerStats
          ridesTotalCount={ridesTotalCount}
          ridesAcceptedCount={ridesAcceptedCount}
          ridesPendingCount={ridesPendingCount}
          ridesCancelledCount={ridesCancelledCount}
          activeRideFilter={activeRideFilter}
          onSelectRideFilter={setActiveRideFilter}
        />

        <CustomerRideList rides={rides} statusFilter={activeRideFilter} />
      </div>
    </div>
  );
}
