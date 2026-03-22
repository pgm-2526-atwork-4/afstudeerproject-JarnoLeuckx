// Simple modal component
function Modal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl text-red-600">⚠️</span>
          <h3 className="text-lg font-bold text-red-700">
            Account verwijderen
          </h3>
        </div>
        <p className="mb-4 text-slate-700">
          Weet je zeker dat je je account definitief wilt verwijderen? Deze
          actie kan niet ongedaan gemaakt worden.
        </p>
        <div className="flex justify-end gap-2">
          <button className="btn-outline" onClick={onClose}>
            Annuleren
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            Verwijderen
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useEffect } from "react";
// Toast component for confirmation
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-green-600 px-4 py-2 text-white shadow-lg animate-fade-in">
      {message}
    </div>
  );
}
import CustomerProfileCard from "../components/customers/CustomerProfileCard";
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
  const [avatar, setAvatar] = useState(currentUser?.avatar ?? null);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(
    currentUser?.email_notifications_enabled ?? false,
  );

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

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
        email_notifications_enabled: emailNotificationsEnabled,
      });

      setCurrentUser(result.user);
      setSaveSuccess("Je gegevens zijn opgeslagen.");
      setShowToast(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Opslaan mislukt.");
    } finally {
      setSaveLoading(false);
    }
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    setShowDeleteModal(true);
  }

  async function confirmDeleteAccount() {
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
      setShowDeleteModal(false);
    }
  }

  return (
    <div className="page-modern min-h-screen bg-slate-50">
      {showToast && saveSuccess && (
        <Toast message={saveSuccess} onClose={() => setShowToast(false)} />
      )}
      <div className="mx-auto w-full max-w-4xl px-2 py-4 sm:px-4 sm:py-8">
        <div className="mb-6 surface-card-strong p-4 sm:p-6 flex flex-col items-center gap-4">
          <CustomerProfileCard
            name={name}
            email={email}
            phone={phone}
            avatar={avatar}
          />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 text-center">
            Mijn gegevens
          </h1>
          <p className="mt-1 text-sm text-slate-600 text-center">
            Werk je profielgegevens bij of verwijder je account indien gewenst.
          </p>
        </div>

        <section className="surface-card p-6">
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">
            Persoonlijke gegevens
          </h2>
          <form onSubmit={handleSave} className="form-layout mt-2 space-y-8">
            {saveError && <div className="form-alert-error">{saveError}</div>}
            {saveSuccess && (
              <div className="form-alert-success">{saveSuccess}</div>
            )}
            {/* Contactgegevens */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-bold text-slate-700 mb-2">Contactgegevens</h3>
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
                    placeholder="Bijv. Jan Janssens"
                  />
                  <span className="text-xs text-slate-500">
                    Je volledige naam
                  </span>
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
                    placeholder="jan@email.com"
                  />
                  <span className="text-xs text-slate-500">
                    Gebruik een geldig e-mailadres
                  </span>
                </label>
                <label className="grid gap-1.5">
                  <span className="form-label">Telefoon</span>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="form-input"
                    placeholder="Bijv. 0470 12 34 56"
                  />
                  <span className="text-xs text-slate-500">
                    Optioneel, maar handig voor snelle opvolging
                  </span>
                </label>
              </div>
            </div>
            {/* Adres */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-bold text-slate-700 mb-2">Adres</h3>
              <label className="grid gap-1.5">
                <span className="form-label">Adres</span>
                <input
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className="form-input"
                  placeholder="Straatnaam 1, 9000 Gent"
                />
                <span className="text-xs text-slate-500">
                  Optioneel, voor vlotte communicatie
                </span>
              </label>
            </div>
            {/* VAPH-nummer en notificaties */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-bold text-slate-700 mb-2">Overig</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1.5 md:col-span-1">
                  <span className="form-label">VAPH-nummer</span>
                  <input
                    value={vaphNumber}
                    onChange={(event) => setVaphNumber(event.target.value)}
                    className="form-input"
                    placeholder="Bijv. 123456789"
                  />
                  <span className="text-xs text-slate-500">
                    Enkel indien van toepassing
                  </span>
                </label>
                <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 md:col-span-1">
                  <input
                    type="checkbox"
                    checked={emailNotificationsEnabled}
                    onChange={(event) =>
                      setEmailNotificationsEnabled(event.target.checked)
                    }
                    className="form-checkbox mt-0.5"
                  />
                  <span>
                    Ik wil meldingen via e-mail ontvangen.
                    <span className="mt-0.5 block text-xs text-slate-500">
                      Je kan deze keuze later altijd opnieuw aanpassen.
                    </span>
                  </span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
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

        <Modal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteAccount}
        />
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
