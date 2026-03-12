import { apiFetch } from "./api";

export type AvailabilityStatus = "available" | "unavailable";
export type AvailabilityType = "available" | "sick" | "leave";
export type ApprovalStatus =
  | "not_required"
  | "pending"
  | "approved"
  | "rejected";
export type RequestedByRole = "driver" | "admin";
export type CalendarColorKey =
  | "available"
  | "leave_approved"
  | "leave_pending"
  | "sick";

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
  calendar_color_key?: CalendarColorKey;
  status_label?: string;
  availability_type_label?: string;
  approval_status_label?: string;
};

export type Ride = {
  id: number;
  pickup_datetime: string;
  return_datetime?: string | null;
  pickup_city: string;
  dropoff_city: string;
  pickup_address?: string;
  dropoff_address?: string;
  pickup_street?: string;
  pickup_number?: string | null;
  pickup_postcode?: string;
  dropoff_street?: string;
  dropoff_number?: string | null;
  dropoff_postcode?: string;
  service_type?: string;
  notes?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
  status: string;
};

function normalizeDateValue(value: string) {
  if (!value) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);

  if (!Number.isNaN(parsed.getTime())) {
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
  }

  return value.slice(0, 10);
}

function normalizeAvailability(availability: Availability): Availability {
  return {
    ...availability,
    date: normalizeDateValue(availability.date),
  };
}

export async function getMyAvailabilities() {
  const items = await apiFetch<Availability[]>("/driver/availabilities");

  return items.map(normalizeAvailability);
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

export function completeRide(id: number) {
  return apiFetch<Ride>(`/driver/rides/${id}/complete`, {
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
  ).then((response) => ({
    ...response,
    items: response.items.map(normalizeAvailability),
  }));
}

export function deleteAvailability(id: number) {
  return apiFetch(`/driver/availabilities/${id}`, {
    method: "DELETE",
  });
}
