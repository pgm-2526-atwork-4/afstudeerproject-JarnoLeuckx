import { apiFetch } from "./api";

export type CustomerRide = {
  id: number;
  title?: string;
  pickup_datetime: string;
  return_datetime?: string | null;
  pickup_address?: string;
  pickup_city: string;
  dropoff_address?: string;
  dropoff_city: string;
  driver_name?: string;
  notes?: string;
  status: string;
  total_price: number | string | null;
};

export function getMyCustomerRides() {
  return apiFetch<CustomerRide[]>("/customer/rides");
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
};

export type CreateCustomerRideResponse = {
  message: string;
  ride: CustomerRide;
};

export function createCustomerRide(payload: CreateCustomerRidePayload) {
  return apiFetch<CreateCustomerRideResponse>("/customer/rides", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type AvailableDriver = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
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
