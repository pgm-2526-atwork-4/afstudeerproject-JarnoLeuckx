import Button from "./Button";

export default function ServiceLayout({
  title,
  buttonLabel,
}: {
  title: string;
  buttonLabel: string;
}) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <h1 className="mb-10 text-3xl font-bold text-primary">{title}</h1>

      <div className="space-y-5">
        <div className="h-10 rounded-lg bg-secondary/10" />
        <div className="h-10 rounded-lg bg-secondary/10" />
        <div className="h-10 rounded-lg bg-secondary/10" />
      </div>

      <Button className="mt-10 w-64">{buttonLabel}</Button>
    </div>
  );
}