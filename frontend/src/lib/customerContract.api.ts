import { apiFetch } from "./api";
import type { User } from "../auth/auth.api";

export type SignContractResponse = {
  message: string;
  user: User;
};

export function signCustomerContract(
  signer_name: string,
  signer_date: string,
  signature_method: "name" | "draw",
  accepted_terms: boolean,
) {
  return apiFetch<SignContractResponse>("/customer/contract/sign", {
    method: "POST",
    body: JSON.stringify({
      signer_name,
      signer_date,
      signature_method,
      accepted_terms,
    }),
  });
}
