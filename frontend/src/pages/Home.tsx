import { Link } from "react-router-dom";
import { Plane, Accessibility, Users } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";

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
    <main className="w-full">
      {/* HERO */}
      <section className="px-6 py-24 bg-[radial-gradient(circle_at_top_left,#FFEAC2_0%,#FFFFFF_45%,#EAF3FF_100%)]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl font-bold text-primary leading-tight">
              Persoonlijk vervoer met zorg
            </h1>

            <p className="text-lg text-gray-600 mt-6 leading-relaxed">
              Betrouwbaar en comfortabel vervoer voor mensen met een beperking.
              Wij bieden luchthavenvervoer, rolstoelvervoer en persoonlijke
              assistentie.
            </p>

            {/* CTA is al “future-proof”: later kan dit een echte booking flow starten */}
            <Link
              to="/reserveren"
              className="mt-10 inline-flex items-center justify-center rounded-xl px-10 py-4 bg-accent text-primary font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              aria-label="Ga naar reserveren"
            >
              Plan uw rit
            </Link>
          </div>

          <div
            className="bg-[linear-gradient(135deg,#0B2A5B_0%,#0B4AA3_55%,#1C82F3_100%)] w-full h-[420px] rounded-3xl shadow-xl"
            aria-hidden="true"
          />
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-6 py-24 bg-[linear-gradient(180deg,#FFFFFF_0%,#F1F6FF_100%)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-primary mb-16">
            Onze diensten
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {SERVICES.map((service) => (
              <Link
                key={service.title}
                to={service.link}
                className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-3xl"
                aria-label={`Meer informatie over ${service.title}`}
              >
                <Card className="group border border-primary/10 bg-white/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl h-full">
                  <CardContent className="p-10 flex flex-col h-full">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition">
                      <service.icon className="w-8 h-8 text-primary" />
                    </div>

                    <h3 className="text-2xl font-semibold text-primary mb-4">
                      {service.title}
                    </h3>

                    <p className="text-gray-700 flex-grow leading-relaxed">
                      {service.description}
                    </p>

                    <div className="mt-6 text-accent font-semibold group-hover:translate-x-1 transition-transform">
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
      <section className="w-full py-28 bg-[#EAF2FF]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-20">
            Hoe werkt het?
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className={`${item.bg} rounded-3xl p-10 text-center shadow-md hover:shadow-lg transition`}
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-white text-black border-2 border-primary rounded-full flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>

                <h3 className="text-xl font-semibold text-primary mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-800 leading-relaxed max-w-sm mx-auto">
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
