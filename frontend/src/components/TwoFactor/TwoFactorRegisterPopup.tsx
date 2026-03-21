import React from "react";
import { Link } from "react-router-dom";

const TwoFactorRegisterPopup: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-slate-500 hover:text-slate-900 text-xl"
        aria-label="Sluiten"
      >
        ×
      </button>
      <div className="mb-4">
        <b>Extra beveiliging mogelijk:</b> Je kan na registratie
        2-stapsverificatie (2FA) activeren voor je account. Dit maakt je account
        extra veilig. Ga na het aanmaken van je account naar je
        profielinstellingen om 2FA in te schakelen.
      </div>
      <Link
        to="/customer/settings"
        className="inline-block bg-blue-700 text-white font-semibold px-4 py-2 rounded hover:bg-blue-800 transition"
        onClick={onClose}
      >
        Ga naar beveiligingsinstellingen
      </Link>
    </div>
  </div>
);

export default TwoFactorRegisterPopup;
