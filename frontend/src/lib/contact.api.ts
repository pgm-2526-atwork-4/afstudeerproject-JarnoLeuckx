import { apiFetch } from "./api";

export type ContactPayload = {
  request_type: "contact" | "offerte";
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  service_type?: string;
  pickup_address?: string;
  dropoff_address?: string;
  travel_date?: string;
  return_trip?: boolean;
  passengers?: number;
};

export function sendContactMessage(payload: ContactPayload) {
  return apiFetch<{ message: string }>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
