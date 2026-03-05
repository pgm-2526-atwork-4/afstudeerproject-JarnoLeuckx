type Props = {
  name: string;
  email: string;
  phone: string;
};

export default function CustomerProfileCard({ name, email, phone }: Props) {
  return (
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-3">
      <Info label="Naam" value={name} icon="👤" />
      <Info label="Email" value={email} icon="✉️" />
      <Info label="Telefoon" value={phone} icon="📞" />
    </div>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-white text-sm shadow-sm">
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold text-slate-500">{label}</div>
        <div className="text-sm font-extrabold text-slate-900">
          {value || "-"}
        </div>
      </div>
    </div>
  );
}
