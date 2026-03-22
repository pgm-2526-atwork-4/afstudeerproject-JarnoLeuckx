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
    <div className="flex flex-col md:flex-row items-center gap-8 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-lg">
      <div className="flex flex-col items-center justify-center w-full md:w-auto">
        <div className="flex items-center justify-center">
          <span className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 ring-4 ring-slate-200 shadow-md">
            <img
              src={avatarUrl}
              alt="Profielfoto"
              className="h-28 w-28 rounded-full object-cover border-2 border-white bg-slate-100"
            />
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 text-center">
          Profielfoto
        </div>
      </div>
      <div className="flex-1 w-full mt-6 md:mt-0">
        <div className="grid gap-4 md:grid-cols-3">
          <Info label="Naam" value={name} icon={"\ud83d\udc64"} />
          <Info label="Email" value={email} icon={"\u2709\ufe0f"} />
          <Info label="Telefoon" value={phone} icon={"\ud83d\udcde"} />
        </div>
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
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 min-w-0">
      <div
        className="grid h-9 w-9 place-items-center rounded-lg bg-white text-sm shadow-sm"
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-slate-500">{label}</div>
        <div className="text-sm font-extrabold text-slate-900 break-all">
          {value || "-"}
        </div>
      </div>
    </div>
  );
}
