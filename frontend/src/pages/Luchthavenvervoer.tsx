import {
  useState,
  type ComponentType,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import CalendarDateField from "../components/forms/CalendarDateField";
import ReservationAccountPrompt from "../components/reservation/ReservationAccountPrompt";
import ReservationFormSection from "../components/reservation/ReservationFormSection";
import { checkEmailExists, getCurrentUser } from "../auth/auth.api";
import {
  Plane,
  Check,
  Clock3,
  Luggage,
  ShieldCheck,
  MapPin,
} from "lucide-react";

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

export function LuchthavenVervoer() {
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
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const features: string[] = [
    "Op tijd voor uw vlucht",
    "Directe rit zonder stops",
    "Hulp met bagage",
    "Comfortabele voertuigen",
    "Ervaren chauffeurs",
    "24/7 beschikbaar",
  ];

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
    <div className="page-modern bg-[#f7faff] min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
        <div className="mb-16 text-center">
          <div className="brand-badge mx-auto mb-4 h-16 w-16 shadow-sm">
            <Plane className="h-9 w-9 text-[#0043A8]" />
          </div>

          <h1 className="section-title mb-4">Luchthavenvervoer</h1>

          <p className="mx-auto max-w-3xl text-lg text-slate-600">
            Comfortabel en stipt vervoer van en naar de luchthaven, met extra
            aandacht voor rust, begeleiding en een vlotte start van uw reis.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3 xl:gap-16">
          <div className="lg:col-span-2 grid gap-12 lg:grid-cols-2 xl:gap-16">
            <div>
              <div className="surface-card-strong mb-10 p-8 md:p-10 shadow-md rounded-3xl">
                <h2 className="mb-6 text-2xl font-bold text-slate-900">
                  Waarom kiezen voor ons?
                </h2>

                <div className="grid gap-3">
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#edf4ff] text-[#0043A8]">
                        <Check className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-card border-[#d6e6ff] bg-[#edf4ff] p-6 md:p-8 rounded-3xl shadow-sm">
                <h3 className="mb-4 text-xl font-semibold text-slate-900">
                  Inbegrepen in uw transfer
                </h3>

                <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                  <p>
                    Uw rit wordt zorgvuldig gepland zodat u ontspannen en op
                    tijd op de luchthaven aankomt.
                  </p>
                  <p>
                    Indien gewenst helpen we bij bagage, instappen en uitstappen.
                  </p>
                  <p>
                    Zowel heenritten als heen- en terugritten zijn mogelijk,
                    afhankelijk van uw planning.
                  </p>
                </div>
              </div>
            </div>

            <div className="surface-card-strong p-8 md:p-10 rounded-3xl shadow-md">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                Boek uw rit
              </h2>

              <form className="space-y-8" onSubmit={handleSubmit}>
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
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                      "mt-6 overflow-hidden rounded-2xl border border-secondary/20 bg-secondary/5",
                      "transition-all duration-300 ease-out",
                      isRoundTrip
                        ? "max-h-[800px] opacity-100"
                        : "max-h-0 border-transparent opacity-0",
                    ].join(" ")}
                    aria-hidden={!isRoundTrip}
                  >
                    <div className="p-6">
                      <p className="mb-4 text-base font-semibold text-primary">
                        Terugreis details
                      </p>

                      <div className="w-full mb-6">
                        <label
                          className="form-label mb-1 block"
                          htmlFor="terugreis-datum-picker"
                        >
                          Terugreis datum <span className="form-required">*</span>
                        </label>
                        <input
                          id="terugreis-datum-picker"
                          type="date"
                          className="form-input w-full"
                          min={departureDate || minDate}
                          value={returnTripDate}
                          onChange={(e) => setReturnTripDate(e.target.value)}
                          required={isRoundTrip}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Input
                          id="terugreis-straat"
                          label="Straat & nummer (terugreis)"
                          type="text"
                          placeholder="Straat en huisnummer"
                        />
                        <Input
                          id="terugreis-postcode"
                          label="Postcode (terugreis)"
                          type="text"
                          placeholder="1234 AB"
                        />
                        <Input
                          id="terugreis-stad"
                          label="Stad/gemeente (terugreis)"
                          type="text"
                          placeholder="Stad of gemeente"
                        />
                        <Input
                          id="terugreis-land"
                          label="Land (terugreis)"
                          type="text"
                          placeholder="Land"
                        />
                      </div>

                      <div className="mt-6">
                        <Input
                          id="terugkeeradres"
                          label="Plek van ophaal voor terugreis"
                          type="text"
                          placeholder="Bijv. Luchthaven terminal 2"
                        />
                      </div>
                    </div>
                  </div>
                </ReservationFormSection>

                <ReservationFormSection
                  step={4}
                  title="Assistentie en ritinformatie"
                  description="Geef aan of je extra hulp nodig hebt voor bagage of begeleiding."
                >
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
                        ? "max-h-[400px] opacity-100"
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

                  <div className="rounded-xl border border-[#d6e6ff] bg-[#edf4ff] p-4">
                    <h4 className="mb-2 font-semibold text-slate-900">
                      Ritinformatie
                    </h4>

                    <p className="text-sm text-slate-600">
                      Afstand en prijs worden hier automatisch berekend.
                    </p>
                  </div>
                </ReservationFormSection>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-8">
                  <Button variant="primary" type="submit">
                    Boek nu
                  </Button>

                  <Button variant="outline" type="button">
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

          <div className="flex flex-col gap-10 xl:gap-12">
            <section className="surface-card-strong p-8 rounded-3xl shadow-md">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                Zo verloopt uw luchthavenrit
              </h2>

              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-1">
                {JOURNEY_STEPS.map((step) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#0043A8]">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-[#1d4fb6] bg-[linear-gradient(135deg,#0b0b0f_0%,#0f1c3d_55%,#0043A8_100%)] p-8 text-white shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-100/80">
                Handig om te weten
              </p>
              <h2 className="mt-3 text-2xl font-black">
                Een rustige start van uw reis
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-blue-100/90">
                Vooral bij vroege vluchten of extra bagage is een voorspelbare
                rit een groot verschil. Daarom plannen we deze service met focus
                op rust, timing en duidelijke begeleiding.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white">
                    Beste moment om te reserveren
                  </p>
                  <p className="mt-1 text-sm text-blue-100/90">
                    Liefst minstens 24 uur op voorhand, zeker voor piekmomenten
                    of assistentie.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white">
                    Vroege of late vluchten
                  </p>
                  <p className="mt-1 text-sm text-blue-100/90">
                    Ook dan voorzien we een comfortabele transfer zonder dat u
                    afhankelijk bent van overstappen.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="mt-20">
          <div className="mb-6 flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#0043A8]">
              <MapPin className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Vaak gekozen luchthavens
              </h2>
              <p className="text-sm text-slate-600">
                We verzorgen ritten naar meerdere vertrek- en aankomstlocaties.
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
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
        </section>
      </main>
    </div>
  );
}