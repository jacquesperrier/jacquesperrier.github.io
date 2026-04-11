export default function FormationList({ moduleProgress, onOpenModule, onBack }) {
  const modules = [
    { icon: '\ud83e\udd90', title: 'HACCP -- Principes fondamentaux', sub: '4 le\u00e7ons \u00b7 3 quiz \u00b7 Niveau 1' },
    { icon: '\ud83c\udf21\ufe0f', title: 'Contr\u00f4le des temp\u00e9ratures', sub: '4 le\u00e7ons \u00b7 3 quiz \u00b7 Niveau 1' },
    { icon: '\ud83e\uddfa', title: 'Nettoyage et d\u00e9sinfection', sub: '4 le\u00e7ons \u00b7 3 quiz \u00b7 Niveau 2' },
    { icon: '\ud83d\udccb', title: 'R\u00e9glementation MAPAQ', sub: '4 le\u00e7ons \u00b7 3 quiz \u00b7 Niveau 2' },
    { icon: '\ud83e\udd26', title: 'Hygi\u00e8ne personnelle', sub: '4 le\u00e7ons \u00b7 3 quiz \u00b7 Niveau 1' },
    { icon: '\u26a0\ufe0f', title: 'Allerg\u00e8nes alimentaires', sub: '4 le\u00e7ons \u00b7 3 quiz \u00b7 Niveau 2' }
  ];

  return (
    <div className="screen" data-testid="formation-screen">
      <div className="form-header">
        <button className="btn-back" data-testid="formation-back-btn" onClick={onBack}>{'\u2190'}</button>
        <div className="form-header-title">{'\ud83c\udf93'} Formation</div>
      </div>
      <div style={{ padding: '16px 0 80px' }}>
        <div style={{ padding: '8px 18px 14px', fontSize: 10, letterSpacing: 2, color: 'var(--or)', textTransform: 'uppercase' }}>Modules disponibles</div>
        {modules.map((mod, idx) => (
          <div className="formation-card" key={idx} data-testid={`formation-module-${idx}`} onClick={() => onOpenModule(idx)}>
            <div className="f-icon">{mod.icon}</div>
            <div className="f-info">
              <div className="f-title">{mod.title}</div>
              <div className="f-sub">{mod.sub}</div>
            </div>
            <div className={`f-badge ${moduleProgress[idx] ? 'done' : 'todo'}`} data-testid={`formation-badge-${idx}`}>
              {moduleProgress[idx] ? 'Compl\u00e9t\u00e9' : 'A faire'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
