import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "./auth.api";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const initialEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setError("De resetlink is ongeldig of onvolledig.");
      return;
    }

    if (password.length < 8) {
      setError("Wachtwoord moet minstens 8 tekens bevatten.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Wachtwoorden komen niet overeen.");
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const data = await resetPassword({
        token,
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess(data.message);

      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Wachtwoord resetten mislukt.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-modern">
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <section className="surface-card-strong p-6">
          <h1 className="mb-2 text-3xl font-black text-slate-900">
            Nieuw wachtwoord instellen
          </h1>
          <p className="mb-6 text-sm text-slate-600">
            Kies een nieuw wachtwoord voor je account.
          </p>

          {error && (
            <div className="form-alert-error mb-4" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="form-alert-success mb-4" role="status">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-layout">
            <label className="grid gap-1.5">
              <span className="form-label">
                E-mail<span className="form-required">*</span>
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="form-input"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="form-label">
                Nieuw wachtwoord<span className="form-required">*</span>
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  className="form-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500 hover:text-slate-700"
                  aria-label={
                    showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"
                  }
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <label className="grid gap-1.5">
              <span className="form-label">
                Bevestig wachtwoord<span className="form-required">*</span>
              </span>
              <div className="relative">
                <input
                  type={showPasswordConfirmation ? "text" : "password"}
                  required
                  value={passwordConfirmation}
                  onChange={(event) =>
                    setPasswordConfirmation(event.target.value)
                  }
                  autoComplete="new-password"
                  className="form-input pr-12"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordConfirmation((current) => !current)
                  }
                  className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500 hover:text-slate-700"
                  aria-label={
                    showPasswordConfirmation
                      ? "Verberg wachtwoordbevestiging"
                      : "Toon wachtwoordbevestiging"
                  }
                >
                  {showPasswordConfirmation ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </label>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Bezig..." : "Wachtwoord opslaan"}
            </button>

            <p className="text-sm text-slate-600">
              Terug naar{" "}
              <Link
                to="/login"
                className="font-semibold text-[#0043A8] underline underline-offset-2"
              >
                inloggen
              </Link>
              .
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
