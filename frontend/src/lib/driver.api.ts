import { apiFetch } from "./api";

export type Availability = {
  id: number;
  driver_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: "available" | "unavailable";
};

export type Ride = {
  id: number;
  pickup_datetime: string;
  pickup_city: string;
  dropoff_city: string;
  status: string;
};

export function getMyAvailabilities() {
  return apiFetch<Availability[]>("/driver/availabilities");
}

export function getMyRides() {
  return apiFetch<Ride[]>("/driver/rides");
}

export function acceptRide(id: number) {
  return apiFetch<Ride>(`/driver/rides/${id}/accept`, {
    method: "PATCH",
  });
}

export function rejectRide(id: number) {
  return apiFetch<Ride>(`/driver/rides/${id}/reject`, {
    method: "PATCH",
  });
}

export function createAvailability(payload: {
  date: string;
  start_time: string;
  end_time: string;
  status: "available" | "unavailable";
}) {
  return apiFetch<Availability>("/driver/availabilities", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteAvailability(id: number) {
  return apiFetch(`/driver/availabilities/${id}`, {
    method: "DELETE",
  });
}
