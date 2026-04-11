import { useState } from 'react';

const POSTES = [
  'Chef cuisinier', 'Cuisinier', 'Commis de cuisine', 'Plongeur',
  'Serveur / Serveuse', 'G\u00e9rant / G\u00e9rante', 'Responsable hygi\u00e8ne'
];

export default function HeuresForm({ user, onSave, onBack, showToast }) {
  const now = new Date();
  const [poste, setPoste] = useState('');
  const [heureType, setHeureType] = useState('');
  const [time, setTime] = useState(now.toTimeString().slice(0, 5));
  const [comment, setComment] = useState('');

  const handleSave = () => {
    if (!heureType) { showToast('S\u00e9lectionnez arriv\u00e9e ou d\u00e9part', 'error'); return; }
    onSave({
      type: 'heures',
      desc: `${heureType === 'arrive' ? 'Arriv\u00e9e' : 'D\u00e9part'}${poste ? ' -- ' + poste : ''}`,
      status: 'ok',
      data: { poste, typeHeure: heureType, heureSaisie: time, commentaire: comment }
    });
  };

  return (
    <div className="screen" data-testid="heures-screen">
      <div className="form-header">
        <button className="btn-back" data-testid="heures-back-btn" onClick={onBack}>{'\u2190'}</button>
        <div className="form-header-title">{'\u23f1\ufe0f'} Heures / Pr&eacute;sence</div>
      </div>
      <div className="form-body">
        <div className="form-group">
          <div className="form-label">Employ&eacute;</div>
          <input className="form-input" data-testid="heures-employe" type="text" readOnly value={user.name} />
        </div>
        <div className="form-group">
          <div className="form-label">Poste / R&ocirc;le</div>
          <select className="form-select" data-testid="heures-poste" value={poste} onChange={e => setPoste(e.target.value)}>
            <option value="">-- Choisir --</option>
            {POSTES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="form-group">
          <div className="form-label">Type d'entr&eacute;e</div>
          <div className="radio-group-col">
            <div className={`radio-btn ${heureType === 'arrive' ? 'sel-oui' : ''}`} data-testid="heures-arrive" onClick={() => setHeureType('arrive')}>{'\ud83d\udfe2'} Arriv&eacute;e</div>
            <div className={`radio-btn ${heureType === 'depart' ? 'sel-non' : ''}`} data-testid="heures-depart" onClick={() => setHeureType('depart')}>{'\ud83d\udd34'} D&eacute;part</div>
          </div>
        </div>
        <div className="form-group">
          <div className="form-label">Heure</div>
          <input className="form-input" data-testid="heures-time" type="time" value={time} onChange={e => setTime(e.target.value)} />
        </div>
        <div className="form-group">
          <div className="form-label">Commentaire</div>
          <textarea className="form-textarea" data-testid="heures-comment" placeholder="Notes..." value={comment} onChange={e => setComment(e.target.value)} />
        </div>
      </div>
      <div className="btn-save-wrap">
        <button className="btn-save" data-testid="heures-save-btn" onClick={handleSave}>ENREGISTRER</button>
      </div>
    </div>
  );
}
