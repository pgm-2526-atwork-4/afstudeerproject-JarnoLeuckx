import { useNavigate } from "react-router-dom";
import { logout } from "../../auth/auth.api";

type Props = {
  name: string;
};

export default function CustomerHeaderBar({ name }: Props) {
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="h-16 bg-slate-900 px-5 text-white">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/15 text-base font-black">
            👤
          </div>
          <div>
            <div className="text-sm font-black">Mijn Dashboard</div>
            <div className="text-xs text-slate-200">Welkom, {name}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-sm text-white/90 no-underline hover:text-white"
          >
            Naar website
          </a>
          <button
            className="rounded-md border border-white/30 px-3 py-1.5 text-sm font-bold text-white transition hover:bg-white/10"
            onClick={() => {
              void handleLogout();
            }}
          >
            Uitloggen
          </button>
        </div>
      </div>
    </div>
  );
}
