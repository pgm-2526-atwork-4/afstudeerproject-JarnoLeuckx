
import { apiFetch } from "./api";

export type Review = {
  id: number;
  ride_id: number;
  customer_id: number;
  driver_id: number;
  stars: number;
  comment: string | null;
  created_at: string;
};

export async function submitReview(
  rideId: number,
  stars: number,
  comment: string,
) {
  return apiFetch<Review>(`/rides/${rideId}/review`, {
    method: "POST",
    body: JSON.stringify({ stars, comment }),
  });
}

export async function getDriverReviews(driverId: number) {
  return apiFetch<Review[]>(`/drivers/${driverId}/reviews`);
}
