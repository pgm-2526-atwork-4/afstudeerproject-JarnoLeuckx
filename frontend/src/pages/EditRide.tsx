import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMyRides,
  updateRide,
  deleteRide,
  type Ride,
} from "../lib/customer.api";
import ReserverenPage from "./Reserveren";

export default function EditRidePage() {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRide() {
      setLoading(true);
      try {
        const rides = await getMyRides();
        const found = rides.find((r) => String(r.id) === String(rideId));
        setRide(found || null);
      } catch (e) {
        setError("Kon rit niet laden.");
      } finally {
        setLoading(false);
      }
    }
    fetchRide();
  }, [rideId]);

  if (loading) return <div>Bezig met laden...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!ride) return <div>Rit niet gevonden.</div>;

  return (
    <ReserverenPage
      mode="edit"
      ride={ride}
      onSave={() => navigate("/customer/account")}
      onDelete={() => navigate("/customer/account")}
    />
  );
}
