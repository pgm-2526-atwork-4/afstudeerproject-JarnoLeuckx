type Props = {
  name: string;
  email: string;
  phone: string;
  avatar?: string | null;
};

export default function CustomerProfileCard({
  name,
  email,
  phone,
  avatar,
}: Props) {
  const avatarUrl = avatar || "/image/default-avatar.svg";
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <img
        src={avatarUrl}
        alt="Profielfoto"
        className="w-24 h-24 rounded-full border-2 border-slate-300 object-cover bg-slate-100"
      />
      <div className="grid gap-4 md:grid-cols-3 w-full">
        <Info label="Naam" value={name} icon={"\ud83d\udc64"} />
        <Info label="Email" value={email} icon={"\u2709\ufe0f"} />
        <Info label="Telefoon" value={phone} icon={"\ud83d\udcde"} />
      </div>
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
      <div
        className="grid h-9 w-9 place-items-center rounded-lg bg-white text-sm shadow-sm"
        aria-hidden="true"
      >
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
