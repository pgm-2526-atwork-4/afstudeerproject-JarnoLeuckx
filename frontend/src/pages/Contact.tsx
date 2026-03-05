import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Mail, Phone, MapPin, Clock, AlertCircle } from "lucide-react";

type InfoItem = {
  title: string;
  lines: string[];
  icon: React.ComponentType<{ className?: string }>;
};

const INFO: InfoItem[] = [
  {
    title: "Telefoon",
    lines: ["+32 (0) 470 12 34 56", "Ma–Vr: 08:00–20:00", "Za–Zo: 09:00–18:00"],
    icon: Phone,
  },
  {
    title: "E-mail",
    lines: ["info@socialdrive.be", "We reageren binnen 24 uur"],
    icon: Mail,
  },
  {
    title: "Adres",
    lines: ["Voorbeeldstraat 123", "2800 Mechelen", "België"],
    icon: MapPin,
  },
  {
    title: "Openingstijden",
    lines: [
      "Maandag–Vrijdag: 08:00–20:00",
      "Zaterdag: 09:00–18:00",
      "Zondag: 09:00–18:00",
    ],
    icon: Clock,
  },
];

type SubjectOption =
  | ""
  | "algemeen"
  | "boeking"
  | "offerte"
  | "klacht"
  | "compliment"
  | "prijzen"
  | "anders";

export default function ContactPage() {
  return (
    <div className="page-modern">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title mb-4">Contact</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Heeft u vragen of wilt u meer informatie? Neem gerust contact met
            ons op. We helpen u graag verder.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <div className="surface-card-strong p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Contactgegevens
              </h2>

              <div className="space-y-6">
                {INFO.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <div className="brand-badge mt-1 h-11 w-11 shadow-sm">
                      <item.icon className="h-6 w-6 text-[#0043A8]" />
                    </div>

                    <div>
                      <h3 className="mb-1 font-semibold text-slate-900">
                        {item.title}
                      </h3>

                      <div className="space-y-1">
                        {item.lines.map((line) => (
                          <p key={line} className="text-slate-700">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency */}
            <div className="rounded-2xl border border-[#1d4fb6] bg-[linear-gradient(135deg,#0b0b0f_0%,#0f1c3d_55%,#0043A8_100%)] p-8 text-white shadow-lg">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">Spoedgevallen</h3>
                  <p className="text-white/90 mb-4">
                    Voor dringende ritten binnen 24 uur kunt u ons bellen op:
                  </p>
                  <p className="text-2xl font-bold mb-2">
                    +32 (0) 470 98 76 54
                  </p>
                  <p className="text-sm text-white/80">
                    24/7 bereikbaar voor spoedeisende vervoersaanvragen.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="surface-card-strong p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Stuur ons een bericht
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

              {/* Onderwerp (simple select - future-proof) */}
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-primary">
                  Onderwerp
                </span>

                <select
                  name="onderwerp"
                  defaultValue={"" satisfies SubjectOption}
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 outline-none transition-all focus-visible:border-[#0043A8] focus-visible:ring-2 focus-visible:ring-[#0043A8]/30"
                >
                  <option value="" disabled>
                    Selecteer een onderwerp
                  </option>
                  <option value="algemeen">Algemene vraag</option>
                  <option value="boeking">Boeking wijzigen</option>
                  <option value="offerte">Offerte aanvragen</option>
                  <option value="klacht">Klacht</option>
                  <option value="compliment">Compliment</option>
                  <option value="prijzen">Prijsinformatie</option>
                  <option value="anders">Anders</option>
                </select>
              </label>

              {/* Bericht */}
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-primary">
                  Bericht
                </span>
                <textarea
                  name="bericht"
                  placeholder="Typ hier uw bericht..."
                  className="min-h-[160px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none transition-all focus-visible:border-[#0043A8] focus-visible:ring-2 focus-visible:ring-[#0043A8]/30 placeholder:text-slate-400"
                />
              </label>

              <Button variant="accent" className="w-full">
                Verstuur bericht
              </Button>

              <p className="text-sm text-gray-600 text-center">
                Wij respecteren uw privacy. Uw gegevens worden enkel gebruikt om
                contact met u op te nemen.
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
