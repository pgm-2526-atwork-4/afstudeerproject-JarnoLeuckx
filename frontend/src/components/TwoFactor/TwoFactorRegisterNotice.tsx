import React from "react";
import { Link } from "react-router-dom";

const TwoFactorRegisterNotice: React.FC = () => (
  <div className="form-alert-info mb-4">
    <b>Extra beveiliging mogelijk:</b> Je kan na registratie 2-stapsverificatie
    (2FA) activeren voor je account. Dit maakt je account extra veilig. Ga na
    het aanmaken van je account naar je profielinstellingen om 2FA in te
    schakelen.
    <br />
    <Link
      to="/customer/settings"
      className="underline text-blue-700 font-semibold"
    >
      Ga naar beveiligingsinstellingen
    </Link>
  </div>
);

export default TwoFactorRegisterNotice;
