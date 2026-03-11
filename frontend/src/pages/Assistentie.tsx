import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import CalendarDateField from "../components/forms/CalendarDateField";
import ReservationAccountPrompt from "../components/reservation/ReservationAccountPrompt";
import ReservationFormSection from "../components/reservation/ReservationFormSection";
import { checkEmailExists, getCurrentUser } from "../auth/auth.api";
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
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
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
  const [accountPrompt, setAccountPrompt] = useState<
    null | "login" | "register"
  >(null);
  const [formError, setFormError] = useState<string | null>(null);

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

  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const toggleHulpbehoefte = (optie: string) => {
    setFormData((prev) => ({
      ...prev,
      hulpbehoeften: prev.hulpbehoeften.includes(optie)
        ? prev.hulpbehoeften.filter((h) => h !== optie)
        : [...prev.hulpbehoeften, optie],
    }));
  };

  function buildReservationPath() {
    const params = new URLSearchParams({ service: "assistance" });

    if (formData.assistentieType === "luchthaven") {
      params.set("assistanceType", "luchthaven");
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

    const email = formData.email.trim();

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
       
        <div className="text-center mb-12">
          <div className="brand-badge mx-auto mb-4 h-16 w-16 shadow-sm">
            <Users className="h-9 w-9 text-[#0043A8]" />
          </div>

          <h1 className="section-title mb-4">Assistentie</h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Extra ondersteuning en begeleiding tijdens uw reis. We zorgen dat u
            zich veilig en comfortabel voelt onderweg.
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

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      
          <div>
            <div className="surface-card-strong mb-8 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Wanneer assistentie?
              </h2>

              <div className="space-y-4 text-slate-700 leading-relaxed">
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

            <div className="rounded-2xl border border-[#1d4fb6] bg-[linear-gradient(135deg,#0b0b0f_0%,#0f1c3d_55%,#0043A8_100%)] p-6 text-white shadow-md md:p-8">
              <h3 className="text-xl font-semibold mb-4">
                Wat mag u verwachten?
              </h3>
              <ul className="space-y-3 text-white/95">
                <li className="flex gap-3">
                  <span className="text-2xl leading-none">✓</span>
                  <span> Persoonlijke aanpak </span>
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

         
          <div className="surface-card-strong p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Vraag assistentie aan
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {formError && <div className="form-alert-error">{formError}</div>}

              <ReservationFormSection
                step={1}
                title="Contact en aanvraag"
                description="Vul je contactgegevens en het gewenste moment voor de assistentie in."
                defaultOpen
              >
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
                  name="email"
                  label="E-mailadres"
                  type="email"
                  placeholder="naam@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  required
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

                <div className="space-y-4">
                  <CalendarDateField
                    id="datum"
                    label="Gewenste datum"
                    value={formData.datum}
                    onChange={(value) =>
                      setFormData((p) => ({ ...p, datum: value }))
                    }
                    minDate={minDate}
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
              </ReservationFormSection>

              <ReservationFormSection
                step={2}
                title="Ondersteuningsnoden"
                description="Laat weten waarmee we concreet kunnen helpen tijdens de begeleiding."
              >
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

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-primary">
                    Aanvullende informatie (optioneel)
                  </span>
                  <textarea
                    value={formData.toelichting}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        toelichting: e.target.value,
                      }))
                    }
                    placeholder="Vertel ons meer over uw specifieke behoeften..."
                    className="min-h-[110px] w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
                  />
                </label>
              </ReservationFormSection>

              <ReservationFormSection
                step={3}
                title="Extra assistentie op locatie"
                description="Geef aan of de ondersteuning deel uitmaakt van een traject of meerdere dagen omvat."
              >
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
                          <CalendarDateField
                            id="eindDatum"
                            label="Einddatum"
                            value={formData.eindDatum}
                            onChange={(value) =>
                              setFormData((p) => ({
                                ...p,
                                eindDatum: value,
                              }))
                            }
                            minDate={formData.datum || minDate}
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

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">
                        {assistentieHint.title}:
                      </span>{" "}
                      {assistentieHint.text}
                    </div>
                  </div>
                </div>
              </ReservationFormSection>

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="primary" className="w-full" type="submit">
                  Aanvraag indienen
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
