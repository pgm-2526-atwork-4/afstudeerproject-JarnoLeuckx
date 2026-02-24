import { useState } from "react";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Plane, Check } from "lucide-react";

export function LuchthavenVervoer() {
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [assistentie, setAssistentie] = useState<"nee" | "ja">("nee");
  const [assistentieType, setAssistentieType] = useState<"" | "bagage">("");

  const features: string[] = [
    "Op tijd voor uw vlucht",
    "Directe rit zonder stops",
    "Hulp met bagage",
    "Comfortabele voertuigen",
    "Ervaren chauffeurs",
    "24/7 beschikbaar",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE8D1] via-white to-[#E3F2FF]">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 shadow-sm">
            <Plane className="h-9 w-9 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">
            Luchthaven vervoer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Betrouwbaar en comfortabel vervoer naar en van alle luchthavens. Wij
            zorgen ervoor dat u op tijd aankomt.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="bg-gradient-to-br from-[#FFE8D1] to-[#FFEAC2] rounded-2xl p-8 mb-8 shadow-md border border-white/60">
              <h2 className="text-2xl font-semibold text-primary mb-6">
                Waarom kiezen voor ons?
              </h2>

              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white/95 rounded-2xl p-8 shadow-md border border-primary/15">
            <h2 className="text-2xl font-semibold text-primary mb-6">
              Boek uw rit
            </h2>

            <form className="space-y-6">
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
                placeholder="+32 000 00 00 00"
              />

              <Input
                id="luchthaven"
                label="Luchthaven"
                type="text"
                placeholder="Selecteer luchthaven"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="vertrekstraat"
                  label="Straat & nummer"
                  type="text"
                  placeholder="Straat, huisnummer"
                />
                <Input
                  id="verkpostcode"
                  label="Postcode"
                  type="text"
                  placeholder="1234 AB"
                />
              </div>
              <Input
                id="verkstad"
                label="Stad"
                type="text"
                placeholder="Uw stad"
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
                      ? "max-h-[400px] opacity-100"
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

                    <div className="mt-4">
                      <Input
                        id="terugkeeradres"
                        label="Plek van ophaal voor terugreis"
                        type="text"
                        placeholder="Bijv. Luchthaven terminal 2"
                      />
                    </div>
                  </div>
                </div>
              </div>

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
                      ? "max-h-[400px] opacity-100"
                      : "max-h-0 opacity-0 border-transparent",
                  ].join(" ")}
                  aria-hidden={assistentie !== "ja"}
                >
                  <div className="p-5">
                    <p className="text-sm font-semibold text-primary mb-3">
                      Type assistentie
                    </p>

                    <button
                      type="button"
                      onClick={() => setAssistentieType("bagage")}
                      className={[
                        "w-full rounded-lg border px-4 py-3 text-left text-sm transition",
                        assistentieType === "bagage"
                          ? "border-primary bg-white shadow-sm"
                          : "border-secondary/20 bg-white/60 hover:bg-white",
                      ].join(" ")}
                    >
                      <span className="block font-semibold text-primary">
                        Hulp met bagage
                      </span>
                      <span className="block text-gray-800">
                        Ondersteuning bij laden en uit-/instappen.
                      </span>
                    </button>

                    <div className="mt-4 rounded-lg bg-white/70 p-4 text-sm text-gray-900 border border-secondary/20">
                      {assistentieType === "bagage" ? (
                        <>
                          <span className="font-semibold text-primary">
                            Bagage assistentie:
                          </span>{" "}
                          Onze chauffeur helpt u met in- en uitstappen en
                          ondersteunt u met uw bagage.
                        </>
                      ) : (
                        <>
                          <span className="font-semibold text-primary">
                            Tip:
                          </span>{" "}
                          Selecteer het gewenste type assistentie.
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-primary">Ritinformatie</h4>

                <p className="text-sm text-gray-600">
                  Afstand en prijs worden hier automatisch berekend.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="accent">Boek nu</Button>

                <Button variant="outline">Offerte aanvragen</Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
