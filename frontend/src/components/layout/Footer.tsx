import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const navigationLinks = [
  { label: "Home", to: "/" },
  { label: "Reserveren", to: "/reserveren" },
  { label: "Contact", to: "/contact" },
  { label: "Login", to: "/login" },
];

const serviceLinks = [
  { label: "Rolstoelvervoer", to: "/rolstoelvervoer" },
  { label: "Luchthavenvervoer", to: "/luchthavenvervoer" },
  { label: "Assistentie", to: "/assistentie" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#1d4fb6]/20 bg-[linear-gradient(180deg,#07111f_0%,#0b0b0f_30%,#10203f_100%)] text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr_0.85fr_1fr] lg:gap-8 lg:py-16">
        <div>
          <Link
            to="/"
            className="inline-flex items-center rounded-2xl bg-white px-4 py-3 shadow-[0_10px_30px_rgba(255,255,255,0.08)]"
          >
            <img
              src="/image/logo.png"
              alt="Social Drive"
              className="h-16 w-auto object-contain sm:h-20"
            />
          </Link>

          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
            Betrouwbaar vervoer op maat, met aandacht voor comfort,
            toegankelijkheid en persoonlijke begeleiding van vertrek tot
            bestemming.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/reserveren" className="btn-accent sm:w-auto">
              Plan uw rit
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Contacteer ons
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-blue-200">
            Navigatie
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {navigationLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-slate-300 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-blue-200">
            Diensten
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {serviceLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-slate-300 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-blue-200">
            Contact
          </h3>

          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
              <div>
                <a
                  href="tel:+32470123456"
                  className="font-semibold text-white transition hover:text-blue-200"
                >
                  
                </a>
                <p className="mt-1 text-slate-400"></p>+32 492 32 42 88
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
              <div>
                <a
                  href="mailto:info@socialdrive.be"
                  className="font-semibold text-white transition hover:text-blue-200"
                >
                  info.socialdrive@gmail.com
                </a>
            
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
              <div>
                <p className="font-semibold text-white">Voorbeeldstraat 123</p>
                <p className="mt-1 text-slate-400">2800 Mechelen, België</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} Social Drive. Alle rechten
            voorbehouden.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/contact" className="transition hover:text-white">
              Contact
            </Link>
            <Link to="/reserveren" className="transition hover:text-white">
              Ritaanvraag
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
