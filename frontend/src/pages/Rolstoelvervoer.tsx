import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import CalendarDateField from "../components/forms/CalendarDateField";
import ReservationAccountPrompt from "../components/reservation/ReservationAccountPrompt";
import ReservationFormSection from "../components/reservation/ReservationFormSection";
import { checkEmailExists, getCurrentUser } from "../auth/auth.api";
import { Accessibility, Check, Heart, Shield } from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const FEATURES: Feature[] = [
  {
    icon: Accessibility,
    title: "Aangepaste voertuigen",
    description:
      "Voertuigen met rolstoellift en veilige bevestigingssystemen voor uw rolstoel.",
  },
  {
    icon: Heart,
    title: "Persoonlijke zorg",
    description:
      "Chauffeurs met ervaring in begeleiding en extra aandacht voor uw comfort.",
  },
  {
    icon: Shield,
    title: "Veilig & comfortabel",
    description:
      "Uw veiligheid staat voorop: rustig rijden, duidelijke communicatie en hulp waar nodig.",
  },
];

export default function Rolstoelvervoer() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [assistentie, setAssistentie] = useState<"nee" | "ja">("nee");
  const [assistentieType, setAssistentieType] = useState<
    "" | "luchthaven" | "ziekenhuis"
  >("");
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [departureDate, setDepartureDate] = useState("");
  const [returnTripDate, setReturnTripDate] = useState("");
  const [accountPrompt, setAccountPrompt] = useState<
    null | "login" | "register"
  >(null);
  const [formError, setFormError] = useState<string | null>(null);

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  function buildReservationPath() {
    const params = new URLSearchParams({ service: "wheelchair" });

    if (assistentie === "ja" && assistentieType) {
      params.set("assistanceType", assistentieType);
    }

    return `/reserveren?${params.toString()}`;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="brand-badge mx-auto mb-4 h-16 w-16 shadow-sm">
            <Accessibility className="h-9 w-9 text-[#0043A8]" />
          </div>

          <h1 className="section-title mb-4">Rolstoelvervoer</h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Gespecialiseerd vervoer voor rolstoelgebruikers met aangepaste
            voertuigen en zorgzame chauffeurs.
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

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Info Section */}
          <div>
            <div className="surface-card-strong mb-8 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Onze diensten
              </h2>

              <ul className="space-y-4">
                {[
                  {
                    strong: "Medische afspraken:",
                    text: "Vervoer naar ziekenhuis, huisarts of specialist.",
                  },
                  {
                    strong: "Dagactiviteiten:",
                    text: "Bezoek aan familie, vrienden of evenementen.",
                  },
                  {
                    strong: "Winkelen:",
                    text: "Hulp bij boodschappen en dagelijkse zaken.",
                  },
                  {
                    strong: "Luchthaven transfer:",
                    text: "Extra begeleiding voor vliegreizen indien gewenst.",
                  },
                ].map((item) => (
                  <li key={item.strong} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#0043A8] flex-shrink-0 mt-1" />
                    <p className="text-slate-700 leading-relaxed">
                      <span className="font-semibold text-slate-900">
                        {item.strong}
                      </span>{" "}
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-card border-[#d6e6ff] bg-[#edf4ff] p-6 md:p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Belangrijk om te weten
              </h3>

              <ul className="space-y-3 text-slate-700">
                <li>• We werken met elektrische en handmatige rolstoelen</li>
                <li>• Maximaal gewicht: 250 kg (inclusief rolstoel)</li>
                <li>• Bij voorkeur minstens 24 uur op voorhand reserveren</li>
                <li>• Annuleren kan tot 4 uur voor vertrek</li>
              </ul>
            </div>
          </div>

          {/* Booking Form (frontend-only) */}
          <div className="surface-card-strong p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Boek uw rit
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {formError && <div className="form-alert-error">{formError}</div>}

              <ReservationFormSection
                step={1}
                title="Contactgegevens"
                description="Vul eerst je basisgegevens in zodat we je reservatie correct kunnen opvolgen."
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
                  placeholder="+32 ..."
                />
              </ReservationFormSection>

              <ReservationFormSection
                step={2}
                title="Traject"
                description="Geef duidelijk aan waar we je ophalen en waar de rit eindigt."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    id="ophaalstraat"
                    label="Straat & nummer (ophaal)"
                    type="text"
                    placeholder="Straat, huisnummer"
                  />
                  <Input
                    id="ophaalpostcode"
                    label="Postcode (ophaal)"
                    type="text"
                    placeholder="1234 AB"
                  />
                </div>
                <Input
                  id="ophaalstad"
                  label="Stad (ophaal)"
                  type="text"
                  placeholder="Uw stad"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    id="bestemmingstraat"
                    label="Straat & nummer (bestemming)"
                    type="text"
                    placeholder="Straat, huisnummer"
                  />
                  <Input
                    id="bestemmingpostcode"
                    label="Postcode (bestemming)"
                    type="text"
                    placeholder="1234 AB"
                  />
                </div>
                <Input
                  id="bestemmingstad"
                  label="Stad (bestemming)"
                  type="text"
                  placeholder="Uw stadsbestemming"
                />
              </ReservationFormSection>

              <ReservationFormSection
                step={3}
                title="Vertrek en terugreis"
                description="Kies wanneer je wil vertrekken en voeg indien nodig een terugrit toe."
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

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRoundTrip}
                    onChange={(e) => setIsRoundTrip(e.target.checked)}
                    className="w-5 h-5 rounded accent-[var(--accent)] cursor-pointer"
                  />
                  <span className="text-primary font-medium">
                    Dit is een heen- en terugreis
                  </span>
                </label>

                <div
                  className={[
                    "mt-5 overflow-hidden rounded-xl border border-secondary/20 bg-secondary/5",
                    "transition-all duration-300 ease-out",
                    isRoundTrip
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0 border-transparent",
                  ].join(" ")}
                  aria-hidden={!isRoundTrip}
                >
                  <div className="p-5">
                    <p className="text-sm font-semibold text-primary mb-4">
                      Terugreis details
                    </p>

                    <CalendarDateField
                      id="terugreis_datum"
                      label="Terugreis datum"
                      value={returnTripDate}
                      onChange={setReturnTripDate}
                      minDate={departureDate || minDate}
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
                    placeholder="Bijv. type rolstoel, medische informatie, speciale wensen..."
                    className="min-h-[110px] w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
                  />
                </label>

                <p className="mb-4 text-xs font-semibold text-primary">
                  Assistentie nodig?
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
                            ? "border-[#0043A8] bg-[#EAF3FF] shadow-sm"
                            : "border-slate-300 bg-white hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <span className="block font-semibold text-slate-900">
                          Assistentie op luchthaven
                        </span>
                        <span className="block text-slate-600">
                          Hulp bij bagage en begeleiding waar nodig.
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAssistentieType("ziekenhuis")}
                        className={[
                          "rounded-lg border px-4 py-3 text-left text-sm transition",
                          assistentieType === "ziekenhuis"
                            ? "border-[#0043A8] bg-[#EAF3FF] shadow-sm"
                            : "border-slate-300 bg-white hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <span className="block font-semibold text-slate-900">
                          Assistentie voor afspraak
                        </span>
                        <span className="block text-slate-600">
                          Begeleiding naar afdeling en ondersteuning ter
                          plaatse.
                        </span>
                      </button>
                    </div>

                    <label className="block mt-5">
                      <span className="mb-2 block text-xs font-semibold text-primary">
                        Extra details (optioneel)
                      </span>
                      <textarea
                        name="assistentie_details"
                        placeholder="Bijv. hulp bij instappen, rolstoel meenemen, bagage..."
                        className="min-h-[110px] w-full rounded-lg border border-secondary/20 bg-white/70 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
                      />
                    </label>

                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                      {assistentieType === "luchthaven" ? (
                        <>
                          <span className="font-semibold text-slate-900">
                            Luchthaven assistentie:
                          </span>{" "}
                          Onze chauffeur helpt u met in- en uitstappen,
                          ondersteunt met bagage en begeleidt u waar nodig.
                        </>
                      ) : assistentieType === "ziekenhuis" ? (
                        <>
                          <span className="font-semibold text-slate-900">
                            Afspraak assistentie:
                          </span>{" "}
                          Onze chauffeur kan u begeleiden naar de juiste
                          afdeling en veilig terug naar huis brengen.
                        </>
                      ) : (
                        <>
                          <span className="font-semibold text-slate-900">
                            Tip:
                          </span>{" "}
                          Kies een type assistentie zodat we u beter kunnen
                          helpen.
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </ReservationFormSection>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="primary" className="w-full">
                  Boek nu
                </Button>

                <Button variant="outline" className="w-full">
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
