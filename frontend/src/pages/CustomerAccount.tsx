import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import CustomerRideList from "../components/customers/CustomerRideList";
import {
  getCurrentUser,
  setCurrentUser,
  updateNotificationPreferences,
} from "../auth/auth.api";
import {
  downloadCustomerContract,
  downloadSignedCustomerContract,
} from "../lib/customerContract";
import { signCustomerContract } from "../lib/customerContract.api";
import { getMyQuotes, signQuote, type CustomerQuote } from "../lib/quote.api";
import { downloadQuotePdf } from "../lib/quote";

import {
  getAvailableDrivers,
  getMyCustomerRides,
  type AvailableDriver,
  type CustomerRide,
} from "../lib/customer.api";

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

function parseInputDate(value: string) {
  const [yyyy, mm, dd] = value.split("-").map(Number);

  if (!yyyy || !mm || !dd) {
    return null;
  }

  const date = new Date(yyyy, mm - 1, dd);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getTimeBasedGreeting(name: string) {
  const hour = new Date().getHours();

  if (hour < 12) {
    return `Goedemorgen ${name}`;
  }

  if (hour < 18) {
    return `Goedemiddag ${name}`;
  }

  return `Goedenavond ${name}`;
}

export default function CustomerAccountPage() {
  const currentUser = getCurrentUser();
  const displayName = currentUser?.name ?? "Gebruiker";
  const [welcomeGreeting, setWelcomeGreeting] = useState(
    `Welkom ${displayName}`,
  );

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
  const [calendarDate, setCalendarDate] = useState(todayAsInputDate());
  const [calendarStartTime, setCalendarStartTime] = useState("09:00");
  const [calendarEndTime, setCalendarEndTime] = useState("10:00");
  const [availableDrivers, setAvailableDrivers] = useState<AvailableDriver[]>(
    [],
  );
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(
    null,
  );
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<
    "idle" | "available" | "unavailable"
  >("idle");
  const [visibleCalendarMonth, setVisibleCalendarMonth] = useState(() => {
    const selectedDate = parseInputDate(todayAsInputDate()) ?? new Date();
    return startOfMonth(selectedDate);
  });
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(
    Boolean(
      currentUser &&
      currentUser.role === "customer" &&
      currentUser.email_notifications_enabled == null,
    ),
  );
  const [notificationPromptLoading, setNotificationPromptLoading] =
    useState(false);
  const [notificationPromptError, setNotificationPromptError] = useState<
    string | null
  >(null);
  const signatureCanvasRef = useRef<SignatureCanvas | null>(null);
  const quoteSignatureCanvasRef = useRef<SignatureCanvas | null>(null);
  const notificationPromptTitleId = useId();
  const notificationPromptDescriptionId = useId();
  const contractModalTitleId = useId();
  const contractModalDescriptionId = useId();
  const quoteModalTitleId = useId();
  const quoteModalDescriptionId = useId();
  const notificationDismissButtonRef = useRef<HTMLButtonElement | null>(null);
  const contractCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const quoteCloseButtonRef = useRef<HTMLButtonElement | null>(null);

  const [quotes, setQuotes] = useState<CustomerQuote[]>([]);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<CustomerQuote | null>(
    null,
  );
  const [quoteSignatureName, setQuoteSignatureName] = useState(
    () => currentUser?.name ?? "",
  );
  const [quoteSignatureMethod, setQuoteSignatureMethod] = useState<
    "draw" | "name"
  >("draw");
  const [quoteSignatureDate, setQuoteSignatureDate] =
    useState(todayAsInputDate());
  const [quoteAcceptedTerms, setQuoteAcceptedTerms] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoteHasDrawnSignature, setQuoteHasDrawnSignature] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);

  async function loadData() {
    const result = await getMyCustomerRides();
    setRides(result);

    try {
      const quoteResult = await getMyQuotes();
      setQuotes(quoteResult.quotes);
    } catch {
    }
  }

  async function loadAvailableDrivers() {
    setAvailabilityLoading(true);
    setAvailabilityMessage(null);

    try {
      if (!calendarDate || !calendarStartTime || !calendarEndTime) {
        setAvailabilityMessage("Kies datum, starttijd en eindtijd.");
        setAvailableDrivers([]);
        setAvailabilityStatus("idle");
        return;
      }

      if (calendarEndTime <= calendarStartTime) {
        setAvailabilityMessage("Eindtijd moet na starttijd liggen.");
        setAvailableDrivers([]);
        setAvailabilityStatus("idle");
        return;
      }

      const result = await getAvailableDrivers({
        date: calendarDate,
        start_time: calendarStartTime,
        end_time: calendarEndTime,
      });

      setAvailableDrivers(result.drivers);

      if (result.drivers.length === 0) {
        setAvailabilityStatus("unavailable");
        setAvailabilityMessage(
          "Geen vrije chauffeurs gevonden voor dit tijdslot.",
        );
      } else {
        setAvailabilityStatus("available");
      }
    } catch (err) {
      setAvailabilityMessage(
        err instanceof Error
          ? err.message
          : "Vrije chauffeurs ophalen mislukt.",
      );
      setAvailableDrivers([]);
      setAvailabilityStatus("idle");
    } finally {
      setAvailabilityLoading(false);
    }
  }

  useEffect(() => {
    setAvailableDrivers([]);
    setAvailabilityMessage(null);
    setAvailabilityStatus("idle");
  }, [calendarDate, calendarStartTime, calendarEndTime]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadData();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const userId = currentUser?.id;

    if (!userId) {
      setWelcomeGreeting(`Welkom ${displayName}`);
      return;
    }

    const storageKey = `customer-account-visited-${userId}`;

    try {
      const hasVisited = window.localStorage.getItem(storageKey) === "1";

      if (!hasVisited) {
        window.localStorage.setItem(storageKey, "1");
        setWelcomeGreeting(`Welkom ${displayName}`);
        return;
      }

      setWelcomeGreeting(getTimeBasedGreeting(displayName));
    } catch {
      setWelcomeGreeting(getTimeBasedGreeting(displayName));
    }
  }, [currentUser?.id, displayName]);

  useEffect(() => {
    if (!showNotificationPrompt) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    notificationDismissButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !notificationPromptLoading) {
        void handleNotificationPreferenceChoice(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [notificationPromptLoading, showNotificationPrompt]);

  useEffect(() => {
    if (!isContractModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    contractCloseButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsContractModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isContractModalOpen]);

  useEffect(() => {
    if (!isQuoteModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    quoteCloseButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !quoteLoading) {
        setIsQuoteModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isQuoteModalOpen, quoteLoading]);

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

  const monthlyRideStats = rides.reduce<
    Record<string, { total: number; completed: number }>
  >((accumulator, ride) => {
    const date = new Date(ride.pickup_datetime);
    if (Number.isNaN(date.getTime())) {
      return accumulator;
    }

    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!accumulator[monthKey]) {
      accumulator[monthKey] = { total: 0, completed: 0 };
    }

    accumulator[monthKey].total += 1;

    if (ride.status === "completed") {
      accumulator[monthKey].completed += 1;
    }

    return accumulator;
  }, {});

  const monthlyRideEntries = Object.entries(monthlyRideStats)
    .sort(([monthA], [monthB]) => (monthA < monthB ? 1 : -1))
    .map(([monthKey, values]) => {
      const monthDate = new Date(`${monthKey}-01T00:00:00`);
      const label = new Intl.DateTimeFormat("nl-BE", {
        month: "long",
        year: "numeric",
      }).format(monthDate);

      return {
        monthKey,
        label: label.charAt(0).toUpperCase() + label.slice(1),
        ...values,
      };
    });

  const selectedCalendarDate = parseInputDate(calendarDate);
  const todayInputDate = todayAsInputDate();
  const weekdayLabels = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
  const monthLabel = new Intl.DateTimeFormat("nl-BE", {
    month: "long",
    year: "numeric",
  }).format(visibleCalendarMonth);

  const calendarCells = (() => {
    const year = visibleCalendarMonth.getFullYear();
    const month = visibleCalendarMonth.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPreviousMonth = new Date(year, month, 0).getDate();

    const cells: Array<{
      dateValue: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isDisabled: boolean;
      isSelected: boolean;
      isToday: boolean;
    }> = [];

    for (let index = firstWeekday - 1; index >= 0; index -= 1) {
      const dayNumber = daysInPreviousMonth - index;
      const date = new Date(year, month - 1, dayNumber);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;

      cells.push({
        dateValue: formattedDate,
        dayNumber,
        isCurrentMonth: false,
        isDisabled: formattedDate < todayInputDate,
        isSelected: calendarDate === formattedDate,
        isToday: formattedDate === todayInputDate,
      });
    }

    for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber += 1) {
      const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;

      cells.push({
        dateValue: formattedDate,
        dayNumber,
        isCurrentMonth: true,
        isDisabled: formattedDate < todayInputDate,
        isSelected: calendarDate === formattedDate,
        isToday: formattedDate === todayInputDate,
      });
    }

    const remaining = 42 - cells.length;
    for (let dayNumber = 1; dayNumber <= remaining; dayNumber += 1) {
      const date = new Date(year, month + 1, dayNumber);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;

      cells.push({
        dateValue: formattedDate,
        dayNumber,
        isCurrentMonth: false,
        isDisabled: formattedDate < todayInputDate,
        isSelected: calendarDate === formattedDate,
        isToday: formattedDate === todayInputDate,
      });
    }

    return cells;
  })();

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
      setContractError(
        "Naam voor handtekening moet minstens 2 tekens bevatten.",
      );
      return;
    }

    if (!signatureDate) {
      setContractError("Kies een datum van ondertekening.");
      return;
    }

    if (signatureDate > today) {
      setContractError(
        "Datum van ondertekening mag niet in de toekomst liggen.",
      );
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

  async function handleSignQuote() {
    if (!selectedQuote) return;

    const cleanName = quoteSignatureName.trim();
    const today = todayAsInputDate();

    if (!quoteAcceptedTerms) {
      setQuoteError("Bevestig eerst dat je akkoord gaat met de offerte.");
      return;
    }

    if (quoteSignatureMethod === "name" && !cleanName) {
      setQuoteError("Geef je naam in om digitaal te ondertekenen.");
      return;
    }

    if (quoteSignatureMethod === "name" && cleanName.length < 2) {
      setQuoteError("Naam voor handtekening moet minstens 2 tekens bevatten.");
      return;
    }

    if (!quoteSignatureDate) {
      setQuoteError("Kies een datum van ondertekening.");
      return;
    }

    if (quoteSignatureDate > today) {
      setQuoteError("Datum van ondertekening mag niet in de toekomst liggen.");
      return;
    }

    let signerName = cleanName;
    let drawnSignatureDataUrl: string | undefined;

    if (quoteSignatureMethod === "draw") {
      signerName = currentUser?.name ?? cleanName;

      if (!quoteSignatureCanvasRef.current || !quoteHasDrawnSignature) {
        setQuoteError("Plaats eerst je handtekening in het tekenvak.");
        return;
      }

      const trimmedCanvas = quoteSignatureCanvasRef.current.getTrimmedCanvas();
      drawnSignatureDataUrl = trimmedCanvas.toDataURL("image/png");
    }

    setQuoteError(null);
    setQuoteLoading(true);

    try {
      const result = await signQuote(
        selectedQuote.id,
        signerName,
        quoteSignatureDate,
        quoteSignatureMethod,
        quoteAcceptedTerms,
      );

      await downloadQuotePdf(result.quote, {
        method: quoteSignatureMethod,
        signerName,
        signerDate: quoteSignatureDate,
        signedAt: new Date().toLocaleDateString("nl-BE"),
        drawnSignatureDataUrl,
      });

      setQuotes((prev) =>
        prev.map((q) => (q.id === result.quote.id ? result.quote : q)),
      );
      setIsQuoteModalOpen(false);
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

      setQuoteError(message);
    } finally {
      setQuoteLoading(false);
    }
  }

  async function handleNotificationPreferenceChoice(enabled: boolean) {
    setNotificationPromptError(null);
    setNotificationPromptLoading(true);

    try {
      const result = await updateNotificationPreferences(enabled);
      setCurrentUser(result.user);
      setShowNotificationPrompt(false);
    } catch (err) {
      setNotificationPromptError(
        err instanceof Error
          ? err.message
          : "Meldingsvoorkeur opslaan mislukt.",
      );
    } finally {
      setNotificationPromptLoading(false);
    }
  }

  return (
    <div className="page-modern">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-5 surface-card-strong p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                {welcomeGreeting}
              </h1>
            </div>

            <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
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

        <div className="mb-5 surface-card p-5">
          <h2 className="text-xl font-extrabold text-slate-900">
            Chauffeurskalender
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Kies een datum en tijdslot om te zien welke chauffeurs vrij zijn. De
            chauffeur moet een toegewezen rit nog zelf bevestigen voordat die
            definitief vastligt.
          </p>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-2 max-lg:mx-auto">
              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCalendarMonth((current) => addMonths(current, -1))
                  }
                  className="btn-outline px-2.5 py-1 text-xs"
                >
                  Vorige
                </button>

                <p className="text-sm font-bold text-slate-900">
                  {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setVisibleCalendarMonth((current) => addMonths(current, 1))
                  }
                  className="btn-outline px-2.5 py-1 text-xs"
                >
                  Volgende
                </button>
              </div>

              <div className="overflow-x-auto">
                <div className="grid min-w-[300px] grid-cols-7 gap-0.5 sm:min-w-0">
                  {weekdayLabels.map((label) => (
                    <div
                      key={label}
                      className="py-0.5 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {label}
                    </div>
                  ))}

                  {calendarCells.map((cell) => (
                    <button
                      key={`${cell.dateValue}-${cell.dayNumber}`}
                      type="button"
                      disabled={cell.isDisabled}
                      onClick={() => {
                        setCalendarDate(cell.dateValue);
                        const selectedDate = parseInputDate(cell.dateValue);
                        if (selectedDate) {
                          setVisibleCalendarMonth(startOfMonth(selectedDate));
                        }
                      }}
                      className={[
                        "h-8 rounded-md border text-xs font-semibold transition",
                        cell.isDisabled
                          ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                          : cell.isSelected
                            ? availabilityStatus === "available"
                              ? "border-emerald-500 bg-emerald-100 text-emerald-800"
                              : availabilityStatus === "unavailable"
                                ? "border-red-500 bg-red-100 text-red-800"
                                : "border-[#0043A8] bg-[#EAF3FF] text-[#0043A8]"
                            : cell.isToday
                              ? "border-slate-300 bg-white text-slate-900"
                              : cell.isCurrentMonth
                                ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                                : "border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100",
                      ].join(" ")}
                    >
                      {cell.dayNumber}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                Geselecteerde datum:{" "}
                <span className="font-semibold text-slate-900">
                  {selectedCalendarDate
                    ? new Intl.DateTimeFormat("nl-BE", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }).format(selectedCalendarDate)
                    : "-"}
                </span>
              </div>

              <label className="grid gap-1.5">
                <span className="form-label">Starttijd</span>
                <input
                  type="time"
                  value={calendarStartTime}
                  onChange={(event) => setCalendarStartTime(event.target.value)}
                  className="form-input"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="form-label">Eindtijd</span>
                <input
                  type="time"
                  value={calendarEndTime}
                  onChange={(event) => setCalendarEndTime(event.target.value)}
                  className="form-input"
                />
              </label>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    void loadAvailableDrivers();
                  }}
                  className="btn-accent w-full"
                >
                  {availabilityLoading ? "Laden..." : "Controleer chauffeurs"}
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Enkel vandaag en toekomstige dagen zijn selecteerbaar.
              </p>
            </div>
          </div>

          {availabilityMessage && (
            <div
              className={[
                "mt-3 rounded-lg px-3 py-2 text-sm",
                availabilityStatus === "unavailable"
                  ? "border border-red-200 bg-red-50 text-red-700"
                  : "border border-slate-200 bg-slate-50 text-slate-700",
              ].join(" ")}
            >
              {availabilityMessage}
            </div>
          )}

          {availableDrivers.length > 0 && (
            <>
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                Er is minstens één vrije chauffeur gevonden. Een beheerder kan
                toewijzen, maar de chauffeur moet de rit daarna nog zelf
                bevestigen.
              </div>
              <ul className="mt-4 divide-y divide-emerald-100 rounded-lg border border-emerald-200 bg-white">
                {availableDrivers.map((driver) => (
                  <li
                    key={driver.id}
                    className="flex flex-col items-start gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="text-sm font-bold text-slate-900">
                      {driver.name}
                    </p>
                    <p className="text-xs text-slate-600">
                      {driver.phone || driver.email || "Geen contactinfo"}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-extrabold text-slate-900">
            Ritten per maand
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Totaal: {ridesTotalCount} ritten · Bevestigd: {ridesAcceptedCount} ·
            In behandeling: {ridesPendingCount} · Geannuleerd:{" "}
            {ridesCancelledCount}
          </p>

          {monthlyRideEntries.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">
              Nog geen ritten beschikbaar.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200">
              {monthlyRideEntries.map((item) => (
                <li
                  key={item.monthKey}
                  className="flex flex-col items-start gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-sm font-semibold text-slate-900">
                    {item.label}
                  </span>
                  <span className="text-sm text-slate-700">
                    {item.total} ritten ({item.completed} afgerond)
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
            <button
              type="button"
              onClick={() => setActiveRideFilter("all")}
              className={`btn-outline ${activeRideFilter === "all" ? "border-[#0043A8] bg-[#EAF3FF] text-[#0043A8]" : ""}`}
            >
              Alle ritten
            </button>
            <button
              type="button"
              onClick={() => setActiveRideFilter("accepted")}
              className={`btn-outline ${activeRideFilter === "accepted" ? "border-[#0043A8] bg-[#EAF3FF] text-[#0043A8]" : ""}`}
            >
              Bevestigd
            </button>
            <button
              type="button"
              onClick={() => setActiveRideFilter("pending")}
              className={`btn-outline ${activeRideFilter === "pending" || activeRideFilter === "assigned" ? "border-[#0043A8] bg-[#EAF3FF] text-[#0043A8]" : ""}`}
            >
              In behandeling
            </button>
            <button
              type="button"
              onClick={() => setActiveRideFilter("cancelled")}
              className={`btn-outline ${activeRideFilter === "cancelled" ? "border-[#0043A8] bg-[#EAF3FF] text-[#0043A8]" : ""}`}
            >
              Geannuleerd
            </button>
          </div>
        </section>

        <div className="surface-card p-5">
          <CustomerRideList rides={rides} statusFilter={activeRideFilter} />
        </div>

        {quotes.length > 0 && (
          <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-extrabold text-slate-900">
              Mijn offertes
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Overzicht van de prijsoffertes die Social Drive heeft opgemaakt
              voor jou.
            </p>

            <ul className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200">
              {quotes.map((quote) => {
                const statusLabel: Record<string, string> = {
                  offerte_verstuurd: "Offerte ontvangen",
                  ondertekend: "Ondertekend",
                  afgewerkt: "Afgewerkt",
                };
                const statusColor: Record<string, string> = {
                  offerte_verstuurd: "bg-blue-100 text-blue-800",
                  ondertekend: "bg-emerald-100 text-emerald-800",
                  afgewerkt: "bg-slate-100 text-slate-700",
                };

                return (
                  <li
                    key={quote.id}
                    className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          Offerte #{String(quote.id).padStart(5, "0")}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor[quote.status] ?? "bg-slate-100 text-slate-700"}`}
                        >
                          {statusLabel[quote.status] ?? quote.status}
                        </span>
                      </div>
                      {(quote.pickup_address || quote.dropoff_address) && (
                        <p className="text-xs text-slate-600">
                          {quote.pickup_address ?? "?"} →{" "}
                          {quote.dropoff_address ?? "?"}
                        </p>
                      )}
                      {quote.travel_date && (
                        <p className="text-xs text-slate-500">
                          Reisdatum:{" "}
                          {new Date(
                            `${quote.travel_date}T00:00:00`,
                          ).toLocaleDateString("nl-BE")}
                        </p>
                      )}
                      {quote.total_price && (
                        <p className="text-sm font-semibold text-[#0043A8]">
                          Totaalprijs (excl. BTW): €{" "}
                          {parseFloat(quote.total_price)
                            .toFixed(2)
                            .replace(".", ",")}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          void downloadQuotePdf(quote);
                        }}
                        className="btn-outline px-3 py-1.5 text-xs"
                      >
                        PDF downloaden
                      </button>
                      {quote.status === "offerte_verstuurd" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedQuote(quote);
                            setQuoteSignatureName(currentUser?.name ?? "");
                            setQuoteSignatureMethod("draw");
                            setQuoteSignatureDate(todayAsInputDate());
                            setQuoteAcceptedTerms(false);
                            setQuoteError(null);
                            setQuoteHasDrawnSignature(false);
                            quoteSignatureCanvasRef.current?.clear();
                            setIsQuoteModalOpen(true);
                          }}
                          className="btn-primary px-3 py-1.5 text-xs"
                        >
                          Ondertekenen
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      {showNotificationPrompt && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={notificationPromptTitleId}
            aria-describedby={notificationPromptDescriptionId}
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          >
            <h2
              id={notificationPromptTitleId}
              className="text-2xl font-black text-slate-900"
            >
              Meldingen via e-mail
            </h2>
            <p
              id={notificationPromptDescriptionId}
              className="mt-2 text-sm text-slate-600"
            >
              Wil je meldingen ontvangen via e-mail? Deze keuze kan je later
              altijd aanpassen in je instellingen.
            </p>

            {notificationPromptError && (
              <div className="form-alert-error mt-4">
                {notificationPromptError}
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-end">
              <button
                ref={notificationDismissButtonRef}
                type="button"
                disabled={notificationPromptLoading}
                onClick={() => {
                  void handleNotificationPreferenceChoice(false);
                }}
                className="btn-outline"
              >
                Nee, liever niet
              </button>
              <button
                type="button"
                disabled={notificationPromptLoading}
                onClick={() => {
                  void handleNotificationPreferenceChoice(true);
                }}
                className="btn-primary"
              >
                {notificationPromptLoading ? "Opslaan..." : "Ja, graag"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isContractModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={contractModalTitleId}
            aria-describedby={contractModalDescriptionId}
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          >
            <h2
              id={contractModalTitleId}
              className="text-2xl font-black text-slate-900"
            >
              PVB-contact nakijken & ondertekenen
            </h2>
            <p
              id={contractModalDescriptionId}
              className="mt-1 text-sm text-slate-600"
            >
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
              <div className="flex flex-col gap-3 text-sm text-slate-700 sm:flex-row sm:flex-wrap sm:gap-4">
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
                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
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
                <div className="mt-2 grid grid-cols-1 gap-2 sm:flex sm:justify-end">
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

            <div className="mt-5 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-end">
              <button
                ref={contractCloseButtonRef}
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
      {isQuoteModalOpen && selectedQuote && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={quoteModalTitleId}
            aria-describedby={quoteModalDescriptionId}
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          >
            <h2
              id={quoteModalTitleId}
              className="text-2xl font-black text-slate-900"
            >
              Offerte ondertekenen
            </h2>
            <p
              id={quoteModalDescriptionId}
              className="mt-1 text-sm text-slate-600"
            >
              Offerte #{String(selectedQuote.id).padStart(5, "0")} · Controleer
              de details en onderteken indien akkoord.
            </p>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Offertedetails</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Traject: {selectedQuote.pickup_address ?? "-"} →{" "}
                  {selectedQuote.dropoff_address ?? "-"}
                </li>
                {selectedQuote.travel_date && (
                  <li>
                    Reisdatum:{" "}
                    {new Date(
                      `${selectedQuote.travel_date}T00:00:00`,
                    ).toLocaleDateString("nl-BE")}
                  </li>
                )}
                {selectedQuote.total_price && (
                  <li className="font-semibold text-[#0043A8]">
                    Totaalprijs (excl. BTW): €{" "}
                    {parseFloat(selectedQuote.total_price)
                      .toFixed(2)
                      .replace(".", ",")}
                  </li>
                )}
              </ul>
            </div>

            {quoteSignatureMethod === "name" ? (
              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-semibold text-primary">
                  Naam voor digitale handtekening
                </span>
                <input
                  value={quoteSignatureName}
                  onChange={(e) => setQuoteSignatureName(e.target.value)}
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
              <div className="flex flex-col gap-3 text-sm text-slate-700 sm:flex-row sm:flex-wrap sm:gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="quote_signature_method"
                    checked={quoteSignatureMethod === "draw"}
                    onChange={() => {
                      setQuoteSignatureMethod("draw");
                      setQuoteError(null);
                    }}
                    className="h-4 w-4 accent-[color:var(--accent)]"
                  />
                  Handtekening tekenen
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="quote_signature_method"
                    checked={quoteSignatureMethod === "name"}
                    onChange={() => {
                      setQuoteSignatureMethod("name");
                      setQuoteError(null);
                    }}
                    className="h-4 w-4 accent-[color:var(--accent)]"
                  />
                  Ondertekenen met naam
                </label>
              </div>
            </div>

            {quoteSignatureMethod === "draw" && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                <div className="mb-2 text-xs font-semibold text-primary">
                  Teken hier je handtekening
                </div>
                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
                  <SignatureCanvas
                    ref={quoteSignatureCanvasRef}
                    penColor="black"
                    onBegin={() => {
                      setQuoteHasDrawnSignature(true);
                      setQuoteError(null);
                    }}
                    canvasProps={{
                      width: 700,
                      height: 180,
                      className: "h-40 w-full rounded-md bg-white",
                    }}
                  />
                </div>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:flex sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      quoteSignatureCanvasRef.current?.clear();
                      setQuoteHasDrawnSignature(false);
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
                value={quoteSignatureDate}
                max={todayAsInputDate()}
                onChange={(e) => setQuoteSignatureDate(e.target.value)}
                className="h-11 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </label>

            <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={quoteAcceptedTerms}
                onChange={(e) => setQuoteAcceptedTerms(e.target.checked)}
                className="h-4 w-4 accent-[color:var(--accent)]"
              />
              Ik heb de offerte nagekeken en ga akkoord met het opgegeven bedrag
              en de voorwaarden.
            </label>

            {quoteError && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {quoteError}
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-end">
              <button
                ref={quoteCloseButtonRef}
                type="button"
                disabled={quoteLoading}
                onClick={() => setIsQuoteModalOpen(false)}
                className="btn-outline"
              >
                Sluiten
              </button>
              <button
                type="button"
                disabled={quoteLoading}
                onClick={() => {
                  void handleSignQuote();
                }}
                className="btn-primary"
              >
                {quoteLoading ? "Bezig..." : "Digitaal ondertekenen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
