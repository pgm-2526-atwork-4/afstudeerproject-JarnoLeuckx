import React, { useState } from 'react';
import TwoFactorStatus from './TwoFactorStatus';
import TwoFactorSetup from './TwoFactorSetup';
import TwoFactorEnable from './TwoFactorEnable';
import TwoFactorDisable from './TwoFactorDisable';

const TwoFactorPage: React.FC = () => {
  const [showSetup, setShowSetup] = useState(false);
  const [showEnable, setShowEnable] = useState(false);
  const [showDisable, setShowDisable] = useState(false);

  return (
    <div style={{maxWidth: 400, margin: '0 auto'}}>
      <h2>Beveiliging: 2-stapsverificatie</h2>
      <TwoFactorStatus />
      <div style={{margin: '1em 0'}}>
        <button onClick={() => { setShowSetup(true); setShowEnable(false); setShowDisable(false); }}>
          2FA instellen
        </button>
        <button onClick={() => { setShowEnable(true); setShowSetup(false); setShowDisable(false); }}>
          2FA activeren
        </button>
        <button onClick={() => { setShowDisable(true); setShowSetup(false); setShowEnable(false); }}>
          2FA uitschakelen
        </button>
      </div>
      {showSetup && <TwoFactorSetup />}
      {showEnable && <TwoFactorEnable />}
      {showDisable && <TwoFactorDisable />}
    </div>
  );
};

export default TwoFactorPage;
