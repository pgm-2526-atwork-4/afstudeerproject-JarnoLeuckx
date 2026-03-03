import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, register, saveAuth } from "./auth.api";

type AuthPageProps = {
  mode: "login" | "register";
};

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerStreet, setRegisterStreet] = useState("");
  const [registerPostalCode, setRegisterPostalCode] = useState("");
  const [registerCity, setRegisterCity] = useState("");
  const [registerVaphNumber, setRegisterVaphNumber] = useState("");
  const [registerRole, setRegisterRole] = useState<"customer" | "driver">(
    "customer",
  );
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirmation, setRegisterPasswordConfirmation] =
    useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const data = await login(email, password);
      saveAuth(data.token, data.user);

      if (data.user.role === "driver") {
        navigate("/driver/account");
        return;
      }

      if (data.user.role === "customer") {
        navigate("/customer/account");
        return;
      }

      navigate("/");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login mislukt.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRegisterError(null);
    setRegisterSuccess(null);
    setRegisterLoading(true);

    const customerAddress =
      registerRole === "customer"
        ? `${registerStreet.trim()}, ${registerPostalCode.trim()} ${registerCity.trim()}`.trim()
        : undefined;

    try {
      const data = await register({
        name: registerName,
        email: registerEmail,
        phone: registerPhone,
        address: customerAddress,
        vaph_number:
          registerRole === "customer" ? registerVaphNumber : undefined,
        role: registerRole,
        password: registerPassword,
        password_confirmation: registerPasswordConfirmation,
      });

      setRegisterSuccess(data.message);
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPhone("");
      setRegisterStreet("");
      setRegisterPostalCode("");
      setRegisterCity("");
      setRegisterVaphNumber("");
      setRegisterPassword("");
      setRegisterPasswordConfirmation("");
      setEmail(registerEmail);
    } catch (err) {
      setRegisterError(
        err instanceof Error ? err.message : "Registratie mislukt.",
      );
    } finally {
      setRegisterLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900">
          {mode === "login" ? "Inloggen" : "Registreren"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {mode === "login"
            ? "Log in op je bestaande account."
            : "Maak een nieuw account aan."}
        </p>
      </div>

      {mode === "login" ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-extrabold text-slate-900">
            Inloggen
          </h2>

          {loginError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="grid gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-700">
                E-mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-400"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-700">
                Wachtwoord
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-400"
              />
            </label>

            <button
              type="submit"
              disabled={loginLoading}
              className="mt-1 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loginLoading ? "Bezig..." : "Inloggen"}
            </button>

            <p className="text-sm text-slate-600">
              Nog geen account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#0043A8] underline underline-offset-2"
              >
                Registreer hier
              </Link>
            </p>
          </form>
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-extrabold text-slate-900">
            Registreren
          </h2>

          {registerError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {registerError}
            </div>
          )}

          {registerSuccess && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {registerSuccess}
            </div>
          )}

          <form onSubmit={handleRegister} className="grid gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-700">Naam</span>
              <input
                type="text"
                required
                value={registerName}
                onChange={(event) => setRegisterName(event.target.value)}
                className="h-11 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-400"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-700">
                E-mail
              </span>
              <input
                type="email"
                required
                value={registerEmail}
                onChange={(event) => setRegisterEmail(event.target.value)}
                className="h-11 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-400"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-700">
                Telefoon
              </span>
              <input
                type="tel"
                value={registerPhone}
                onChange={(event) => setRegisterPhone(event.target.value)}
                className="h-11 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-400"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-700">Rol</span>
              <select
                value={registerRole}
                onChange={(event) =>
                  setRegisterRole(event.target.value as "customer" | "driver")
                }
                className="h-11 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-400"
              >
                <option value="customer">Klant</option>
                <option value="driver">Chauffeur</option>
              </select>
            </label>

            {registerRole === "customer" && (
              <>
                <label className="grid gap-1">
                  <span className="text-sm font-semibold text-slate-700">
                    Straat
                  </span>
                  <input
                    type="text"
                    required
                    value={registerStreet}
                    onChange={(event) => setRegisterStreet(event.target.value)}
                    className="h-11 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-400"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-sm font-semibold text-slate-700">
                    Postcode
                  </span>
                  <input
                    type="text"
                    required
                    value={registerPostalCode}
                    onChange={(event) =>
                      setRegisterPostalCode(event.target.value)
                    }
                    className="h-11 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-400"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-sm font-semibold text-slate-700">
                    Gemeente
                  </span>
                  <input
                    type="text"
                    required
                    value={registerCity}
                    onChange={(event) => setRegisterCity(event.target.value)}
                    className="h-11 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-400"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-sm font-semibold text-slate-700">
                    VAPH-nummer
                  </span>
                  <input
                    type="text"
                    value={registerVaphNumber}
                    onChange={(event) =>
                      setRegisterVaphNumber(event.target.value)
                    }
                    className="h-11 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-400"
                  />
                </label>
              </>
            )}

            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-700">
                Wachtwoord
              </span>
              <input
                type="password"
                minLength={8}
                required
                value={registerPassword}
                onChange={(event) => setRegisterPassword(event.target.value)}
                className="h-11 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-400"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-semibold text-slate-700">
                Herhaal wachtwoord
              </span>
              <input
                type="password"
                minLength={8}
                required
                value={registerPasswordConfirmation}
                onChange={(event) =>
                  setRegisterPasswordConfirmation(event.target.value)
                }
                className="h-11 rounded-lg border border-slate-300 px-3 outline-none transition focus:border-slate-400"
              />
            </label>

            <button
              type="submit"
              disabled={registerLoading}
              className="mt-1 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {registerLoading ? "Bezig..." : "Account aanmaken"}
            </button>

            <p className="text-sm text-slate-600">
              Heb je al een account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#0043A8] underline underline-offset-2"
              >
                Log hier in
              </Link>
            </p>
          </form>
        </section>
      )}
    </div>
  );
}
