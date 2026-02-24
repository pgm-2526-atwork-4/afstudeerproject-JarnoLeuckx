import Button from "../components/ui/Button";

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-primary">{label}</span>
      <input
        type={type}
        className="h-11 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
    </label>
  );
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-10 text-center text-3xl font-bold text-primary">
        Contact
      </h1>

      <form className="space-y-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Field label="Voornaam" />
          <Field label="Naam" />
          <Field label="E-mail" type="email" />
          <Field label="Telefoonnummer" />
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold text-primary">Uw bericht</span>
          <textarea
            className="h-48 w-full rounded-lg border border-secondary/20 bg-secondary/5 px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </label>

        <Button className="w-64">Verstuur</Button>
      </form>
    </div>
  );
}