import { apiFetch } from "./api";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export function sendContactMessage(payload: ContactPayload) {
  return apiFetch<{ message: string }>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
