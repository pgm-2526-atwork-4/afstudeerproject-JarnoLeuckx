import { useState } from "react";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
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
  const [assistentie, setAssistentie] = useState<"nee" | "ja">("nee");
  const [assistentieType, setAssistentieType] = useState<
    "" | "luchthaven" | "ziekenhuis"
  >("");
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  return (
    <div className="page-modern">
      <main className="max-w-7xl mx-auto px-6 py-12">
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

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {FEATURES.map((feature) => {
            return (
              <div
                key={feature.title}
                className="surface-card-strong p-8 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
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
        <div className="grid md:grid-cols-2 gap-12">
          {/* Info Section */}
          <div>
            <div className="surface-card-strong p-8 mb-8">
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

            <div className="surface-card p-8 border-[#d6e6ff] bg-[#edf4ff]">
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
          <div className="surface-card-strong p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Boek uw rit
            </h2>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <Input
                id="naam"
                label="Volledige naam"
                type="text"
                placeholder="Uw naam"
              />

              <Input
                id="email"
                label="E-mailadres"
                type="email"
                placeholder="naam@email.com"
              />

              <Input
                id="telefoon"
                label="Telefoonnummer"
                type="tel"
                placeholder="+32 ..."
              />

              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
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

              <div className="border-t pt-6">
                <h3 className="font-medium mb-4 text-primary">
                  Wanneer wilt u vertrekken?
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <Input id="vertrekdatum" label="Datum" type="date" />
                  <Input id="vertrektijd" label="Tijd" type="time" />
                </div>
              </div>

              <div className="border-t pt-6">
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

                    <Input
                      id="terugreis_datum"
                      label="Terugreis datum"
                      type="date"
                    />

                    <div className="mt-4 grid grid-cols-2 gap-4">
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
              </div>

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

              <div className="border-t pt-6">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="primary" className="w-full">
                  Boek nu
                </Button>

                <Button variant="outline" className="w-full">
                  Offerte aanvragen
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Dit is een design preview. Functionaliteit wordt later
                toegevoegd.
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
