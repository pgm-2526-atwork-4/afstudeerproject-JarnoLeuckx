import { useState, type ComponentType, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import CalendarDateField from "../components/forms/CalendarDateField";
import ReservationAccountPrompt from "../components/reservation/ReservationAccountPrompt";
import ReservationFormSection from "../components/reservation/ReservationFormSection";
import { checkEmailExists, getCurrentUser } from "../auth/auth.api";
import { Plane, Clock3, Luggage, ShieldCheck, MapPin } from "lucide-react";

type AirportCard = {
  code: string;
  name: string;
  description: string;
};

type JourneyStep = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

type Feature = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const FEATURES: Feature[] = [
  {
    icon: Plane,
    title: "Stipt vertrek",
    description:
      "We plannen uw rit ruim op tijd zodat u zonder stress aan uw reis begint.",
  },
  {
    icon: Luggage,
    title: "Hulp met bagage",
    description:
      "Onze chauffeur ondersteunt waar nodig bij koffers, inladen en uitstappen.",
  },
  {
    icon: ShieldCheck,
    title: "Comfortabele begeleiding",
    description:
      "Rustige, veilige transfers met aandacht voor uw timing en comfort.",
  },
];

const AIRPORTS: AirportCard[] = [
  {
    code: "BRU",
    name: "Brussels Airport",
    description:
      "Voor internationale vluchten, family drop-offs en assistentie aan de vertrekhal.",
  },
  {
    code: "CRL",
    name: "Charleroi Airport",
    description:
      "Extra comfortabel voor vroege of late vluchten zonder overstappen onderweg.",
  },
  {
    code: "ANR",
    name: "Antwerp Airport",
    description:
      "Ideaal voor korte transfers en persoonlijke begeleiding van deur tot terminal.",
  },
];

const JOURNEY_STEPS: JourneyStep[] = [
  {
    title: "We plannen ruim op tijd",
    description:
      "We vertrekken met voldoende marge zodat files, bagage en check-in geen stressmoment worden.",
    icon: Clock3,
  },
  {
    title: "Bagage en instap worden ondersteund",
    description:
      "Indien gewenst helpt de chauffeur met koffers, rolwagens en het veilig in- en uitstappen.",
    icon: Luggage,
  },
  {
    title: "Veilig tot aan de terminal",
    description:
      "U wordt afgezet op een praktische locatie dicht bij de juiste ingang of ophaalzone.",
    icon: ShieldCheck,
  },
];

export function Luchthavenvervoer() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [assistentie, setAssistentie] = useState<"nee" | "ja">("nee");
  const [assistentieType, setAssistentieType] = useState<"" | "bagage">("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnTripDate, setReturnTripDate] = useState("");
  const [accountPrompt, setAccountPrompt] = useState<
    null | "login" | "register"
  >(null);
  const [formError, setFormError] = useState<string | null>(null);

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  function buildReservationPath() {
    return "/reserveren?service=airport";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setAccountPrompt(null);

    if (currentUser?.role === "customer") {
      navigate(buildReservationPath());
      return;
    }

    if (currentUser) {
      setFormError("Alleen klanten kunnen een reservatie aanvragen.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      setFormError("Geef eerst een e-mailadres in.");
      return;
    }

    try {
      const result = await checkEmailExists(email);
      setAccountPrompt(result.exists ? "login" : "register");
    } catch {
      setFormError("E-mailadres controleren mislukt. Probeer opnieuw.");
    }
  }

  return (
    <div className="page-modern">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-12 text-center">
          <div className="brand-badge mx-auto mb-4 h-16 w-16 shadow-sm">
            <Plane className="h-9 w-9 text-[#0043A8]" />
          </div>

          <h1 className="section-title mb-4">Luchthavenvervoer</h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Comfortabel en stipt vervoer van en naar de luchthaven, met extra
            begeleiding waar nodig en een rustige start van uw reis.
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-3 md:gap-8">
          {FEATURES.map((feature) => {
            return (
              <div
                key={feature.title}
                className="surface-card-strong p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg md:p-8"
              >
                <div className="brand-badge mx-auto mb-5 h-14 w-14 shadow-sm">
                  <feature.icon className="h-7 w-7 text-[#0043A8]" />
                </div>

                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="surface-card-strong mb-8 p-6 md:p-8">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                Zo verloopt uw luchthavenrit
              </h2>

              <ul className="space-y-5">
                {JOURNEY_STEPS.map((step) => (
                  <li key={step.title} className="flex items-start gap-3">
                    <step.icon className="mt-1 h-5 w-5 flex-shrink-0 text-[#0043A8]" />
                    <p className="leading-relaxed text-slate-700">
                      <span className="font-semibold text-slate-900">
                        {step.title}:
                      </span>{" "}
                      {step.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-card border-[#d6e6ff] bg-[#edf4ff] p-6 md:p-8">
              <h3 className="mb-4 text-xl font-semibold text-slate-900">
                Handig om te weten
              </h3>

              <ul className="space-y-3 text-slate-700">
                <li>• Liefst minstens 24 uur op voorhand reserveren</li>
                <li>• Ook vroege en late vluchten zijn mogelijk</li>
                <li>• Hulp met bagage kan voorzien worden indien nodig</li>
                <li>• Vertrek en terugreis kunnen samen ingepland worden</li>
              </ul>
            </div>

            <div className="surface-card-strong mt-8 p-6 md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#0043A8]">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Vaak gekozen luchthavens
                  </h2>
                  <p className="text-sm text-slate-600">
                    We verzorgen ritten naar meerdere vertrek- en
                    aankomstlocaties.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {AIRPORTS.map((airport) => (
                  <div
                    key={airport.code}
                    className="surface-card rounded-3xl p-6 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-bold text-slate-900">
                        {airport.name}
                      </h3>
                      <span className="rounded-full bg-[#edf4ff] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#0043A8]">
                        {airport.code}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-slate-600">
                      {airport.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="surface-card-strong p-6 md:p-8">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Boek uw rit
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {formError && <div className="form-alert-error">{formError}</div>}

              <ReservationFormSection
                step={1}
                title="Contactgegevens"
                description="Vul uw basisgegevens in zodat we uw aanvraag correct kunnen verwerken."
                defaultOpen
              >
                <Input
                  id="naam"
                  label="Volledige naam"
                  type="text"
                  placeholder="Uw naam"
                />

                <Input
                  id="email"
                  name="email"
                  label="E-mailadres"
                  type="email"
                  placeholder="naam@email.com"
                  required
                />

                <Input
                  id="telefoon"
                  label="Telefoonnummer"
                  type="tel"
                  placeholder="+32 000 00 00 00"
                />
              </ReservationFormSection>

              <ReservationFormSection
                step={2}
                title="Vertrekgegevens"
                description="Kies de luchthaven en vul het ophaaladres duidelijk in."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    id="heen-straat"
                    label="Straat & nummer"
                    type="text"
                    placeholder="Straat en huisnummer"
                  />
                  <Input
                    id="heen-postcode"
                    label="Postcode"
                    type="text"
                    placeholder="1234 AB"
                  />
                  <Input
                    id="heen-stad"
                    label="Stad/gemeente"
                    type="text"
                    placeholder="Stad of gemeente"
                  />
                  <Input
                    id="heen-land"
                    label="Land"
                    type="text"
                    placeholder="Land"
                  />
                </div>
              </ReservationFormSection>

              <ReservationFormSection
                step={3}
                title="Planning"
                description="Duid je vertrekmoment aan en voeg optioneel meteen de terugreis toe."
              >
                <div className="space-y-4">
                  <CalendarDateField
                    id="vertrekdatum"
                    label="Datum"
                    value={departureDate}
                    onChange={setDepartureDate}
                    minDate={minDate}
                  />
                  <Input id="vertrektijd" label="Tijd" type="time" />
                </div>

                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isRoundTrip}
                    onChange={(e) => setIsRoundTrip(e.target.checked)}
                    className="h-5 w-5 rounded accent-[var(--accent)]"
                  />
                  <span className="font-medium text-primary">
                    Dit is een heen- en terugreis
                  </span>
                </label>

                <div
                  className={[
                    "mt-5 overflow-hidden rounded-xl border border-secondary/20 bg-secondary/5",
                    "transition-all duration-300 ease-out",
                    isRoundTrip
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 border-transparent opacity-0",
                  ].join(" ")}
                  aria-hidden={!isRoundTrip}
                >
                  <div className="p-5">
                    <p className="mb-4 text-sm font-semibold text-primary">
                      Terugreis details
                    </p>

                    <label
                      className="form-label mb-1 block"
                      htmlFor="terugreisdatum-picker"
                    >
                      Terugreis datum <span className="form-required">*</span>
                    </label>
                    <input
                      id="terugreisdatum-picker"
                      type="date"
                      className="form-input"
                      min={departureDate || minDate}
                      value={returnTripDate}
                      onChange={(e) => setReturnTripDate(e.target.value)}
                      required={isRoundTrip}
                    />

                    <div className="mt-4 space-y-4">
                      <Input
                        id="terugstraat"
                        label="Straat & nummer (terug)"
                        type="text"
                        placeholder="Straat, huisnummer"
                      />
                      <Input
                        id="terugpostcode"
                        label="Postcode (terug)"
                        type="text"
                        placeholder="1234 AB"
                      />
                    </div>

                    <Input
                      id="terugstad"
                      label="Stad (terug)"
                      type="text"
                      placeholder="Uw stadsbestemming"
                    />
                  </div>
                </div>
              </ReservationFormSection>

              <ReservationFormSection
                step={4}
                title="Extra ondersteuning"
                description="Voeg bijkomende info toe en geef aan of assistentie nodig is."
              >
                <div className="rounded-xl border border-[#d6e6ff] bg-[#edf4ff] p-4">
                  <h4 className="mb-2 font-semibold text-slate-900">
                    Ritinformatie
                  </h4>
                  <p className="text-sm text-slate-700">
                    Afstand en prijs kunnen later automatisch berekend worden.
                  </p>
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-primary">
                    Bijzonderheden (optioneel)
                  </span>
                  <textarea
                    id="opmerkingen"
                    name="opmerkingen"
                    placeholder="Bijv. vluchtinformatie, bagage, speciale wensen..."
                    className="min-h-[110px] w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 py-2 outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-accent"
                  />
                </label>

                <p className="mb-4 text-xs font-semibold text-primary">
                  Assistentie nodig?
                </p>

                <div className="flex flex-wrap gap-6">
                  <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-primary">
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

                  <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-primary">
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

                <div
                  className={[
                    "mt-5 overflow-hidden rounded-xl border border-secondary/20 bg-secondary/5",
                    "transition-all duration-300 ease-out",
                    assistentie === "ja"
                      ? "max-h-[320px] opacity-100"
                      : "max-h-0 border-transparent opacity-0",
                  ].join(" ")}
                  aria-hidden={assistentie !== "ja"}
                >
                  <div className="p-5">
                    <p className="mb-3 text-sm font-semibold text-primary">
                      Type assistentie
                    </p>

                    <button
                      type="button"
                      onClick={() => setAssistentieType("bagage")}
                      className={[
                        "w-full rounded-xl border px-4 py-3 text-left text-sm transition",
                        assistentieType === "bagage"
                          ? "border-[#0043A8] bg-[#EAF3FF] shadow-sm"
                          : "border-slate-300 bg-white hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <span className="block font-semibold text-slate-900">
                        Hulp met bagage
                      </span>
                      <span className="block text-slate-600">
                        Ondersteuning bij laden en uit-/instappen.
                      </span>
                    </button>

                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                      {assistentieType === "bagage" ? (
                        <>
                          <span className="font-semibold text-slate-900">
                            Bagage assistentie:
                          </span>{" "}
                          Onze chauffeur helpt u met in- en uitstappen en
                          ondersteunt u met uw bagage.
                        </>
                      ) : (
                        <>
                          <span className="font-semibold text-slate-900">
                            Tip:
                          </span>{" "}
                          Selecteer het gewenste type assistentie.
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </ReservationFormSection>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Button variant="primary" className="w-full" type="submit">
                  Boek nu
                </Button>

                <Button variant="outline" className="w-full" type="button">
                  Offerte aanvragen
                </Button>
              </div>
            </form>

            {accountPrompt && (
              <ReservationAccountPrompt
                mode={accountPrompt}
                onClose={() => setAccountPrompt(null)}
                loginTo={`/login?redirect=${encodeURIComponent(buildReservationPath())}`}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
