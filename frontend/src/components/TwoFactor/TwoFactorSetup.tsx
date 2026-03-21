import React, { useState } from "react";

interface SetupResponse {
  qr_code: string;
  secret: string;
}

const TwoFactorSetup: React.FC = () => {
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQr = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/2fa/setup", {
        headers: { Accept: "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Kon QR-code niet ophalen");
      const data: SetupResponse = await res.json();
      setQr(data.qr_code);
      setSecret(data.secret);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Onbekende fout");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>2FA instellen</h3>
      <button onClick={fetchQr} disabled={loading}>
        {loading ? "Laden..." : "Genereer QR-code"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {qr && (
        <div>
          <img src={qr} alt="2FA QR-code" />
          <p>
            Secret: <b>{secret}</b>
          </p>
          <p>
            Scan deze QR-code met Microsoft Authenticator of Google
            Authenticator.
          </p>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;
