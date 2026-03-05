import { useState } from "react";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import CalendarDateField from "../components/forms/CalendarDateField";
import { Plane, Check } from "lucide-react";

export function LuchthavenVervoer() {
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [assistentie, setAssistentie] = useState<"nee" | "ja">("nee");
  const [assistentieType, setAssistentieType] = useState<"" | "bagage">("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnTripDate, setReturnTripDate] = useState("");

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

  return (
    <div className="page-modern">
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="brand-badge mx-auto mb-4 h-16 w-16 shadow-sm">
            <Plane className="h-9 w-9 text-[#0043A8]" />
          </div>
          <h1 className="section-title mb-4">Luchthaven vervoer</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Betrouwbaar en comfortabel vervoer naar en van alle luchthavens. Wij
            zorgen ervoor dat u op tijd aankomt.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="surface-card-strong p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Waarom kiezen voor ons?
              </h2>

              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#0043A8]" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="surface-card-strong p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
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
                  <CalendarDateField
                    id="vertrekdatum"
                    label="Datum"
                    value={departureDate}
                    onChange={setDepartureDate}
                    minDate={minDate}
                  />
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

                    <CalendarDateField
                      id="terugreis_datum"
                      label="Terugreis datum"
                      value={returnTripDate}
                      onChange={setReturnTripDate}
                      minDate={departureDate || minDate}
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
              </div>

              <div className="rounded-xl border border-[#d6e6ff] bg-[#edf4ff] p-4">
                <h4 className="mb-2 font-semibold text-slate-900">
                  Ritinformatie
                </h4>

                <p className="text-sm text-slate-600">
                  Afstand en prijs worden hier automatisch berekend.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="primary">Boek nu</Button>

                <Button variant="outline">Offerte aanvragen</Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
