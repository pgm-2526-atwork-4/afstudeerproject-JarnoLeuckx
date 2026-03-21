import React, { useState } from "react";

const TwoFactorEnable: React.FC = () => {
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/2fa/enable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ code }),
      });
      if (!res.ok) throw new Error("Verkeerde code of fout bij activeren");
      setSuccess(true);
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
      <h3>2FA activeren</h3>
      <form onSubmit={handleEnable}>
        <label>
          Vul de 6-cijferige code in uit je Authenticator app:
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            required
            pattern="\\d{6}"
            inputMode="numeric"
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Activeren..." : "Activeer 2FA"}
        </button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>2FA is nu actief!</div>}
    </div>
  );
};

export default TwoFactorEnable;
