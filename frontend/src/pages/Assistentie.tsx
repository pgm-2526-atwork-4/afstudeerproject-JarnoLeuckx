import { useMemo, useState } from "react";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Users, UserCircle, Heart, Calendar } from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

type AssistentieType = "" | "luchthaven" | "adl" | "vrijetijd" | "reis";
type YesNo = "ja" | "nee";

const FEATURES: Feature[] = [
  {
    icon: UserCircle,
    title: "Persoonlijke begeleiding",
    description: "Een begeleider staat klaar om u te ondersteunen waar nodig.",
  },
  {
    icon: Heart,
    title: "Op maat gemaakt",
    description: "We stemmen de service af op uw situatie en wensen.",
  },
  {
    icon: Calendar,
    title: "Flexibele planning",
    description:
      "Eenmalige assistentie of meerdere dagen, alles kan besproken worden.",
  },
];

const HULPBEHOEFTEN: string[] = [
  "Begeleiding tijdens de rit",
  "Hulp bij in- en uitstappen",
  "Deur-tot-deur service",
  "Bagage assistentie",
  "Medische begeleiding",

  "Ondersteuning bij dagelijkse activiteiten",
];

export default function Assistentie() {
  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    telefoon: "",
    adres: "",
    datum: "",
    tijd: "",
    hulpbehoeften: [] as string[],
    toelichting: "",
    assistentieVoorReis: "ja" as YesNo,
    meerdereDagen: "nee" as YesNo,
    eindDatum: "",
    assistentieType: "" as AssistentieType,
    assistentieDetails: "",
  });

  const assistentieHint = useMemo(() => {
    switch (formData.assistentieType) {
      case "luchthaven":
        return {
          title: "Luchthaven assistentie",
          text: "Hulp bij check-in, bagage en begeleiding waar nodig.",
          placeholder:
            "Bijv. hulp bij check-in, begeleiding naar gate, hulp met bagage...",
        };
      case "adl":
        return {
          title: "ADL assistentie",
          text: "Ondersteuning bij dagelijkse handelingen, afgestemd op uw noden.",
          placeholder:
            "Bijv. hulp bij dagelijkse activiteiten, medicatie, ondersteuning bij verplaatsing...",
        };
      case "vrijetijd":
        return {
          title: "Vrijetijd assistentie",
          text: "Begeleiding bij activiteiten, wandelen of uitstappen.",
          placeholder:
            "Bijv. begeleiding bij activiteit, hulp bij wandelen, ondersteuning tijdens uitstap...",
        };
      case "reis":
        return {
          title: "Reis assistentie",
          text: "Extra ondersteuning tijdens een volledige verplaatsing of traject.",
          placeholder:
            "Bijv. begeleiding op verschillende locaties, hulp bij overstappen, extra ondersteuning onderweg...",
        };
      default:
        return {
          title: "Tip",
          text: "Kies een type assistentie zodat we u zo goed mogelijk kunnen helpen.",
          placeholder: "Beschrijf uw situatie en de hulp die u nodig heeft...",
        };
    }
  }, [formData.assistentieType]);

  const toggleHulpbehoefte = (optie: string) => {
    setFormData((prev) => ({
      ...prev,
      hulpbehoeften: prev.hulpbehoeften.includes(optie)
        ? prev.hulpbehoeften.filter((h) => h !== optie)
        : [...prev.hulpbehoeften, optie],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9F6EF] via-white to-[#E8F4FF]">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 shadow-sm">
            <Users className="h-9 w-9 text-primary" />
          </div>

          <h1 className="text-4xl font-bold text-primary mb-4">Assistentie</h1>

          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Extra ondersteuning en begeleiding tijdens uw reis. We zorgen dat u
            zich veilig en comfortabel voelt onderweg.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {FEATURES.map((feature, i) => {
            const colors = [
              "from-[#FFE8D1] to-[#FFEAC2]",
              "from-[#D1E8FF] to-[#E3F2FF]",
              "from-[#E8D1FF] to-[#F5E3FF]",
            ];
            return (
              <div
                key={feature.title}
                className={`bg-gradient-to-br ${colors[i % colors.length]} rounded-2xl p-8 text-center shadow-md border border-white/60 hover:shadow-lg transition-all`}
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>

                <h3 className="text-xl font-semibold text-primary mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-800 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info Section */}
          <div>
            <div className="bg-white/95 rounded-2xl p-8 mb-8 shadow-md border border-primary/15">
              <h2 className="text-2xl font-semibold text-primary mb-6">
                Wanneer assistentie?
              </h2>

              <div className="space-y-4 text-gray-800 leading-relaxed">
                <p>
                  Onze assistentieservice is er voor mensen die extra
                  ondersteuning nodig hebben tijdens het reizen, bijvoorbeeld
                  door:
                </p>

                <ul className="space-y-2 list-disc list-inside">
                  <li>Lichamelijke beperkingen</li>
                  <li>Cognitieve uitdagingen</li>
                  <li>Visuele of auditieve beperkingen</li>
                  <li>Onzekerheid of stress tijdens het reizen</li>
                  <li>Herstel na een medische behandeling</li>
                  <li>Oudere leeftijd</li>
                </ul>
              </div>
            </div>

            <div className="bg-primary text-white rounded-2xl p-8 shadow-md border border-primary/10">
              <h3 className="text-xl font-semibold mb-4">
                Wat mag u verwachten?
              </h3>
              <ul className="space-y-3 text-white/95">
                <li className="flex gap-3">
                  <span className="text-2xl leading-none">✓</span>
                  <span>Persoonlijke kennismaking (indien nodig)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl leading-none">✓</span>
                  <span>Deur-tot-deur begeleiding indien gewenst</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl leading-none">✓</span>
                  <span>Getrainde begeleiders met ervaring</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl leading-none">✓</span>
                  <span>Respect voor uw privacy en waardigheid</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-primary/10">
            <h2 className="text-2xl font-semibold text-primary mb-6">
              Vraag assistentie aan
            </h2>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <Input
                id="naam"
                label="Volledige naam"
                type="text"
                placeholder="Uw naam"
                value={formData.naam}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, naam: e.target.value }))
                }
              />

              <Input
                id="email"
                label="E-mailadres"
                type="email"
                placeholder="naam@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, email: e.target.value }))
                }
              />

              <Input
                id="telefoon"
                label="Telefoonnummer"
                type="tel"
                placeholder="+32 ..."
                value={formData.telefoon}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, telefoon: e.target.value }))
                }
              />

              <Input
                id="adres"
                label="Adres"
                type="text"
                placeholder="Straat, huisnummer, postcode, stad"
                value={formData.adres}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, adres: e.target.value }))
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  id="datum"
                  label="Gewenste datum"
                  type="date"
                  value={formData.datum}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, datum: e.target.value }))
                  }
                />
                <Input
                  id="tijd"
                  label="Gewenste tijd"
                  type="time"
                  value={formData.tijd}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, tijd: e.target.value }))
                  }
                />
              </div>

              {/* Hulpbehoeften */}
              <div className="border-t pt-6">
                <p className="mb-4 text-xs font-semibold text-primary">
                  Waarmee kunnen we helpen?
                </p>

                <div className="space-y-3">
                  {HULPBEHOEFTEN.map((optie) => {
                    const checked = formData.hulpbehoeften.includes(optie);
                    return (
                      <label
                        key={optie}
                        className="flex items-center gap-3 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleHulpbehoefte(optie)}
                          className="h-4 w-4 rounded border-secondary/40 accent-[color:var(--accent)]"
                        />
                        <span className="text-sm text-gray-900">{optie}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Toelichting */}
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-primary">
                  Aanvullende informatie (optioneel)
                </span>
                <textarea
                  value={formData.toelichting}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, toelichting: e.target.value }))
                  }
                  placeholder="Vertel ons meer over uw specifieke behoeften..."
                  className="min-h-[110px] w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
                />
              </label>

              {/* Assistentie voor reis (animated) */}
              <div className="border-t pt-6">
                <p className="mb-4 text-xs font-semibold text-primary">
                  Assistentie voor reis?
                </p>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 text-sm text-primary cursor-pointer select-none">
                    <input
                      type="radio"
                      name="assistentieVoorReis"
                      value="nee"
                      checked={formData.assistentieVoorReis === "nee"}
                      onChange={() =>
                        setFormData((p) => ({
                          ...p,
                          assistentieVoorReis: "nee",
                          meerdereDagen: "nee",
                          eindDatum: "",
                          assistentieType: "",
                          assistentieDetails: "",
                        }))
                      }
                      className="accent-[color:var(--accent)]"
                    />
                    Nee
                  </label>

                  <label className="flex items-center gap-2 text-sm text-primary cursor-pointer select-none">
                    <input
                      type="radio"
                      name="assistentieVoorReis"
                      value="ja"
                      checked={formData.assistentieVoorReis === "ja"}
                      onChange={() =>
                        setFormData((p) => ({
                          ...p,
                          assistentieVoorReis: "ja",
                        }))
                      }
                      className="accent-[color:var(--accent)]"
                    />
                    Ja
                  </label>
                </div>

                <div
                  className={[
                    "mt-5 overflow-hidden rounded-xl border border-secondary/20 bg-secondary/5",
                    "transition-all duration-300 ease-out",
                    formData.assistentieVoorReis === "ja"
                      ? "max-h-[800px] opacity-100"
                      : "max-h-0 opacity-0 border-transparent",
                  ].join(" ")}
                  aria-hidden={formData.assistentieVoorReis !== "ja"}
                >
                  <div className="p-5 space-y-5">
                    {/* Meerdere dagen */}
                    <div>
                      <p className="mb-3 text-sm font-semibold text-primary">
                        Meerdere dagen?
                      </p>

                      <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-2 text-sm text-primary cursor-pointer select-none">
                          <input
                            type="radio"
                            name="meerdereDagen"
                            value="nee"
                            checked={formData.meerdereDagen === "nee"}
                            onChange={() =>
                              setFormData((p) => ({
                                ...p,
                                meerdereDagen: "nee",
                                eindDatum: "",
                              }))
                            }
                            className="accent-[color:var(--accent)]"
                          />
                          Nee
                        </label>

                        <label className="flex items-center gap-2 text-sm text-primary cursor-pointer select-none">
                          <input
                            type="radio"
                            name="meerdereDagen"
                            value="ja"
                            checked={formData.meerdereDagen === "ja"}
                            onChange={() =>
                              setFormData((p) => ({
                                ...p,
                                meerdereDagen: "ja",
                              }))
                            }
                            className="accent-[color:var(--accent)]"
                          />
                          Ja
                        </label>
                      </div>

                      <div
                        className={[
                          "mt-4 overflow-hidden transition-all duration-300 ease-out",
                          formData.meerdereDagen === "ja"
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0",
                        ].join(" ")}
                        aria-hidden={formData.meerdereDagen !== "ja"}
                      >
                        <div className="pt-2">
                          <Input
                            id="eindDatum"
                            label="Einddatum"
                            type="date"
                            value={formData.eindDatum}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                eindDatum: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Type assistentie */}
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold text-primary">
                        Type assistentie
                      </span>

                      <select
                        value={formData.assistentieType}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            assistentieType: e.target.value as AssistentieType,
                          }))
                        }
                        className="h-11 w-full rounded-lg border border-secondary/20 bg-white/70 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <option value="">Selecteer type assistentie</option>
                        <option value="luchthaven">
                          Assistentie op luchthaven
                        </option>
                        <option value="adl">ADL assistentie</option>
                        <option value="vrijetijd">Vrijetijd assistentie</option>
                        <option value="reis">Reis assistentie</option>
                      </select>
                    </label>

                    {/* Details */}
                    <label className="block">
                      <span className="mb-2 block text-xs font-semibold text-primary">
                        Assistentie details
                      </span>
                      <textarea
                        value={formData.assistentieDetails}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            assistentieDetails: e.target.value,
                          }))
                        }
                        placeholder={assistentieHint.placeholder}
                        className="min-h-[110px] w-full rounded-lg border border-secondary/20 bg-white/70 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
                      />
                    </label>

                    <div className="rounded-lg bg-white/70 p-4 text-sm text-gray-900 border border-secondary/20">
                      <span className="font-semibold text-primary">
                        {assistentieHint.title}:
                      </span>{" "}
                      {assistentieHint.text}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="accent" className="w-full" type="submit">
                  Aanvraag indienen
                </Button>

                <Button variant="outline" className="w-full" type="button">
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
