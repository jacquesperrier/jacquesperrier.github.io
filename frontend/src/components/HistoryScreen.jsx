import { useState, useEffect } from 'react';
import { getEntries } from '@/api';

const TYPE_LABELS = {
  nettoyage: 'NETTOYAGE', temperature: 'TEMP\u00c9RATURE',
  reception: 'R\u00c9CEPTION', heures: 'HEURES', haccp: 'INSPECTION HACCP'
};

export default function HistoryScreen({ onSwitchTab }) {
  const [filter, setFilter] = useState('tous');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async (type) => {
    setLoading(true);
    try {
      const params = {};
      if (type && type !== 'tous') params.type = type;
      const res = await getEntries(params);
      setEntries(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchEntries(filter); }, [filter]);

  const filters = [
    { key: 'tous', label: 'Tous' },
    { key: 'nettoyage', label: '\ud83e\uddf9 Nettoyage' },
    { key: 'temperature', label: '\ud83c\udf21\ufe0f Temp.' },
    { key: 'reception', label: '\ud83d\udce6 R\u00e9ception' },
    { key: 'heures', label: '\u23f1\ufe0f Heures' },
    { key: 'haccp', label: '\ud83d\udd0d HACCP' }
  ];

  return (
    <div className="screen" data-testid="history-screen">
      <div className="app-header">
        <div className="header-logo">
          <div className="logo-v">V</div>
          <div className="header-title">
            <div className="brand">HISTORIQUE</div>
            <div className="sub">Toutes les entr&eacute;es</div>
          </div>
        </div>
      </div>
      <div className="history-filters">
        {filters.map(f => (
          <button
            key={f.key}
            className={`filter-chip ${filter === f.key ? 'active' : ''}`}
            data-testid={`filter-${f.key}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="entries-list" style={{ paddingBottom: 80 }} data-testid="history-list">
        {loading ? (
          <div className="empty-state"><div className="loading-spinner" style={{ margin: '0 auto' }}></div></div>
        ) : entries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{'\ud83d\udcca'}</div>
            <p>Aucune entr&eacute;e enregistr&eacute;e</p>
          </div>
        ) : entries.map(e => {
          const d = new Date(e.date);
          const ds = `${d.getDate()}/${d.getMonth() + 1} ${e.heure}`;
          return (
            <div className="entry-card" key={e.id} data-testid={`history-entry-${e.id}`}>
              <div className={`entry-dot ${e.status}`}></div>
              <div className="entry-info">
                <div className="entry-mod">{TYPE_LABELS[e.type] || e.type}</div>
                <div className="entry-desc">{e.desc}</div>
                <div className="entry-time">{e.employe}</div>
              </div>
              <div className="entry-time">{ds}</div>
            </div>
          );
        })}
      </div>
      <div className="bottom-nav">
        <button className="nav-item" data-testid="hist-nav-accueil" onClick={() => onSwitchTab('dashboard')}>
          <span className="nav-icon">{'\ud83c\udfe0'}</span>Accueil
        </button>
        <button className="nav-item active" data-testid="hist-nav-historique" onClick={() => onSwitchTab('history')}>
          <span className="nav-icon">{'\ud83d\udcca'}</span>Historique
        </button>
        <button className="nav-item" data-testid="hist-nav-reglages" onClick={() => onSwitchTab('settings')}>
          <span className="nav-icon">{'\u2699\ufe0f'}</span>R&eacute;glages
        </button>
      </div>
    </div>
  );
}
