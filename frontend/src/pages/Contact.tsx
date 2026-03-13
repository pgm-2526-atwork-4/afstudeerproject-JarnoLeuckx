import { useState } from "react";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Mail, Phone, MapPin, Clock, AlertCircle } from "lucide-react";
import { sendContactMessage } from "../lib/contact.api";
import { getCurrentUser } from "../auth/auth.api";

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
  | "klacht"
  | "compliment"
  | "prijzen"
  | "anders";

type ServiceType = "" | "luchthaven" | "rolstoel" | "medisch" | "assistentie";

export default function ContactPage() {
  const currentUser = getCurrentUser();
  const [name, setName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [phone, setPhone] = useState(currentUser?.phone ?? "");
  const [subject, setSubject] = useState<SubjectOption>("");
  const [message, setMessage] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [returnTrip, setReturnTrip] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPrijzenOfferte = subject === "prijzen";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!subject) {
      setFormError("Kies eerst een onderwerp.");
      return;
    }

    if (isPrijzenOfferte) {
      if (!serviceType || !pickupAddress || !dropoffAddress || !travelDate) {
        setFormError(
          "Vul de dienst, ophaallocatie, bestemming en reisdatum in.",
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await sendContactMessage({
        request_type: isPrijzenOfferte ? "offerte" : "contact",
        name,
        email,
        phone: phone || undefined,
        subject,
        service_type: isPrijzenOfferte ? serviceType : undefined,
        pickup_address: isPrijzenOfferte ? pickupAddress : undefined,
        dropoff_address: isPrijzenOfferte ? dropoffAddress : undefined,
        travel_date: isPrijzenOfferte ? travelDate : undefined,
        return_trip: isPrijzenOfferte ? returnTrip : undefined,
        passengers:
          isPrijzenOfferte && passengers ? Number(passengers) : undefined,
        message:
          isPrijzenOfferte && returnTrip && returnDate
            ? `${message}\n\nGewenste retourdatum: ${returnDate}`
            : message,
      });

      setFormSuccess(response.message);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      setServiceType("");
      setPickupAddress("");
      setDropoffAddress("");
      setTravelDate("");
      setReturnTrip(false);
      setReturnDate("");
      setPassengers("");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Bericht verzenden mislukt.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-modern">
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="section-title mb-4">Contact</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Heeft u vragen of wilt u meer informatie? Neem gerust contact met
            ons op. We helpen u graag verder.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Contact info */}
          <div>
            <div className="surface-card-strong mb-8 p-6 md:p-8">
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
            <div className="rounded-2xl border border-[#1d4fb6] bg-[linear-gradient(135deg,#0b0b0f_0%,#0f1c3d_55%,#0043A8_100%)] p-6 text-white shadow-lg md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
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
          <div className="surface-card-strong p-6 md:p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {isPrijzenOfferte
                ? "Vraag een prijsofferte aan"
                : "Stuur ons een bericht"}
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {formError && <div className="form-alert-error">{formError}</div>}
              {formSuccess && (
                <div className="form-alert-success">{formSuccess}</div>
              )}

              <Input
                id="naam"
                name="name"
                label="Volledige naam"
                type="text"
                placeholder="Uw naam"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />

              <Input
                id="email"
                name="email"
                label="E-mailadres"
                type="email"
                placeholder="naam@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <Input
                id="telefoon"
                name="phone"
                label="Telefoonnummer"
                type="tel"
                placeholder="+32 ..."
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-primary">
                  Onderwerp
                </span>

                <select
                  name="subject"
                  value={subject}
                  onChange={(event) =>
                    setSubject(event.target.value as SubjectOption)
                  }
                  className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 outline-none transition-all focus-visible:border-[#0043A8] focus-visible:ring-2 focus-visible:ring-[#0043A8]/30"
                  required
                >
                  <option value="" disabled>
                    Selecteer een onderwerp
                  </option>
                  <option value="algemeen">Algemene vraag</option>
                  <option value="boeking">Boeking wijzigen</option>
                  <option value="klacht">Klacht</option>
                  <option value="compliment">Compliment</option>
                  <option value="prijzen">Prijsinformatie</option>
                  <option value="anders">Anders</option>
                </select>
              </label>

              {isPrijzenOfferte && (
                <>
                  <p className="rounded-xl border border-[#0043A8]/20 bg-[#0043A8]/5 px-4 py-3 text-sm text-[#0043A8] font-medium">
                    Vul de onderstaande gegevens in en we bezorgen u snel een
                    prijsofferte op maat.
                  </p>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-primary">
                      Dienst
                    </span>
                    <select
                      name="serviceType"
                      value={serviceType}
                      onChange={(event) =>
                        setServiceType(event.target.value as ServiceType)
                      }
                      className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 outline-none transition-all focus-visible:border-[#0043A8] focus-visible:ring-2 focus-visible:ring-[#0043A8]/30"
                      required
                    >
                      <option value="" disabled>
                        Selecteer een dienst
                      </option>
                      <option value="luchthaven">Luchthavenvervoer</option>
                      <option value="rolstoel">Rolstoelvervoer</option>
                      <option value="medisch">Medisch vervoer</option>
                      <option value="assistentie">Assistentie</option>
                    </select>
                  </label>

                  <Input
                    id="pickupAddress"
                    name="pickupAddress"
                    label="Ophaallocatie"
                    type="text"
                    placeholder="Straat, nummer, stad"
                    value={pickupAddress}
                    onChange={(event) => setPickupAddress(event.target.value)}
                    required
                  />

                  <Input
                    id="dropoffAddress"
                    name="dropoffAddress"
                    label="Bestemming"
                    type="text"
                    placeholder="Straat, nummer, stad"
                    value={dropoffAddress}
                    onChange={(event) => setDropoffAddress(event.target.value)}
                    required
                  />

                  <Input
                    id="travelDate"
                    name="travelDate"
                    label="Gewenste reisdatum"
                    type="date"
                    value={travelDate}
                    onChange={(event) => setTravelDate(event.target.value)}
                    required
                  />

                  <Input
                    id="passengers"
                    name="passengers"
                    label="Aantal passagiers (optioneel)"
                    type="number"
                    min={1}
                    max={20}
                    value={passengers}
                    onChange={(event) => setPassengers(event.target.value)}
                  />

                  <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <input
                      type="checkbox"
                      name="returnTrip"
                      checked={returnTrip}
                      onChange={(event) => {
                        setReturnTrip(event.target.checked);
                        if (!event.target.checked) setReturnDate("");
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-[#0043A8] focus:ring-[#0043A8]/40"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Ik wens ook een retourrit
                    </span>
                  </label>

                  {returnTrip && (
                    <Input
                      id="returnDate"
                      name="returnDate"
                      label="Gewenste retourdatum"
                      type="date"
                      value={returnDate}
                      onChange={(event) => setReturnDate(event.target.value)}
                      required
                    />
                  )}
                </>
              )}

              {/* Bericht */}
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-primary">
                  Bericht
                </span>
                <textarea
                  name="message"
                  placeholder="Typ hier uw bericht..."
                  className="min-h-[160px] w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none transition-all focus-visible:border-[#0043A8] focus-visible:ring-2 focus-visible:ring-[#0043A8]/30 placeholder:text-slate-400"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                />
              </label>

              <Button
                variant="accent"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isPrijzenOfferte
                    ? "Offerteaanvraag wordt verzonden..."
                    : "Bericht wordt verzonden..."
                  : isPrijzenOfferte
                    ? "Verstuur offerteaanvraag"
                    : "Verstuur bericht"}
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
