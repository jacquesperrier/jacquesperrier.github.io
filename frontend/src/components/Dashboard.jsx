const TYPE_ICONS = {
  nettoyage: '\ud83e\uddf9', temperature: '\ud83c\udf21\ufe0f',
  reception: '\ud83d\udce6', heures: '\u23f1\ufe0f', haccp: '\ud83d\udd0d'
};
const TYPE_LABELS = {
  nettoyage: 'NETTOYAGE', temperature: 'TEMP\u00c9RATURE',
  reception: 'R\u00c9CEPTION', heures: 'HEURES', haccp: 'INSPECTION HACCP'
};

export default function Dashboard({ user, stats, entries, onLogout, onOpenForm, onOpenFormation, onSwitchTab }) {
  const months = ['jan.','f\u00e9v.','mars','avr.','mai','juin','juil.','ao\u00fbt','sep.','oct.','nov.','d\u00e9c.'];
  const d = new Date();
  const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  const todayEntries = entries.filter(e => {
    const ed = new Date(e.date);
    return ed.toDateString() === d.toDateString();
  });

  return (
    <div className="screen" data-testid="dashboard-screen">
      <div className="app-header">
        <div className="header-logo">
          <div className="logo-v">V</div>
          <div className="header-title">
            <div className="brand">VERDICT</div>
            <div className="sub">Inspection AI</div>
          </div>
        </div>
        <div className="header-right">
          <div className="header-date" data-testid="dashboard-date">{dateStr}</div>
          <button className="btn-deconnect" data-testid="logout-btn" onClick={onLogout}>&times;</button>
        </div>
      </div>

      <div className="dash-welcome">
        <div className="greeting">Aujourd'hui</div>
        <div className="user-name" data-testid="dashboard-username">Bienvenue, {user.name}</div>
      </div>

      <div className="dash-stats">
        <div className="stat-cell">
          <span className="stat-icon">{'\ud83e\uddf9'}</span>
          <span className="stat-label">Nettoyage</span>
          <span className="stat-val" data-testid="stat-nettoyage">{stats.nettoyage}</span>
        </div>
        <div className="stat-cell">
          <span className="stat-icon">{'\ud83c\udf21\ufe0f'}</span>
          <span className="stat-label">Temp&eacute;rature</span>
          <span className="stat-val" data-testid="stat-temperature">{stats.temperature}</span>
        </div>
        <div className="stat-cell">
          <span className="stat-icon">{'\ud83d\udce6'}</span>
          <span className="stat-label">R&eacute;ception</span>
          <span className="stat-val" data-testid="stat-reception">{stats.reception}</span>
        </div>
        <div className="stat-cell">
          <span className="stat-icon">{'\u23f1\ufe0f'}</span>
          <span className="stat-label">Heures</span>
          <span className="stat-val" data-testid="stat-heures">{stats.heures}</span>
        </div>
      </div>

      <div className="quick-actions">
        <button className="btn-quick" data-testid="quick-nettoyage" onClick={() => onOpenForm('nettoyage')}>+ Nettoyage</button>
        <button className="btn-quick" data-testid="quick-temperature" onClick={() => onOpenForm('temperature')}>+ Temp&eacute;rature</button>
        <button className="btn-quick" data-testid="quick-reception" onClick={() => onOpenForm('reception')}>+ R&eacute;ception</button>
        <button className="btn-quick" data-testid="quick-heures" onClick={() => onOpenForm('heures')}>+ Heures</button>
        <button className="btn-quick" data-testid="quick-haccp" onClick={() => onOpenForm('haccp')}>+ Inspection</button>
      </div>

      <div className="modules-title">VUE D'ENSEMBLE</div>
      <div className="modules-grid">
        <div className="module-card" data-testid="module-nettoyage" onClick={() => onOpenForm('nettoyage')}>
          <div className="mod-icon">{'\ud83e\uddf9'}</div>
          <div className="mod-name">Nettoyage</div>
          <div className="mod-count" data-testid="mod-nettoyage">{stats.nettoyage}</div>
          <div className="mod-status">t&acirc;ches aujourd'hui</div>
        </div>
        <div className="module-card" data-testid="module-temperature" onClick={() => onOpenForm('temperature')}>
          <div className="mod-icon">{'\ud83c\udf21\ufe0f'}</div>
          <div className="mod-name">Temp&eacute;rature</div>
          <div className="mod-count" data-testid="mod-temperature">{stats.temperature}</div>
          <div className="mod-status">relev&eacute;s</div>
        </div>
        <div className="module-card" data-testid="module-reception" onClick={() => onOpenForm('reception')}>
          <div className="mod-icon">{'\ud83d\udce6'}</div>
          <div className="mod-name">R&eacute;ception</div>
          <div className="mod-count" data-testid="mod-reception">{stats.reception}</div>
          <div className="mod-status">livraisons</div>
        </div>
        <div className="module-card" data-testid="module-heures" onClick={() => onOpenForm('heures')}>
          <div className="mod-icon">{'\u23f1\ufe0f'}</div>
          <div className="mod-name">Heures</div>
          <div className="mod-count" data-testid="mod-heures">{stats.heures}</div>
          <div className="mod-status">pr&eacute;sences</div>
        </div>
        <div className="module-card wide" data-testid="module-haccp" onClick={() => onOpenForm('haccp')}>
          <div className="mod-left">
            <div className="mod-icon">{'\ud83d\udd0d'}</div>
            <div>
              <div className="mod-name">Inspection HACCP</div>
              <div className="mod-status">Audit complet MAPAQ</div>
            </div>
          </div>
          <div className="mod-count">--</div>
        </div>
        <div className="module-card wide" data-testid="module-formation" onClick={onOpenFormation}>
          <div className="mod-left">
            <div className="mod-icon">{'\ud83c\udf93'}</div>
            <div>
              <div className="mod-name">Formation</div>
              <div className="mod-status">Modules de formation</div>
            </div>
          </div>
          <div className="mod-count">6</div>
        </div>
      </div>

      <div className="recent-title">ENTR&Eacute;ES R&Eacute;CENTES</div>
      <div className="entries-list" data-testid="entries-list">
        {todayEntries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{'\ud83d\udccb'}</div>
            <p>Aucune t&acirc;che enregistr&eacute;e aujourd'hui</p>
            <small>Commencez par ajouter une t&acirc;che</small>
          </div>
        ) : todayEntries.map(e => (
          <div className="entry-card" key={e.id} data-testid={`entry-${e.id}`}>
            <div className={`entry-dot ${e.status}`}></div>
            <div className="entry-info">
              <div className="entry-mod">{TYPE_LABELS[e.type] || e.type}</div>
              <div className="entry-desc">{e.desc}</div>
            </div>
            <div className="entry-time">{e.heure}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 70 }}></div>
      <div className="bottom-nav">
        <button className="nav-item active" data-testid="nav-accueil" onClick={() => onSwitchTab('dashboard')}>
          <span className="nav-icon">{'\ud83c\udfe0'}</span>Accueil
        </button>
        <button className="nav-item" data-testid="nav-historique" onClick={() => onSwitchTab('history')}>
          <span className="nav-icon">{'\ud83d\udcca'}</span>Historique
        </button>
        <button className="nav-item" data-testid="nav-reglages" onClick={() => onSwitchTab('settings')}>
          <span className="nav-icon">{'\u2699\ufe0f'}</span>R&eacute;glages
        </button>
      </div>
    </div>
  );
}
