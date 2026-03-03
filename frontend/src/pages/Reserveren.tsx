import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { createCustomerRide } from "../lib/customer.api";
import { getCurrentUser } from "../auth/auth.api";

type FieldProps = {
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
  defaultValue?: string;
};

function Field({
  label,
  type = "text",
  name,
  placeholder,
  defaultValue,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-primary">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
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

export default function ReserverenPage() {
  const currentUser = getCurrentUser();
  const fullName = currentUser?.name?.trim() ?? "";
  const [defaultFirstName, ...lastNameParts] = fullName.split(/\s+/);
  const defaultLastName = lastNameParts.join(" ");
  const defaultEmail = currentUser?.email ?? "";
  const defaultPhone = currentUser?.phone ?? "";

  const [assistentie, setAssistentie] = useState<"nee" | "ja">("nee");
  const [assistentieType, setAssistentieType] = useState<
    "" | "luchthaven" | "ziekenhuis"
  >("");
  const [serviceType, setServiceType] = useState<
    "airport" | "wheelchair" | "medical" | "assistance"
  >("airport");

  const [pickupStreet, setPickupStreet] = useState("");
  const [pickupNumber, setPickupNumber] = useState("");
  const [pickupPostcode, setPickupPostcode] = useState("");
  const [pickupCity, setPickupCity] = useState("");

  const [dropoffStreet, setDropoffStreet] = useState("");
  const [dropoffNumber, setDropoffNumber] = useState("");
  const [dropoffPostcode, setDropoffPostcode] = useState("");
  const [dropoffCity, setDropoffCity] = useState("");

  const [pickupDatetime, setPickupDatetime] = useState("");
  const [hasReturnTrip, setHasReturnTrip] = useState(false);
  const [returnDatetime, setReturnDatetime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);

  const price = calculatePrice(
    serviceType,
    assistentie === "ja" ? assistentieType : "",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentUser) {
      setShowAccountPrompt(true);
      return;
    }

    setShowAccountPrompt(false);
    setLoading(true);

    try {
      await createCustomerRide({
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
          assistentie === "ja" && assistentieType !== ""
            ? assistentieType
            : undefined,
      });

      setSuccess(`Rit aangevraagd. Geschatte prijs: €${price.toFixed(2)}`);
      setPickupStreet("");
      setPickupNumber("");
      setPickupPostcode("");
      setPickupCity("");
      setDropoffStreet("");
      setDropoffNumber("");
      setDropoffPostcode("");
      setDropoffCity("");
      setPickupDatetime("");
      setHasReturnTrip(false);
      setReturnDatetime("");
      setNotes("");
      setAssistentie("nee");
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
    <div className="min-h-screen bg-gradient-to-b from-[#FFEAC2] via-[#FFFFFF] to-[#E8F4FF]">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-10 text-center text-3xl font-bold text-primary">
          vraag uw vervoer aan
        </h1>

        <form
          className="space-y-10 bg-white/95 rounded-3xl p-8 shadow-lg border border-primary/10"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800">
              {success}
            </div>
          )}

          {showAccountPrompt && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p>Dit lijkt je eerste rit. Wil je een account aanmaken?</p>
              <div className="mt-2">
                <Link
                  to="/auth"
                  className="font-semibold underline underline-offset-2"
                >
                  Ja, account aanmaken
                </Link>
              </div>
            </div>
          )}

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-primary">
              Dienst
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
              className="h-11 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
            />
            <Field
              label="Naam"
              name="naam"
              placeholder="Uw familienaam"
              defaultValue={defaultLastName || defaultFirstName || ""}
            />
            <Field
              label="E-mail"
              type="email"
              name="email"
              placeholder="naam@email.com"
              defaultValue={defaultEmail}
            />
            <Field
              label="Telefoonnummer"
              name="telefoon"
              placeholder="+32 ..."
              defaultValue={defaultPhone}
            />
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold text-primary">
              Vertrek adres
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-xs font-semibold text-primary">
                  Straat + nummer
                </span>
                <input
                  value={pickupStreet}
                  onChange={(e) => setPickupStreet(e.target.value)}
                  required
                  className="h-11 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-primary">
                  Postcode
                </span>
                <input
                  value={pickupPostcode}
                  onChange={(e) => setPickupPostcode(e.target.value)}
                  required
                  className="h-11 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-primary">
                  Gemeente
                </span>
                <input
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  required
                  className="h-11 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
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

          {/* Assistentie */}
          <div>
            <p className="mb-4 text-xs font-semibold text-primary">
              Assistentie
            </p>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm text-primary cursor-pointer select-none">
                <input
                  type="radio"
                  name="assistentie"
                  value="nee"
                  checked={assistentie === "nee"}
                  onChange={() => {
                    setAssistentie("nee");
                    setAssistentieType("");
                  }}
                  className="accent-[color:var(--accent)]"
                />
                Nee
              </label>

              <label className="flex items-center gap-2 text-sm text-primary cursor-pointer select-none">
                <input
                  type="radio"
                  name="assistentie"
                  value="ja"
                  checked={assistentie === "ja"}
                  onChange={() => setAssistentie("ja")}
                  className="accent-[color:var(--accent)]"
                />
                Ja
              </label>
            </div>

            {/* Animated panel */}
            <div
              className={[
                "mt-5 overflow-hidden rounded-xl border border-secondary/20 bg-secondary/5",
                "transition-all duration-300 ease-out",
                assistentie === "ja"
                  ? "max-h-[520px] opacity-100"
                  : "max-h-0 opacity-0 border-transparent",
              ].join(" ")}
              aria-hidden={assistentie !== "ja"}
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
                  <span className="mb-2 block text-xs font-semibold text-primary">
                    Extra details (optioneel)
                  </span>
                  <textarea
                    name="assistentie_details"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Bijv. hulp bij instappen, rolstoel meenemen, bagage..."
                    className="min-h-[110px] w-full rounded-lg border border-secondary/20 bg-white/70 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
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
                      Onze chauffeur kan u begeleiden naar de juiste afdeling en
                      veilig terug naar huis brengen.
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

          <div>
            <p className="mb-4 text-xs font-semibold text-primary">
              Bestemming
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-xs font-semibold text-primary">
                  Straat + nummer
                </span>
                <input
                  value={dropoffStreet}
                  onChange={(e) => setDropoffStreet(e.target.value)}
                  required
                  className="h-11 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-primary">
                  Postcode
                </span>
                <input
                  value={dropoffPostcode}
                  onChange={(e) => setDropoffPostcode(e.target.value)}
                  required
                  className="h-11 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-primary">
                  Gemeente
                </span>
                <input
                  value={dropoffCity}
                  onChange={(e) => setDropoffCity(e.target.value)}
                  required
                  className="h-11 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-primary">
                Heenrit datum & uur
              </span>
              <input
                type="datetime-local"
                value={pickupDatetime}
                onChange={(e) => setPickupDatetime(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
              />
            </label>

            <label className="block">
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
                      setReturnDatetime("");
                    }
                  }}
                  className="h-4 w-4 accent-[color:var(--accent)]"
                />
                <label htmlFor="has-return-trip">
                  Ja, ik wil ook een terugrit
                </label>
              </div>
            </label>
          </div>

          {hasReturnTrip && (
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-primary">
                Terugrit datum & uur
              </span>
              <input
                type="datetime-local"
                value={returnDatetime}
                onChange={(e) => setReturnDatetime(e.target.value)}
                required={hasReturnTrip}
                className="h-11 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
              />
            </label>
          )}

          <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-sm text-primary font-semibold">
              Geschatte prijs
            </p>
            <p className="text-2xl font-black text-primary">
              €{price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-600">
              Hardcoded prijs (tijdelijk).
            </p>
          </div>

          <Button className="w-64" disabled={loading}>
            {loading ? "Bezig..." : "Rit aanvragen"}
          </Button>
        </form>
      </div>
    </div>
  );
}
