import { apiFetch } from "./api";

export type Ride = {
  id: number;
  service_type: "airport" | "wheelchair" | "medical" | "assistance";
  pickup_street: string;
  pickup_number?: string;
  pickup_postcode: string;
  pickup_city: string;
  dropoff_street: string;
  dropoff_number?: string;
  dropoff_postcode: string;
  dropoff_city: string;
  pickup_datetime: string;
  has_return_trip: boolean;
  return_datetime?: string;
  notes?: string;
  assistance_type?: "luchthaven" | "ziekenhuis";
  status: string;
  total_price?: number | string | null;
  driver_name?: string;
};

export type CustomerRide = Ride;

export function getMyRides() {
  return apiFetch<Ride[]>("/customer/rides");
}

export function createCustomerRide(payload: CreateCustomerRidePayload) {
  return apiFetch<CreateCustomerRideResponse>("/customer/rides", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type CreateCustomerRidePayload = {
  service_type: "airport" | "wheelchair" | "medical" | "assistance";
  pickup_street: string;
  pickup_number?: string;
  pickup_postcode: string;
  pickup_city: string;
  dropoff_street: string;
  dropoff_number?: string;
  dropoff_postcode: string;
  dropoff_city: string;
  pickup_datetime: string;
  has_return_trip: boolean;
  return_datetime?: string;
  notes?: string;
  assistance_type?: "luchthaven" | "ziekenhuis";
  // Extra fields for return trip departure address
  return_pickup_street?: string;
  return_pickup_postcode?: string;
  return_pickup_city?: string;
};

export type CreateCustomerRideResponse = {
  message: string;
  ride: CustomerRide;
};

export function updateRide(rideId: number, payload: Partial<Ride>) {
  return apiFetch<Ride>(`/customer/rides/${rideId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteRide(rideId: number) {
  return apiFetch<{ message: string }>(`/customer/rides/${rideId}`, {
    method: "DELETE",
  });
}

export type AvailableDriver = {
  id: number;
  available: boolean;
};

export function getAvailableDrivers(params: {
  date: string;
  start_time: string;
  end_time: string;
}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch<{ drivers: AvailableDriver[] }>(
    `/customer/available-drivers?${query}`,
  );
}
