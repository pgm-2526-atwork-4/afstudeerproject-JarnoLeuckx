import { Link } from "react-router-dom";
import { Plane, Accessibility, Users } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

type Service = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
};

type HowItWorksStep = {
  step: 1 | 2 | 3;
  title: string;
  description: string;
  bg: string;
};

const SERVICES: Service[] = [
  {
    title: "Luchthaven vervoer",
    description:
      "Comfortabel en betrouwbaar vervoer naar en van de luchthaven.",
    icon: Plane,
    link: "/luchthavenvervoer",
  },
  {
    title: "Rolstoel vervoer",
    description:
      "Gespecialiseerd vervoer voor rolstoelgebruikers met aangepaste voertuigen.",
    icon: Accessibility,
    link: "/rolstoelvervoer",
  },
  {
    title: "Assistentie",
    description: "Extra begeleiding en ondersteuning tijdens uw reis.",
    icon: Users,
    link: "/assistentie",
  },
];

const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    step: 1,
    title: "Boek uw rit",
    description:
      "Vul eenvoudig het online formulier in met uw gegevens en gewenste datum.",
    bg: "bg-[#FFF4DB]",
  },
  {
    step: 2,
    title: "Bevestiging",
    description:
      "U ontvangt een bevestiging met alle details van uw chauffeur en rit.",
    bg: "bg-[#E3F0FF]",
  },
  {
    step: 3,
    title: "Geniet van uw reis",
    description:
      "Onze chauffeur brengt u veilig en comfortabel naar uw bestemming.",
    bg: "bg-[#E8F8F0]",
  },
];

export function Home() {
  return (
    <main className="page-modern w-full">
      {/* HERO */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto rounded-3xl border border-[#1f335e] bg-[linear-gradient(130deg,#0A0A0E_0%,#0E1A39_52%,#0043A8_100%)] p-6 sm:p-10 md:p-14 shadow-[0_20px_50px_rgba(2,6,23,0.28)]">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
            <div className="max-w-xl">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-100">
                Premium taxidienst
              </span>

              <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                Persoonlijk vervoer met zorg
              </h1>

              <p className="mt-6 text-base leading-relaxed text-blue-100/90 sm:text-lg">
                Betrouwbaar en comfortabel vervoer voor mensen met een
                beperking. Wij bieden luchthavenvervoer, rolstoelvervoer en
                persoonlijke assistentie.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/reserveren"
                  className="btn-primary w-full border-white/20 bg-white px-6 py-3 text-base text-slate-900 hover:bg-slate-100 sm:w-auto sm:px-8"
                  aria-label="Ga naar reserveren"
                >
                  Plan uw rit
                </Link>
                <Link
                  to="/contact"
                  className="btn-outline w-full border-white/30 bg-white/10 px-6 py-3 text-base text-white hover:bg-white/20 sm:w-auto sm:px-8"
                  aria-label="Ga naar contact"
                >
                  Contacteer ons
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-100/80">
                  Altijd op tijd
                </p>
                <p className="mt-1 text-2xl font-black text-white">
                  24/7 beschikbaar
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-100/80">
                  Gespecialiseerd vervoer
                </p>
                <p className="mt-1 text-2xl font-black text-white">
                  Rolstoel & assistentie
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-100/80">
                  Klantgericht
                </p>
                <p className="mt-1 text-2xl font-black text-white">
                  Persoonlijke service
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title text-center mb-10 sm:mb-16">
            Onze diensten
          </h2>

          <div className="grid gap-6 md:grid-cols-3 md:gap-10">
            {SERVICES.map((service) => (
              <Link
                key={service.title}
                to={service.link}
                className="block focus:outline-none focus:ring-2 focus:ring-[#0043A8] focus:ring-offset-2 rounded-3xl"
                aria-label={`Meer informatie over ${service.title}`}
              >
                <Card className="group surface-card-strong rounded-3xl h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <CardContent className="flex h-full flex-col p-6 sm:p-8 md:p-10">
                    <div className="brand-badge w-16 h-16 mb-6 transition group-hover:bg-[#dcecff]">
                      <service.icon className="w-8 h-8 text-[#0043A8]" />
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      {service.title}
                    </h3>

                    <p className="text-slate-600 flex-grow leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mt-6 text-[#0043A8] font-semibold group-hover:translate-x-1 transition-transform">
                      Meer informatie →
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full border-y border-[#dbe7ff] bg-[#f3f7ff] py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="section-title text-center mb-10 md:text-5xl sm:mb-16">
            Hoe werkt het?
          </h2>

          <div className="grid gap-6 md:grid-cols-3 md:gap-12">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="surface-card rounded-3xl p-6 text-center transition hover:shadow-lg sm:p-8 md:p-10"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-slate-900 text-white border-2 border-slate-900 rounded-full flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {item.title}
                </h3>

                <p className="text-slate-600 leading-relaxed max-w-sm mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
