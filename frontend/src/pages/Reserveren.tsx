import { useState } from "react";
import Button from "../components/ui/Button";

type FieldProps = {
  label: string;
  type?: string;
  name?: string;
  placeholder?: string;
};

function Field({ label, type = "text", name, placeholder }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-primary">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
      />
    </label>
  );
}

export default function ReserverenPage() {
  const [assistentie, setAssistentie] = useState<"nee" | "ja">("nee");
  const [assistentieType, setAssistentieType] = useState<
    "" | "luchthaven" | "ziekenhuis"
  >("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFEAC2] via-[#FFFFFF] to-[#E8F4FF]">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-10 text-center text-3xl font-bold text-primary">
          vraag uw vervoer aan
        </h1>

        <form
          className="space-y-10 bg-white/95 rounded-3xl p-8 shadow-lg border border-primary/10"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Field label="Voornaam" name="voornaam" placeholder="Uw voornaam" />
            <Field label="Naam" name="naam" placeholder="Uw familienaam" />
            <Field
              label="E-mail"
              type="email"
              name="email"
              placeholder="naam@email.com"
            />
            <Field
              label="Telefoonnummer"
              name="telefoon"
              placeholder="+32 ..."
            />
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold text-primary">
              Vertrek adres
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <Field
                  label="Straat + nummer"
                  name="straat"
                  placeholder="Straatnaam 12"
                />
              </div>
              <Field label="Postcode" name="postcode" placeholder="2800" />
              <Field label="Gemeente" name="gemeente" placeholder="Mechelen" />
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

          <Button className="w-64">Verstuur</Button>
        </form>
      </div>
    </div>
  );
}
