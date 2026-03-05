import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, register, saveAuth } from "./auth.api";

type AuthPageProps = {
  mode: "login" | "register";
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+0-9()\-\s]{8,20}$/;
const POSTCODE_REGEX = /^[0-9]{4}$/;

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

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      setLoginError("Geef een geldig e-mailadres in.");
      return;
    }

    if (!cleanPassword) {
      setLoginError("Wachtwoord is verplicht.");
      return;
    }

    setLoginError(null);
    setLoginLoading(true);

    try {
      const data = await login(cleanEmail, cleanPassword);
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

    const cleanName = registerName.trim();
    const cleanEmail = registerEmail.trim();
    const cleanPhone = registerPhone.trim();
    const cleanStreet = registerStreet.trim();
    const cleanPostalCode = registerPostalCode.trim();
    const cleanCity = registerCity.trim();
    const cleanVaph = registerVaphNumber.trim();

    if (cleanName.length < 2) {
      setRegisterError("Naam moet minstens 2 tekens bevatten.");
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setRegisterError("Geef een geldig e-mailadres in.");
      return;
    }

    if (cleanPhone && !PHONE_REGEX.test(cleanPhone)) {
      setRegisterError("Geef een geldig telefoonnummer in.");
      return;
    }

    if (registerRole === "customer") {
      if (!cleanStreet || !cleanCity || !cleanPostalCode) {
        setRegisterError("Straat, postcode en gemeente zijn verplicht.");
        return;
      }

      if (!POSTCODE_REGEX.test(cleanPostalCode)) {
        setRegisterError("Postcode moet uit 4 cijfers bestaan.");
        return;
      }
    }

    if (registerPassword.length < 8) {
      setRegisterError("Wachtwoord moet minstens 8 tekens bevatten.");
      return;
    }

    if (registerPassword !== registerPasswordConfirmation) {
      setRegisterError("Wachtwoorden komen niet overeen.");
      return;
    }

    setRegisterError(null);
    setRegisterSuccess(null);
    setRegisterLoading(true);

    const customerAddress =
      registerRole === "customer"
        ? `${cleanStreet}, ${cleanPostalCode} ${cleanCity}`.trim()
        : undefined;

    try {
      const data = await register({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone || undefined,
        address: customerAddress,
        vaph_number:
          registerRole === "customer" ? cleanVaph || undefined : undefined,
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
      setEmail(cleanEmail);
    } catch (err) {
      setRegisterError(
        err instanceof Error ? err.message : "Registratie mislukt.",
      );
    } finally {
      setRegisterLoading(false);
    }
  }

  return (
    <div className="page-modern">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-6 surface-card p-6">
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
          <section className="surface-card-strong p-6">
            <h2 className="mb-4 text-xl font-extrabold text-slate-900">
              Inloggen
            </h2>
            <p className="mb-4 text-sm text-slate-600">
              Velden met <span className="form-required">*</span> zijn
              verplicht.
            </p>

            {loginError && (
              <div
                id="login-error"
                role="alert"
                aria-live="assertive"
                className="form-alert-error mb-4"
              >
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="form-layout">
              <label className="grid gap-1.5">
                <span className="form-label">
                  E-mail<span className="form-required">*</span>
                </span>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  aria-invalid={Boolean(loginError)}
                  aria-describedby={loginError ? "login-error" : undefined}
                  className="form-input"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="form-label">
                  Wachtwoord<span className="form-required">*</span>
                </span>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  aria-invalid={Boolean(loginError)}
                  aria-describedby={loginError ? "login-error" : undefined}
                  className="form-input"
                />
                <span className="form-help">
                  Gebruik je account wachtwoord.
                </span>
              </label>

              <button
                type="submit"
                disabled={loginLoading}
                className="btn-primary mt-1"
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
          <section className="surface-card-strong p-6">
            <h2 className="mb-4 text-xl font-extrabold text-slate-900">
              Registreren
            </h2>
            <p className="mb-4 text-sm text-slate-600">
              Velden met <span className="form-required">*</span> zijn
              verplicht.
            </p>

            {registerError && (
              <div
                id="register-error"
                role="alert"
                aria-live="assertive"
                className="form-alert-error mb-4"
              >
                {registerError}
              </div>
            )}

            {registerSuccess && (
              <div
                role="status"
                aria-live="polite"
                className="form-alert-success mb-4"
              >
                {registerSuccess}
              </div>
            )}

            <form onSubmit={handleRegister} className="form-layout">
              <div className="form-section">
                <h3 className="form-section-title">Persoonlijke gegevens</h3>
                <p className="form-section-subtitle">
                  Vul je basisinformatie in zodat we je account correct kunnen
                  aanmaken.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1.5 md:col-span-2">
                    <span className="form-label">
                      Naam<span className="form-required">*</span>
                    </span>
                    <input
                      id="register-name"
                      type="text"
                      required
                      value={registerName}
                      onChange={(event) => setRegisterName(event.target.value)}
                      autoComplete="name"
                      aria-invalid={Boolean(registerError)}
                      aria-describedby={
                        registerError ? "register-error" : undefined
                      }
                      className="form-input"
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="form-label">
                      E-mail<span className="form-required">*</span>
                    </span>
                    <input
                      id="register-email"
                      type="email"
                      required
                      value={registerEmail}
                      onChange={(event) => setRegisterEmail(event.target.value)}
                      autoComplete="email"
                      aria-invalid={Boolean(registerError)}
                      aria-describedby={
                        registerError ? "register-error" : undefined
                      }
                      className="form-input"
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="form-label">Telefoon</span>
                    <input
                      id="register-phone"
                      type="tel"
                      value={registerPhone}
                      onChange={(event) => setRegisterPhone(event.target.value)}
                      autoComplete="tel"
                      aria-invalid={Boolean(registerError)}
                      aria-describedby={
                        registerError ? "register-error" : undefined
                      }
                      className="form-input"
                    />
                    <span className="form-help">
                      Optioneel, maar handig voor snelle opvolging.
                    </span>
                  </label>

                  <label className="grid gap-1.5 md:col-span-2">
                    <span className="form-label">Rol</span>
                    <select
                      id="register-role"
                      value={registerRole}
                      onChange={(event) =>
                        setRegisterRole(
                          event.target.value as "customer" | "driver",
                        )
                      }
                      aria-invalid={Boolean(registerError)}
                      aria-describedby={
                        registerError ? "register-error" : undefined
                      }
                      className="form-select"
                    >
                      <option value="customer">Klant</option>
                      <option value="driver">Chauffeur</option>
                    </select>
                  </label>
                </div>
              </div>

              {registerRole === "customer" && (
                <div className="form-section">
                  <h3 className="form-section-title">Adresgegevens</h3>
                  <p className="form-section-subtitle">
                    Dit adres gebruiken we als basis voor je ritaanvragen.
                  </p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="grid gap-1.5 md:col-span-3">
                      <span className="form-label">
                        Straat<span className="form-required">*</span>
                      </span>
                      <input
                        id="register-street"
                        type="text"
                        required
                        value={registerStreet}
                        onChange={(event) =>
                          setRegisterStreet(event.target.value)
                        }
                        autoComplete="street-address"
                        aria-invalid={Boolean(registerError)}
                        aria-describedby={
                          registerError ? "register-error" : undefined
                        }
                        className="form-input"
                      />
                    </label>

                    <label className="grid gap-1.5">
                      <span className="form-label">
                        Postcode<span className="form-required">*</span>
                      </span>
                      <input
                        id="register-postcode"
                        type="text"
                        required
                        value={registerPostalCode}
                        onChange={(event) =>
                          setRegisterPostalCode(event.target.value)
                        }
                        autoComplete="postal-code"
                        aria-invalid={Boolean(registerError)}
                        aria-describedby={
                          registerError ? "register-error" : undefined
                        }
                        className="form-input"
                      />
                    </label>

                    <label className="grid gap-1.5 md:col-span-2">
                      <span className="form-label">
                        Gemeente<span className="form-required">*</span>
                      </span>
                      <input
                        id="register-city"
                        type="text"
                        required
                        value={registerCity}
                        onChange={(event) =>
                          setRegisterCity(event.target.value)
                        }
                        autoComplete="address-level2"
                        aria-invalid={Boolean(registerError)}
                        aria-describedby={
                          registerError ? "register-error" : undefined
                        }
                        className="form-input"
                      />
                    </label>

                    <label className="grid gap-1.5 md:col-span-3">
                      <span className="form-label">VAPH-nummer</span>
                      <input
                        id="register-vaph"
                        type="text"
                        value={registerVaphNumber}
                        onChange={(event) =>
                          setRegisterVaphNumber(event.target.value)
                        }
                        aria-invalid={Boolean(registerError)}
                        aria-describedby={
                          registerError ? "register-error" : undefined
                        }
                        className="form-input"
                      />
                      <span className="form-help">
                        Alleen invullen indien van toepassing.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              <div className="form-section">
                <h3 className="form-section-title">Account beveiliging</h3>
                <p className="form-section-subtitle">
                  Kies een sterk wachtwoord van minstens 8 tekens.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1.5">
                    <span className="form-label">
                      Wachtwoord<span className="form-required">*</span>
                    </span>
                    <input
                      id="register-password"
                      type="password"
                      minLength={8}
                      required
                      value={registerPassword}
                      onChange={(event) =>
                        setRegisterPassword(event.target.value)
                      }
                      autoComplete="new-password"
                      aria-invalid={Boolean(registerError)}
                      aria-describedby={
                        registerError ? "register-error" : undefined
                      }
                      className="form-input"
                    />
                  </label>

                  <label className="grid gap-1.5">
                    <span className="form-label">
                      Herhaal wachtwoord<span className="form-required">*</span>
                    </span>
                    <input
                      id="register-password-confirmation"
                      type="password"
                      minLength={8}
                      required
                      value={registerPasswordConfirmation}
                      onChange={(event) =>
                        setRegisterPasswordConfirmation(event.target.value)
                      }
                      autoComplete="new-password"
                      aria-invalid={Boolean(registerError)}
                      aria-describedby={
                        registerError ? "register-error" : undefined
                      }
                      className="form-input"
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={registerLoading}
                className="btn-primary mt-1"
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
    </div>
  );
}
