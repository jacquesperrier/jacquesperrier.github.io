import { useState } from 'react';

export default function LoginScreen({ onLogin }) {
  const [name, setName] = useState('Jacques Perrier');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Entrez votre nom'); return; }
    setLoading(true);
    setError('');
    try {
      await onLogin(name.trim(), pin);
    } catch (e) {
      setError(e.response?.data?.detail || 'Erreur de connexion');
    }
    setLoading(false);
  };

  return (
    <div className="screen login-screen" data-testid="login-screen">
      <div className="login-logo-wrap">
        <div className="login-v">V</div>
        <div className="login-brand">VERDICT</div>
        <div className="login-sub">INSPECTION AI &middot; EXPERT</div>
      </div>
      <div className="login-form">
        <div className="login-title">CONNEXION</div>
        <div className="form-group">
          <div className="form-label">Nom de l'employ&eacute;</div>
          <input
            className="form-input"
            data-testid="login-name-input"
            type="text"
            placeholder="Jacques Perrier"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="form-label">NIP</div>
          <input
            className="form-input"
            data-testid="login-pin-input"
            type="password"
            inputMode="numeric"
            placeholder="&#8226;&#8226;&#8226;&#8226;"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
        {error && <div style={{ color: 'var(--rouge)', fontSize: 13, textAlign: 'center' }} data-testid="login-error">{error}</div>}
        <button
          className="btn-login"
          data-testid="login-submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'CONNEXION...' : 'D\u00c9MARRER'}
        </button>
      </div>
    </div>
  );
}
