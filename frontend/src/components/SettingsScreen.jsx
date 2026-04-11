import { useState, useEffect } from 'react';
import { getSettings, updateSettings, clearEntries } from '@/api';

export default function SettingsScreen({ onSwitchTab, showToast, onClearData }) {
  const [sheetsEnabled, setSheetsEnabled] = useState(false);
  const [sheetsUrl, setSheetsUrl] = useState('');
  const [etablissement, setEtablissement] = useState('');
  const [permis, setPermis] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSettings();
        setSheetsEnabled(res.data.sheets_enabled || false);
        setSheetsUrl(res.data.sheets_url || '');
        setEtablissement(res.data.etablissement || '');
        setPermis(res.data.permis || '');
      } catch (e) { console.error(e); }
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      await updateSettings({ sheets_enabled: sheetsEnabled, sheets_url: sheetsUrl, etablissement, permis });
      showToast('R\u00e9glages sauvegard\u00e9s', 'success');
    } catch (e) {
      showToast('Erreur de sauvegarde', 'error');
    }
  };

  const handleClear = async () => {
    if (window.confirm('Effacer toutes les donn\u00e9es locales ?')) {
      try {
        await clearEntries();
        onClearData();
        showToast('Donn\u00e9es effac\u00e9es', 'success');
      } catch (e) {
        showToast('Erreur', 'error');
      }
    }
  };

  return (
    <div className="screen" data-testid="settings-screen">
      <div className="app-header">
        <div className="header-logo">
          <div className="logo-v">V</div>
          <div className="header-title">
            <div className="brand">R&Eacute;GLAGES</div>
            <div className="sub">Configuration</div>
          </div>
        </div>
      </div>
      <div style={{ paddingBottom: 80 }}>
        <div className="settings-section">
          <div className="settings-title">Google Sheets</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
            <label style={{ fontSize: 14 }}>Synchronisation active</label>
            <div
              className={`toggle ${sheetsEnabled ? 'on' : ''}`}
              data-testid="toggle-sheets"
              onClick={() => setSheetsEnabled(!sheetsEnabled)}
            ></div>
          </div>
          <div className="form-group" style={{ marginTop: 10 }}>
            <div className="form-label">URL Apps Script</div>
            <input className="form-input" data-testid="sheets-url" type="url" placeholder="https://script.google.com/macros/s/.../exec" value={sheetsUrl} onChange={e => setSheetsUrl(e.target.value)} />
          </div>
          <button className="btn-save" data-testid="save-sheets-btn" style={{ marginTop: 10, padding: 12 }} onClick={handleSave}>SAUVEGARDER</button>
        </div>
        <div className="settings-section">
          <div className="settings-title">&Eacute;tablissement</div>
          <div className="form-group">
            <div className="form-label">Nom de l'&eacute;tablissement</div>
            <input className="form-input" data-testid="settings-etablissement" type="text" placeholder="Nom du restaurant" value={etablissement} onChange={e => setEtablissement(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginTop: 10 }}>
            <div className="form-label">No. Permis MAPAQ</div>
            <input className="form-input" data-testid="settings-permis" type="text" placeholder="Num\u00e9ro de permis" value={permis} onChange={e => setPermis(e.target.value)} />
          </div>
          <button className="btn-save" data-testid="save-settings-btn" style={{ marginTop: 10, padding: 12 }} onClick={handleSave}>SAUVEGARDER</button>
        </div>
        <div className="settings-section">
          <div className="settings-title">Donn&eacute;es locales</div>
          <button className="btn-danger" data-testid="clear-data-btn" onClick={handleClear}>EFFACER TOUTES LES DONN&Eacute;ES</button>
        </div>
        <div className="version-info">Verdict Inspection AI v2.0<br />verdictinspection-ai.com</div>
      </div>
      <div className="bottom-nav">
        <button className="nav-item" data-testid="set-nav-accueil" onClick={() => onSwitchTab('dashboard')}>
          <span className="nav-icon">{'\ud83c\udfe0'}</span>Accueil
        </button>
        <button className="nav-item" data-testid="set-nav-historique" onClick={() => onSwitchTab('history')}>
          <span className="nav-icon">{'\ud83d\udcca'}</span>Historique
        </button>
        <button className="nav-item active" data-testid="set-nav-reglages" onClick={() => onSwitchTab('settings')}>
          <span className="nav-icon">{'\u2699\ufe0f'}</span>R&eacute;glages
        </button>
      </div>
    </div>
  );
}
