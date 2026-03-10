import { Link } from "react-router-dom";
import { createPortal } from "react-dom";

type ReservationAccountPromptProps = {
  mode: "login" | "register";
  onClose: () => void;
  loginTo?: string;
  registerTo?: string;
};

export default function ReservationAccountPrompt({
  mode,
  onClose,
  loginTo = "/login",
  registerTo = "/register",
}: ReservationAccountPromptProps) {
  const isLoginPrompt = mode === "login";

  const modal = (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-900/50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-black text-slate-900">
          {isLoginPrompt ? "Account gevonden" : "Nog geen account gevonden"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {isLoginPrompt
            ? "Dit e-mailadres is gekoppeld aan een bestaand account. Log eerst in om je reservatie verder te zetten."
            : "Voor dit e-mailadres bestaat nog geen account. Wil je eerst een account aanmaken?"}
        </p>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-outline">
            {isLoginPrompt ? "Sluiten" : "Nog niet"}
          </button>
          <Link
            to={isLoginPrompt ? loginTo : registerTo}
            className="btn-primary"
          >
            {isLoginPrompt ? "Inloggen" : "Account aanmaken"}
          </Link>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
