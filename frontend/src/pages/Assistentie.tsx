import { useMemo, useState, type ComponentType, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserCircle, Heart, Calendar } from "lucide-react";

import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";

import ReservationAccountPrompt from "../components/reservation/ReservationAccountPrompt";
import ReservationFormSection from "../components/reservation/ReservationFormSection";
import { checkEmailExists, getCurrentUser } from "../auth/auth.api";

type Feature = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

type AssistentieType = "" | "luchthaven" | "adl" | "vrijetijd" | "reis";
type YesNo = "ja" | "nee";

type AssistentieFormData = {
  naam: string;
  email: string;
  telefoon: string;
  adres: string;
  startDatum: string;
  eindDatum: string;
  aantalUren: string;
  taken: string;
  hulpbehoeften: string[];
  assistentieType: AssistentieType;
  heeftPvb: YesNo;
  pvbNummer: string;
  toelichting: string;
};

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

  const [formData, setFormData] = useState<AssistentieFormData>({
    naam: "",
    email: "",
    telefoon: "",
    adres: "",
    startDatum: "",
    eindDatum: "",
    aantalUren: "",
    taken: "",
    hulpbehoeften: [],
    assistentieType: "",
    heeftPvb: "nee",
    pvbNummer: "",
    toelichting: "",
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

    if (formData.assistentieType) {
      params.set("assistanceType", formData.assistentieType);
    }

    return `/reserveren?${params.toString()}`;
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
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-12 text-center">
          <div className="brand-badge mx-auto mb-4 h-16 w-16 shadow-sm">
            <Users className="h-9 w-9 text-[#0043A8]" />
          </div>

          <h1 className="section-title mb-4">Assistentie</h1>

          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Extra ondersteuning en begeleiding tijdens uw reis. We zorgen dat u
            zich veilig en comfortabel voelt onderweg.
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-3 md:gap-8">
          {FEATURES.map((feature) => (
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
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="surface-card-strong mb-8 p-6 md:p-8">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                Wanneer assistentie?
              </h2>

              <div className="space-y-4 leading-relaxed text-slate-700">
                <p>
                  Onze assistentieservice is er voor mensen die extra
                  ondersteuning nodig hebben tijdens het reizen, bijvoorbeeld
                  door:
                </p>

                <ul className="list-inside list-disc space-y-2">
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
              <h3 className="mb-4 text-xl font-semibold">
                Wat mag u verwachten?
              </h3>

              <ul className="space-y-3 text-white/95">
                <li className="flex gap-3">
                  <span className="text-2xl leading-none">✓</span>
                  <span>Persoonlijke aanpak</span>
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
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Vraag assistentie aan
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {formError && <div className="form-alert-error">{formError}</div>}

              <ReservationFormSection
                step={1}
                title="Contact en aanvraag"
                description="Vul je contactgegevens en de gewenste periode voor assistentie in."
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
                  required
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
                  required
                />

                <Input
                  id="adres"
                  label="Adres (optioneel)"
                  type="text"
                  placeholder="Straat, huisnummer, postcode, stad"
                  value={formData.adres}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, adres: e.target.value }))
                  }
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      className="form-label block mb-1"
                      htmlFor="startDatum-picker"
                    >
                      Startdatum <span className="form-required">*</span>
                    </label>
                    <input
                      id="startDatum-picker"
                      type="date"
                      className="form-input"
                      min={minDate}
                      value={formData.startDatum}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          startDatum: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="form-label block mb-1"
                      htmlFor="eindDatum-picker"
                    >
                      Einddatum <span className="form-required">*</span>
                    </label>
                    <input
                      id="eindDatum-picker"
                      type="date"
                      className="form-input"
                      min={formData.startDatum || minDate}
                      value={formData.eindDatum}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          eindDatum: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <Input
                  id="aantalUren"
                  label="Aantal uren assistentie (per dag of totaal)"
                  type="number"
                  min={1}
                  value={formData.aantalUren}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, aantalUren: e.target.value }))
                  }
                  required
                />
              </ReservationFormSection>

              <ReservationFormSection
                step={2}
                title="Voornaamste taken en type assistentie"
                description="Omschrijf de belangrijkste taken en kies het type assistentie."
              >
                <label className="mb-4 block">
                  <span className="form-label">Voornaamste taken</span>
                  <textarea
                    value={formData.taken}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, taken: e.target.value }))
                    }
                    placeholder={assistentieHint.placeholder}
                    className="min-h-[80px] w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 py-2 outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-accent"
                    required
                  />
                </label>

                <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">
                    {assistentieHint.title}
                  </p>
                  <p className="mt-1">{assistentieHint.text}</p>
                </div>

                <label className="mb-4 block">
                  <span className="form-label">Type assistentie</span>
                  <select
                    value={formData.assistentieType}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        assistentieType: e.target.value as AssistentieType,
                      }))
                    }
                    className="h-11 w-full rounded-lg border border-secondary/20 bg-white/70 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    required
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

                <div className="mb-4">
                  <span className="form-label">Hulpbehoeften</span>
                  <div className="mt-2 grid gap-2">
                    {HULPBEHOEFTEN.map((optie) => (
                      <label
                        key={optie}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={formData.hulpbehoeften.includes(optie)}
                          onChange={() => toggleHulpbehoefte(optie)}
                          className="accent-[color:var(--accent)]"
                        />
                        {optie}
                      </label>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="form-label">Toelichting (optioneel)</span>
                  <textarea
                    value={formData.toelichting}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        toelichting: e.target.value,
                      }))
                    }
                    placeholder="Extra info, bijzonderheden, ..."
                    className="min-h-[60px] w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 py-2 outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-accent"
                  />
                </label>
              </ReservationFormSection>

              <ReservationFormSection
                step={3}
                title="Persoonsvolgend budget (PVB)"
                description="Geef aan of u beschikt over een PVB en vul eventueel uw nummer in."
              >
                <div className="mb-4 flex flex-wrap gap-6">
                  <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-primary">
                    <input
                      type="radio"
                      name="heeftPvb"
                      value="nee"
                      checked={formData.heeftPvb === "nee"}
                      onChange={() =>
                        setFormData((p) => ({
                          ...p,
                          heeftPvb: "nee",
                          pvbNummer: "",
                        }))
                      }
                      className="accent-[color:var(--accent)]"
                    />
                    Nee
                  </label>

                  <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-primary">
                    <input
                      type="radio"
                      name="heeftPvb"
                      value="ja"
                      checked={formData.heeftPvb === "ja"}
                      onChange={() =>
                        setFormData((p) => ({ ...p, heeftPvb: "ja" }))
                      }
                      className="accent-[color:var(--accent)]"
                    />
                    Ja
                  </label>
                </div>

                {formData.heeftPvb === "ja" && (
                  <Input
                    id="pvbNummer"
                    label="PVB-nummer (optioneel)"
                    type="text"
                    value={formData.pvbNummer}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, pvbNummer: e.target.value }))
                    }
                  />
                )}
              </ReservationFormSection>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
