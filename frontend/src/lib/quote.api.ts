import { apiFetch } from "./api";

export type CustomerQuote = {
  id: number;
  status: string;
  service_type: string | null;
  pickup_address: string | null;
  dropoff_address: string | null;
  travel_date: string | null;
  return_trip: boolean;
  passengers: number | null;
  price_per_km: string | null;
  estimated_km: string | null;
  total_price: string | null;
  quote_notes: string | null;
  quote_sent_at: string | null;
  quote_signed_at: string | null;
  quote_signer_name: string | null;
  quote_signature_method: string | null;
  created_at: string;
};

export type SignQuoteResponse = {
  message: string;
  quote: CustomerQuote;
};

export function getMyQuotes() {
  return apiFetch<{ quotes: CustomerQuote[] }>("/customer/quotes");
}

export function signQuote(
  quoteId: number,
  signer_name: string,
  signer_date: string,
  signature_method: "name" | "draw",
  accepted_terms: boolean,
) {
  return apiFetch<SignQuoteResponse>(`/customer/quotes/${quoteId}/sign`, {
    method: "POST",
    body: JSON.stringify({
      signer_name,
      signer_date,
      signature_method,
      accepted_terms,
    }),
  });
}
