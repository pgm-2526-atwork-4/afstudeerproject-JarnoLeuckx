import { apiFetch } from "./api";

export type AvailabilityStatus = "available" | "unavailable";
export type AvailabilityType = "available" | "sick" | "leave";
export type ApprovalStatus =
  | "not_required"
  | "pending"
  | "approved"
  | "rejected";
export type RequestedByRole = "driver" | "admin";

export type Availability = {
  id: number;
  driver_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: AvailabilityStatus;
  availability_type?: AvailabilityType;
  approval_status?: ApprovalStatus;
  requested_by_role?: RequestedByRole;
  status_label?: string;
  availability_type_label?: string;
  approval_status_label?: string;
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
  end_date?: string;
  start_time: string;
  end_time: string;
  availability_type: AvailabilityType;
  period_months?: 1 | 6;
}) {
  return apiFetch<{ message: string; count: number; items: Availability[] }>(
    "/driver/availabilities",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export function deleteAvailability(id: number) {
  return apiFetch(`/driver/availabilities/${id}`, {
    method: "DELETE",
  });
}
