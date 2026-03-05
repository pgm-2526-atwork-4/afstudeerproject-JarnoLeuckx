import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import CustomerRideList from "../components/customers/CustomerRideList";
import CustomerStats from "../components/customers/CustomerStats";
import CustomerHeaderBar from "../components/customers/CustomerHeaderBar";
import { getCurrentUser } from "../auth/auth.api";
import {
  downloadCustomerContract,
  downloadSignedCustomerContract,
} from "../lib/customerContract";
import { signCustomerContract } from "../lib/customerContract.api";

import { getMyCustomerRides, type CustomerRide } from "../lib/customer.api";

type RideStatusFilter =
  | "all"
  | "pending"
  | "assigned"
  | "accepted"
  | "completed"
  | "cancelled";

function todayAsInputDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function CustomerAccountPage() {
  const currentUser = getCurrentUser();
  const displayName = currentUser?.name ?? "Gebruiker";

  const [activeRideFilter, setActiveRideFilter] =
    useState<RideStatusFilter>("all");
  const [rides, setRides] = useState<CustomerRide[]>([]);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [signatureName, setSignatureName] = useState(
    () => currentUser?.name ?? "",
  );
  const [signatureMethod, setSignatureMethod] = useState<"draw" | "name">(
    "draw",
  );
  const [signatureDate, setSignatureDate] = useState(todayAsInputDate());
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [contractError, setContractError] = useState<string | null>(null);
  const [hasSignedContract, setHasSignedContract] = useState(
    Boolean(currentUser?.pvb_contract_signed_at),
  );
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const signatureCanvasRef = useRef<SignatureCanvas | null>(null);

  async function loadData() {
    const result = await getMyCustomerRides();
    setRides(result);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const ridesTotalCount = rides.length;
  const ridesAcceptedCount = rides.filter(
    (r) => r.status === "accepted",
  ).length;
  const ridesPendingCount = rides.filter(
    (r) => r.status === "pending" || r.status === "assigned",
  ).length;
  const ridesCancelledCount = rides.filter(
    (r) => r.status === "cancelled",
  ).length;

  async function handleDownloadContract() {
    if (!currentUser) return;
    await downloadCustomerContract(currentUser);
  }

  async function handleSignContract() {
    if (!currentUser) return;

    const cleanName = signatureName.trim();
    const today = todayAsInputDate();

    if (!acceptedTerms) {
      setContractError(
        "Bevestig eerst dat je akkoord gaat met het PVB-contact.",
      );
      return;
    }

    if (signatureMethod === "name" && !cleanName) {
      setContractError("Geef je naam in om digitaal te ondertekenen.");
      return;
    }

    if (signatureMethod === "name" && cleanName.length < 2) {
      setContractError("Naam voor handtekening moet minstens 2 tekens bevatten.");
      return;
    }

    if (!signatureDate) {
      setContractError("Kies een datum van ondertekening.");
      return;
    }

    if (signatureDate > today) {
      setContractError("Datum van ondertekening mag niet in de toekomst liggen.");
      return;
    }

    let signerName = cleanName;
    let drawnSignatureDataUrl: string | undefined;

    if (signatureMethod === "draw") {
      signerName = currentUser.name ?? cleanName;

      if (!signatureCanvasRef.current || !hasDrawnSignature) {
        setContractError("Plaats eerst je handtekening in het tekenvak.");
        return;
      }

      const trimmedCanvas = signatureCanvasRef.current.getTrimmedCanvas();
      drawnSignatureDataUrl = trimmedCanvas.toDataURL("image/png");
    }

    setContractError(null);

    try {
      await signCustomerContract(
        signerName,
        signatureDate,
        signatureMethod,
        acceptedTerms,
      );
      await downloadSignedCustomerContract(currentUser, {
        method: signatureMethod,
        signerName,
        signerDate: signatureDate,
        drawnSignatureDataUrl,
      });
      setHasSignedContract(true);
      setIsContractModalOpen(false);
    } catch (err) {
      const message =
        err instanceof Error
          ? (() => {
              try {
                const parsed = JSON.parse(err.message) as { message?: string };
                return parsed.message ?? err.message;
              } catch {
                return err.message;
              }
            })()
          : "Ondertekenen mislukt.";

      setContractError(message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ✅ Full width topbar */}
      <CustomerHeaderBar name={displayName} />

      {/* ✅ Content container */}
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Mijn ritten
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Overzicht van al uw geboekte en geplande ritten
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/reserveren" className="btn-primary">
                Rit aanvragen
              </Link>
              <button
                type="button"
                onClick={() => {
                  void handleDownloadContract();
                }}
                className="btn-outline"
              >
                Contract downloaden
              </button>
              <button
                type="button"
                disabled={hasSignedContract}
                onClick={() => {
                  setSignatureName(currentUser?.name ?? "");
                  setSignatureMethod("draw");
                  setSignatureDate(todayAsInputDate());
                  setAcceptedTerms(false);
                  setContractError(null);
                  setHasDrawnSignature(false);
                  signatureCanvasRef.current?.clear();
                  setIsContractModalOpen(true);
                }}
                className={[
                  "btn-outline",
                  hasSignedContract
                    ? "cursor-not-allowed border-slate-200 bg-slate-200 text-slate-500"
                    : "",
                ].join(" ")}
              >
                {hasSignedContract
                  ? "PVB-contact ondertekend"
                  : "PVB-contact ondertekenen"}
              </button>
            </div>
          </div>
        </div>

        <CustomerStats
          ridesTotalCount={ridesTotalCount}
          ridesAcceptedCount={ridesAcceptedCount}
          ridesPendingCount={ridesPendingCount}
          ridesCancelledCount={ridesCancelledCount}
          activeRideFilter={activeRideFilter}
          onSelectRideFilter={setActiveRideFilter}
        />

        <CustomerRideList rides={rides} statusFilter={activeRideFilter} />
      </div>

      {isContractModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-black text-slate-900">
              PVB-contact nakijken & ondertekenen
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Controleer je gegevens en onderteken digitaal indien alles correct
              is.
            </p>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">
                Contractsamenvatting
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Naam: {currentUser?.name ?? "-"}</li>
                <li>E-mail: {currentUser?.email ?? "-"}</li>
                <li>Telefoon: {currentUser?.phone ?? "-"}</li>
                <li>Adres: {currentUser?.address ?? "-"}</li>
                <li>VAPH-nummer: {currentUser?.vaph_number ?? "-"}</li>
              </ul>
            </div>

            {signatureMethod === "name" ? (
              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-semibold text-primary">
                  Naam voor digitale handtekening
                </span>
                <input
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="h-11 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </label>
            ) : (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                Ondertekenaar:{" "}
                <span className="font-semibold">
                  {currentUser?.name ?? "-"}
                </span>
              </div>
            )}

            <div className="mt-4">
              <span className="mb-2 block text-xs font-semibold text-primary">
                Kies ondertekenmethode
              </span>
              <div className="flex flex-wrap gap-4 text-sm text-slate-700">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="signature_method"
                    checked={signatureMethod === "draw"}
                    onChange={() => {
                      setSignatureMethod("draw");
                      setContractError(null);
                    }}
                    className="h-4 w-4 accent-[color:var(--accent)]"
                  />
                  Handtekening tekenen
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="signature_method"
                    checked={signatureMethod === "name"}
                    onChange={() => {
                      setSignatureMethod("name");
                      setContractError(null);
                    }}
                    className="h-4 w-4 accent-[color:var(--accent)]"
                  />
                  Ondertekenen met naam
                </label>
              </div>
            </div>

            {signatureMethod === "draw" && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                <div className="mb-2 text-xs font-semibold text-primary">
                  Teken hier je handtekening
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                  <SignatureCanvas
                    ref={signatureCanvasRef}
                    penColor="black"
                    onBegin={() => {
                      setHasDrawnSignature(true);
                      setContractError(null);
                    }}
                    canvasProps={{
                      width: 700,
                      height: 180,
                      className: "h-40 w-full rounded-md bg-white",
                    }}
                  />
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      signatureCanvasRef.current?.clear();
                      setHasDrawnSignature(false);
                    }}
                    className="btn-outline px-3 py-1.5 text-xs"
                  >
                    Wissen
                  </button>
                </div>
              </div>
            )}

            <label className="mt-4 block">
              <span className="mb-2 block text-xs font-semibold text-primary">
                Datum van ondertekening
              </span>
              <input
                type="date"
                value={signatureDate}
                max={todayAsInputDate()}
                onChange={(e) => setSignatureDate(e.target.value)}
                className="h-11 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </label>

            <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="h-4 w-4 accent-[color:var(--accent)]"
              />
              Ik heb het PVB-contact nagekeken en ga akkoord met de inhoud.
            </label>

            {contractError && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {contractError}
              </div>
            )}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsContractModalOpen(false)}
                className="btn-outline"
              >
                Sluiten
              </button>
              <button
                type="button"
                onClick={() => {
                  void handleSignContract();
                }}
                className="btn-primary"
              >
                Digitaal ondertekenen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
