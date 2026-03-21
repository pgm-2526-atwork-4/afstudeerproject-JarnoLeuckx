import React, { useEffect, useState } from 'react';

const TwoFactorStatus: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/user', {
          headers: { 'Accept': 'application/json' },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Kon status niet ophalen');
        const data = await res.json();
        setEnabled(!!data.two_factor_enabled);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (loading) return <div>Status laden...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div>
      <b>2FA status:</b> {enabled ? 'Ingeschakeld' : 'Uitgeschakeld'}
    </div>
  );
};

export default TwoFactorStatus;
