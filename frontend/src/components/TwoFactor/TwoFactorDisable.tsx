import React, { useState } from 'react';

const TwoFactorDisable: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDisable = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/2fa/disable', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Kon 2FA niet uitschakelen');
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>2FA uitschakelen</h3>
      <button onClick={handleDisable} disabled={loading}>
        {loading ? 'Uitschakelen...' : 'Schakel 2FA uit'}
      </button>
      {error && <div style={{color:'red'}}>{error}</div>}
      {success && <div style={{color:'green'}}>2FA is uitgeschakeld.</div>}
    </div>
  );
};

export default TwoFactorDisable;
