import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Plane, Check } from "lucide-react";

export function LuchthavenVervoer() {
  const features: string[] = [
    "Op tijd voor uw vlucht",
    "Directe rit zonder stops",
    "Hulp met bagage",
    "Comfortabele voertuigen",
    "Ervaren chauffeurs",
    "24/7 beschikbaar",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-12">
      
        <div className="text-center mb-12">
          <Plane className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold text-primary mb-4">
            Luchthaven vervoer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Betrouwbaar en comfortabel vervoer naar en van alle luchthavens. Wij
            zorgen ervoor dat u op tijd aankomt.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
        
          <div>
            <div className="bg-white rounded-2xl p-8 mb-8 shadow-md">
              <h2 className="text-2xl font-semibold text-primary mb-6">
                Waarom kiezen voor ons?
              </h2>

              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <h2 className="text-2xl font-semibold text-primary mb-6">
              Boek uw rit
            </h2>

            <form className="space-y-6">
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
                placeholder="+32 000 00 00 00"
              />

              <Input
                id="luchthaven"
                label="Luchthaven"
                type="text"
                placeholder="Selecteer luchthaven"
              />

              <Input
                id="vertrekadres"
                label="Vertrekadres"
                type="text"
                placeholder="Straat, huisnummer, postcode, stad"
              />

           
              <div className="border-t pt-6">
                <p className="font-medium text-primary mb-3">
                  Assistentie nodig?
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                  Indien assistentie gekozen wordt, verschijnt hier extra
                  uitleg.
                </div>
              </div>

              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-primary">Ritinformatie</h4>

                <p className="text-sm text-gray-600">
                  Afstand en prijs worden hier automatisch berekend.
                </p>
              </div>

              
              <div>
                <h3 className="font-medium mb-4 text-primary">
                  Selecteer datum en chauffeur
                </h3>

                <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                  Kalender component komt hier
                </div>
              </div>

            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="accent">Boek nu</Button>

                <Button variant="outline">Offerte aanvragen</Button>
              </div>

              
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
