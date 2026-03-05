import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearAuth,
  deleteMe,
  getCurrentUser,
  setCurrentUser,
  updateMe,
} from "../auth/auth.api";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CustomerSettingsPage() {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [phone, setPhone] = useState(currentUser?.phone ?? "");
  const [address, setAddress] = useState(currentUser?.address ?? "");
  const [vaphNumber, setVaphNumber] = useState(currentUser?.vaph_number ?? "");

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const [deletePassword, setDeletePassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 2) {
      setSaveError("Naam moet minstens 2 tekens bevatten.");
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setSaveError("Geef een geldig e-mailadres in.");
      return;
    }

    setSaveLoading(true);

    try {
      const result = await updateMe({
        name: cleanName,
        email: cleanEmail,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        vaph_number: vaphNumber.trim() || undefined,
      });

      setCurrentUser(result.user);
      setSaveSuccess("Je gegevens zijn opgeslagen.");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Opslaan mislukt.");
    } finally {
      setSaveLoading(false);
    }
  }

  async function handleDeleteAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDeleteError(null);

    if (!confirmDelete) {
      setDeleteError("Bevestig dat je je account wil verwijderen.");
      return;
    }

    if (!deletePassword.trim()) {
      setDeleteError("Geef je wachtwoord in om te verwijderen.");
      return;
    }

    setDeleteLoading(true);

    try {
      await deleteMe(deletePassword.trim());
      clearAuth();
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Account verwijderen mislukt.",
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="page-modern">
      <div className="mx-auto w-full max-w-4xl px-6 py-8">
        <div className="mb-6 surface-card-strong p-6">
          <h1 className="text-3xl font-black text-slate-900">Mijn gegevens</h1>
          <p className="mt-1 text-sm text-slate-600">
            Werk je profielgegevens bij of verwijder je account indien gewenst.
          </p>
        </div>

        <section className="surface-card p-6">
          <h2 className="text-xl font-extrabold text-slate-900">
            Gegevens aanpassen
          </h2>

          <form onSubmit={handleSave} className="form-layout mt-4">
            {saveError && <div className="form-alert-error">{saveError}</div>}
            {saveSuccess && (
              <div className="form-alert-success">{saveSuccess}</div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1.5 md:col-span-2">
                <span className="form-label">
                  Naam<span className="form-required">*</span>
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="form-input"
                  required
                />
              </label>

              <label className="grid gap-1.5">
                <span className="form-label">
                  E-mail<span className="form-required">*</span>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="form-input"
                  required
                />
              </label>

              <label className="grid gap-1.5">
                <span className="form-label">Telefoon</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="form-input"
                />
              </label>

              <label className="grid gap-1.5 md:col-span-2">
                <span className="form-label">Adres</span>
                <input
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className="form-input"
                />
              </label>

              <label className="grid gap-1.5 md:col-span-2">
                <span className="form-label">VAPH-nummer</span>
                <input
                  value={vaphNumber}
                  onChange={(event) => setVaphNumber(event.target.value)}
                  className="form-input"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={saveLoading}
                className="btn-primary"
              >
                {saveLoading ? "Opslaan..." : "Gegevens opslaan"}
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => navigate("/customer/account")}
              >
                Terug naar account
              </button>
            </div>
          </form>
        </section>

        <section className="mt-6 surface-card p-6">
          <h2 className="text-xl font-extrabold text-red-700">
            Account verwijderen
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Deze actie is definitief en kan niet ongedaan gemaakt worden.
          </p>

          <form onSubmit={handleDeleteAccount} className="form-layout mt-4">
            {deleteError && (
              <div className="form-alert-error">{deleteError}</div>
            )}

            <label className="grid gap-1.5">
              <span className="form-label">
                Wachtwoord<span className="form-required">*</span>
              </span>
              <input
                type="password"
                value={deletePassword}
                onChange={(event) => setDeletePassword(event.target.value)}
                className="form-input"
                required
              />
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={confirmDelete}
                onChange={(event) => setConfirmDelete(event.target.checked)}
                className="form-checkbox"
              />
              Ik begrijp dat mijn account en gegevens verwijderd worden.
            </label>

            <button
              type="submit"
              disabled={deleteLoading}
              className="btn-danger"
            >
              {deleteLoading ? "Verwijderen..." : "Account verwijderen"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
