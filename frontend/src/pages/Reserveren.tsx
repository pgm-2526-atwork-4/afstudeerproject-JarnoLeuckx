import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button";
import CalendarDateField from "../components/forms/CalendarDateField";
import ReservationAccountPrompt from "../components/reservation/ReservationAccountPrompt";
import { createCustomerRide } from "../lib/customer.api";
import { checkEmailExists, getCurrentUser } from "../auth/auth.api";

type FieldProps = {
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
};

function Field({
  label,
  type = "text",
  name,
  placeholder,
  defaultValue,
  required = false,
}: FieldProps) {
  return (
    <label className="block">
      <span className="form-label">
        {label}
        {required && <span className="form-required">*</span>}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="form-input"
      />
    </label>
  );
}

function calculatePrice(
  serviceType: "airport" | "wheelchair" | "medical" | "assistance",
  assistanceType: "" | "luchthaven" | "ziekenhuis",
) {
  const basePrice =
    serviceType === "airport"
      ? 55
      : serviceType === "wheelchair"
        ? 60
        : serviceType === "medical"
          ? 50
          : 65;

  const assistanceExtra =
    assistanceType === "luchthaven"
      ? 15
      : assistanceType === "ziekenhuis"
        ? 10
        : 0;

  return basePrice + assistanceExtra;
}

const POSTCODE_REGEX = /^[0-9]{4}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function todayAsInputDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function ReserverenPage() {
  const [searchParams] = useSearchParams();
  const currentUser = getCurrentUser();
  const fullName = currentUser?.name?.trim() ?? "";
  const [defaultFirstName, ...lastNameParts] = fullName.split(/\s+/);
  const defaultLastName = lastNameParts.join(" ");
  const defaultEmail = currentUser?.email ?? "";
  const defaultPhone = currentUser?.phone ?? "";
  const [contactEmail, setContactEmail] = useState(defaultEmail);

  const initialServiceType = searchParams.get("service");
  const initialAssistanceType = searchParams.get("assistanceType");
  const [hasAssistance, setHasAssistance] = useState(
    initialAssistanceType === "luchthaven" ||
      initialAssistanceType === "ziekenhuis",
  );
  const [assistentieType, setAssistentieType] = useState<
    "" | "luchthaven" | "ziekenhuis"
  >(
    initialAssistanceType === "luchthaven" ||
      initialAssistanceType === "ziekenhuis"
      ? initialAssistanceType
      : "",
  );
  const [serviceType, setServiceType] = useState<
    "airport" | "wheelchair" | "medical" | "assistance"
  >(
    initialServiceType === "airport" ||
      initialServiceType === "wheelchair" ||
      initialServiceType === "medical" ||
      initialServiceType === "assistance"
      ? initialServiceType
      : "airport",
  );

  const [pickupStreet, setPickupStreet] = useState("");
  const [pickupNumber, setPickupNumber] = useState("");
  const [pickupPostcode, setPickupPostcode] = useState("");
  const [pickupCity, setPickupCity] = useState("");

  const [dropoffStreet, setDropoffStreet] = useState("");
  const [dropoffNumber, setDropoffNumber] = useState("");
  const [dropoffPostcode, setDropoffPostcode] = useState("");
  const [dropoffCity, setDropoffCity] = useState("");

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [hasReturnTrip, setHasReturnTrip] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [accountPrompt, setAccountPrompt] = useState<
    null | "register" | "login"
  >(null);

  const price = calculatePrice(
    serviceType,
    hasAssistance ? assistentieType : "",
  );

  const pickupDatetime =
    pickupDate && pickupTime ? `${pickupDate}T${pickupTime}` : "";
  const returnDatetime =
    returnDate && returnTime ? `${returnDate}T${returnTime}` : "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setAccountPrompt(null);

    const cleanEmail = contactEmail.trim();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError("Geef een geldig e-mailadres in.");
      return;
    }

    if (!POSTCODE_REGEX.test(pickupPostcode.trim())) {
      setError("Vertrek postcode moet uit 4 cijfers bestaan.");
      return;
    }

    if (!POSTCODE_REGEX.test(dropoffPostcode.trim())) {
      setError("Bestemming postcode moet uit 4 cijfers bestaan.");
      return;
    }

    if (hasAssistance && !assistentieType) {
      setError("Kies een type assistentie of vink assistentie uit.");
      return;
    }

    if (!pickupDatetime) {
      setError("Kies een geldige datum en tijd voor de heenrit.");
      return;
    }

    const pickupAt = new Date(pickupDatetime);
    if (Number.isNaN(pickupAt.getTime()) || pickupAt < new Date()) {
      setError("Heenrit datum en tijd moet in de toekomst liggen.");
      return;
    }

    if (hasReturnTrip) {
      if (!returnDatetime) {
        setError("Kies een datum en tijd voor de terugrit.");
        return;
      }

      const returnAt = new Date(returnDatetime);
      if (Number.isNaN(returnAt.getTime()) || returnAt <= pickupAt) {
        setError("Terugrit moet na de heenrit liggen.");
        return;
      }
    }

    if (!currentUser) {
      try {
        const result = await checkEmailExists(cleanEmail);

        if (result.exists) {
          setAccountPrompt("login");
        } else {
          setAccountPrompt("register");
        }
      } catch {
        setError("E-mailadres controleren mislukt. Probeer opnieuw.");
      }

      return;
    }

    setAccountPrompt(null);
    setLoading(true);

    try {
      const result = await createCustomerRide({
        service_type: serviceType,
        pickup_street: pickupStreet,
        pickup_number: pickupNumber || undefined,
        pickup_postcode: pickupPostcode,
        pickup_city: pickupCity,
        dropoff_street: dropoffStreet,
        dropoff_number: dropoffNumber || undefined,
        dropoff_postcode: dropoffPostcode,
        dropoff_city: dropoffCity,
        pickup_datetime: pickupDatetime,
        has_return_trip: hasReturnTrip,
        return_datetime: hasReturnTrip ? returnDatetime : undefined,
        notes: notes || undefined,
        assistance_type:
          hasAssistance && assistentieType !== "" ? assistentieType : undefined,
      });

      setSuccess(`${result.message} Geschatte prijs: €${price.toFixed(2)}`);
      setPickupStreet("");
      setPickupNumber("");
      setPickupPostcode("");
      setPickupCity("");
      setDropoffStreet("");
      setDropoffNumber("");
      setDropoffPostcode("");
      setDropoffCity("");
      setPickupDate("");
      setPickupTime("");
      setHasReturnTrip(false);
      setReturnDate("");
      setReturnTime("");
      setNotes("");
      setHasAssistance(false);
      setAssistentieType("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Rit aanvragen mislukt.";
      if (message.includes("Unauthenticated")) {
        setError("Log eerst in als klant om een rit aan te vragen.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-modern">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="surface-card-strong p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Vraag een rit aan
          </h2>

          <form className="form-layout" onSubmit={handleSubmit}>
            <p className="text-sm text-slate-600">
              Velden met <span className="form-required">*</span> zijn
              verplicht.
            </p>

            {error && (
              <div role="alert" className="form-alert-error">
                {error}
              </div>
            )}

            {success && (
              <div role="status" className="form-alert-success">
                {success}
              </div>
            )}

            <label className="block">
              <span className="form-label">
                Dienst
                <span className="form-required">*</span>
              </span>
              <select
                value={serviceType}
                onChange={(e) =>
                  setServiceType(
                    e.target.value as
                      | "airport"
                      | "wheelchair"
                      | "medical"
                      | "assistance",
                  )
                }
                className="form-select"
              >
                <option value="airport">Luchthaven vervoer</option>
                <option value="wheelchair">Rolstoel vervoer</option>
                <option value="medical">Medische rit</option>
                <option value="assistance">Assistentie</option>
              </select>
            </label>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Field
                label="Voornaam"
                name="voornaam"
                placeholder="Uw voornaam"
                defaultValue={defaultFirstName || ""}
                required
              />
              <Field
                label="Naam"
                name="naam"
                placeholder="Uw familienaam"
                defaultValue={defaultLastName || defaultFirstName || ""}
                required
              />
              <label className="block">
                <span className="form-label">
                  E-mail<span className="form-required">*</span>
                </span>
                <input
                  type="email"
                  name="email"
                  value={contactEmail}
                  onChange={(event) => setContactEmail(event.target.value)}
                  placeholder="naam@email.com"
                  required
                  className="form-input"
                />
              </label>
              <Field
                label="Telefoonnummer"
                name="telefoon"
                placeholder="+32 ..."
                defaultValue={defaultPhone}
                required
              />
            </div>

            <div className="form-section">
              <p className="form-section-title">Vertrek adres</p>
              <p className="form-section-subtitle">
                Vul de ophaallocatie zo volledig mogelijk in.
              </p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="form-label">
                    Straat + nummer<span className="form-required">*</span>
                  </span>
                  <input
                    value={pickupStreet}
                    onChange={(e) => setPickupStreet(e.target.value)}
                    required
                    className="form-input"
                  />
                </label>
                <label className="block">
                  <span className="form-label">
                    Postcode<span className="form-required">*</span>
                  </span>
                  <input
                    value={pickupPostcode}
                    onChange={(e) => setPickupPostcode(e.target.value)}
                    required
                    className="form-input"
                  />
                </label>
                <label className="block">
                  <span className="form-label">
                    Gemeente<span className="form-required">*</span>
                  </span>
                  <input
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    required
                    className="form-input"
                  />
                </label>
                <div className="md:col-span-2">
                  <Field
                    label="Extra info (optioneel)"
                    name="extra_info"
                    placeholder="Bijv. bel aan bij..."
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <p className="form-section-title">Assistentie</p>
              <p className="form-section-subtitle">
                Vink dit aan als je extra begeleiding nodig hebt tijdens je rit.
              </p>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <label className="flex items-center gap-3 text-sm text-slate-800 cursor-pointer select-none">
                  <input
                    id="assistance-needed"
                    type="checkbox"
                    checked={hasAssistance}
                    onChange={(e) => {
                      setHasAssistance(e.target.checked);
                      if (!e.target.checked) {
                        setAssistentieType("");
                      }
                    }}
                    className="form-checkbox"
                  />
                  Ik heb assistentie nodig tijdens deze rit
                </label>
              </div>

              <div
                className={[
                  "mt-5 overflow-hidden rounded-xl border border-secondary/20 bg-secondary/5",
                  "transition-all duration-300 ease-out",
                  hasAssistance
                    ? "max-h-[520px] opacity-100"
                    : "max-h-0 opacity-0 border-transparent",
                ].join(" ")}
                aria-hidden={!hasAssistance}
              >
                <div className="p-5">
                  <p className="text-sm font-semibold text-primary mb-3">
                    Type assistentie
                  </p>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setAssistentieType("luchthaven")}
                      className={[
                        "rounded-lg border px-4 py-3 text-left text-sm transition",
                        assistentieType === "luchthaven"
                          ? "border-primary bg-white shadow-sm"
                          : "border-secondary/20 bg-white/60 hover:bg-white",
                      ].join(" ")}
                    >
                      <span className="block font-semibold text-primary">
                        Assistentie op luchthaven
                      </span>
                      <span className="block text-gray-700">
                        Hulp bij check-in, bagage en begeleiding naar de gate.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAssistentieType("ziekenhuis")}
                      className={[
                        "rounded-lg border px-4 py-3 text-left text-sm transition",
                        assistentieType === "ziekenhuis"
                          ? "border-primary bg-white shadow-sm"
                          : "border-secondary/20 bg-white/60 hover:bg-white",
                      ].join(" ")}
                    >
                      <span className="block font-semibold text-primary">
                        Assistentie voor afspraak
                      </span>
                      <span className="block text-gray-700">
                        Begeleiding naar afdeling en hulp ter plaatse.
                      </span>
                    </button>
                  </div>

                  <label className="block mt-5">
                    <span className="form-label">
                      Extra details (optioneel)
                    </span>
                    <textarea
                      name="assistentie_details"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Bijv. hulp bij instappen, rolstoel meenemen, bagage..."
                      className="form-textarea"
                    />
                  </label>

                  <div className="mt-4 rounded-lg bg-white/70 p-4 text-sm text-gray-800 border border-secondary/20">
                    {assistentieType === "luchthaven" ? (
                      <>
                        <span className="font-semibold text-primary">
                          Luchthaven assistentie:
                        </span>{" "}
                        Onze chauffeur helpt u bij het in- en uitstappen,
                        ondersteunt met bagage en begeleidt u waar nodig.
                      </>
                    ) : assistentieType === "ziekenhuis" ? (
                      <>
                        <span className="font-semibold text-primary">
                          Afspraak assistentie:
                        </span>{" "}
                        Onze chauffeur kan u begeleiden naar de juiste afdeling
                        en veilig terug naar huis brengen.
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-primary">Tip:</span>{" "}
                        Kies een type assistentie zodat we u zo goed mogelijk
                        kunnen helpen.
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <p className="form-section-title">Bestemming</p>
              <p className="form-section-subtitle">
                Vul het afleveradres in waar de rit moet eindigen.
              </p>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="block md:col-span-2">
                  <span className="form-label">
                    Straat + nummer<span className="form-required">*</span>
                  </span>
                  <input
                    value={dropoffStreet}
                    onChange={(e) => setDropoffStreet(e.target.value)}
                    required
                    className="form-input"
                  />
                </label>
                <label className="block">
                  <span className="form-label">
                    Postcode<span className="form-required">*</span>
                  </span>
                  <input
                    value={dropoffPostcode}
                    onChange={(e) => setDropoffPostcode(e.target.value)}
                    required
                    className="form-input"
                  />
                </label>
                <label className="block">
                  <span className="form-label">
                    Gemeente<span className="form-required">*</span>
                  </span>
                  <input
                    value={dropoffCity}
                    onChange={(e) => setDropoffCity(e.target.value)}
                    required
                    className="form-input"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="form-label block mb-1"
                    htmlFor="heenrit-datum-picker"
                  >
                    Heenrit datum <span className="form-required">*</span>
                  </label>
                  <input
                    id="heenrit-datum-picker"
                    type="date"
                    className="form-input"
                    min={todayAsInputDate()}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    className="form-label block mb-1"
                    htmlFor="heenrit-tijd-picker"
                  >
                    Heenrit uur <span className="form-required">*</span>
                  </label>
                  <input
                    id="heenrit-tijd-picker"
                    type="time"
                    className="form-input"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <label className="block mt-6">
                <span className="mb-2 block text-xs font-semibold text-primary">
                  Terugrit gewenst?
                </span>
                <div className="mt-2 flex items-center gap-2 text-sm text-primary">
                  <input
                    id="has-return-trip"
                    type="checkbox"
                    checked={hasReturnTrip}
                    onChange={(e) => {
                      setHasReturnTrip(e.target.checked);
                      if (!e.target.checked) {
                        setReturnDate("");
                        setReturnTime("");
                      }
                    }}
                    className="form-checkbox"
                  />
                  <label htmlFor="has-return-trip">
                    Ja, ik wil ook een terugrit
                  </label>
                </div>
              </label>
            </div>

            {hasReturnTrip && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label
                    className="form-label block mb-1"
                    htmlFor="terugrit-datum-picker"
                  >
                    Terugrit datum <span className="form-required">*</span>
                  </label>
                  <input
                    id="terugrit-datum-picker"
                    type="date"
                    className="form-input"
                    min={pickupDate || todayAsInputDate()}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required={hasReturnTrip}
                  />
                </div>
                <div>
                  <label
                    className="form-label block mb-1"
                    htmlFor="terugrit-tijd-picker"
                  >
                    Terugrit uur <span className="form-required">*</span>
                  </label>
                  <input
                    id="terugrit-tijd-picker"
                    type="time"
                    className="form-input"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    required={hasReturnTrip}
                  />
                </div>
              </div>
            )}

            <div className="rounded-xl border border-[#d6e6ff] bg-[#edf4ff] px-4 py-3">
              <p className="text-sm text-slate-900 font-semibold">
                Geschatte prijs
              </p>
              <p className="text-2xl font-black text-slate-900">
                €{price.toFixed(2)}
              </p>
              <p className="text-xs text-slate-600">
                Hardcoded prijs (tijdelijk).
              </p>
            </div>

            <Button className="w-64" disabled={loading}>
              {loading ? "Bezig..." : "Rit aanvragen"}
            </Button>
          </form>
        </div>
      </div>

      {accountPrompt && (
        <ReservationAccountPrompt
          mode={accountPrompt}
          onClose={() => setAccountPrompt(null)}
        />
      )}
    </div>
  );
}
