import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "./auth.api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanEmail = email.trim();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError("Geef een geldig e-mailadres in.");
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const data = await requestPasswordReset(cleanEmail);
      setSuccess(data.message);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Resetmail aanvragen mislukt.",
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
            Wachtwoord vergeten
          </h1>
          <p className="mb-6 text-sm text-slate-600">
            Geef je e-mailadres in. Als er een account bestaat, sturen we een
            resetlink.
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

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Bezig..." : "Resetmail versturen"}
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
