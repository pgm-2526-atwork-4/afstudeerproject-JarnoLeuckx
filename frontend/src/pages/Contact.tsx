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
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8E8] via-white to-[#E8F2FF]">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Contact</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Heeft u vragen of wilt u meer informatie? Neem gerust contact met
            ons op. We helpen u graag verder.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <div className="bg-white/95 rounded-2xl p-8 mb-8 shadow-md border border-primary/15">
              <h2 className="text-2xl font-semibold text-primary mb-6">
                Contactgegevens
              </h2>

              <div className="space-y-6">
                {INFO.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10"
                  >
                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 shadow-sm">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary mb-1">
                        {item.title}
                      </h3>

                      <div className="space-y-1">
                        {item.lines.map((line) => (
                          <p key={line} className="text-gray-800">
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
            <div className="rounded-2xl p-8 shadow-lg border border-primary/20 bg-gradient-to-br from-primary to-[#0D3B8D] text-white">
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
          <div className="bg-white/95 rounded-2xl p-8 shadow-md border border-primary/15">
            <h2 className="text-2xl font-semibold text-primary mb-6">
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
                  className="h-11 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
                  className="min-h-[160px] w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-400"
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
