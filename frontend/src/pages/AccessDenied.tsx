import { Link, useLocation } from "react-router-dom";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { getCurrentUser } from "../auth/auth.api";

type AccessDeniedState = {
  from?: string;
  requiredRole?: "customer" | "driver";
};

const ROLE_LABELS: Record<"customer" | "driver", string> = {
  customer: "klant",
  driver: "chauffeur",
};

export default function AccessDeniedPage() {
  const location = useLocation();
  const user = getCurrentUser();
  const state = (location.state ?? {}) as AccessDeniedState;

  const requiredRoleLabel = state.requiredRole
    ? ROLE_LABELS[state.requiredRole]
    : null;

  return (
    <div className="page-modern">
      <main className="relative mx-auto flex min-h-[72vh] w-full max-w-5xl items-center px-6 py-16">
        <div className="pointer-events-none absolute -left-6 top-16 h-44 w-44 rounded-full bg-[#0043A8]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-8 bottom-8 h-56 w-56 rounded-full bg-slate-900/10 blur-3xl" />

        <section className="surface-card-strong relative w-full overflow-hidden rounded-3xl border border-[#dbe7fb]">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#003688] via-[#0a5bd3] to-[#0043A8]" />

          <div className="p-8 md:p-12">
            <div className="text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#cfe0ff] bg-[#edf4ff] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#0043A8]">
                <ShieldAlert className="h-4 w-4" />
                Toegang geweigerd
              </div>

              <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                Je hebt geen rechten voor deze pagina
              </h1>

              <p className="mb-6 max-w-xl text-base text-slate-600">
                Deze route is afgeschermd op basis van gebruikersrol.
                {requiredRoleLabel
                  ? ` Alleen gebruikers met rol ${requiredRoleLabel} kunnen deze pagina openen.`
                  : ""}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {user ? (
                  <Link
                    to={
                      user.role === "driver"
                        ? "/driver/account"
                        : "/customer/account"
                    }
                    className="btn-accent"
                  >
                    Naar mijn account
                  </Link>
                ) : (
                  <Link to="/login" className="btn-accent">
                    Inloggen
                  </Link>
                )}

                <Link
                  to="/"
                  className="btn-outline inline-flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Naar home
                </Link>

                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="btn-ghost inline-flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Ga terug
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
