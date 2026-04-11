import { useState, useRef } from 'react';

const ZONES = [
  'Cuisine -- Zone pr\u00e9paration', 'Cuisine -- Plancha / Friteuse', 'Cuisine -- Fourneaux',
  'R\u00e9frig\u00e9rateurs / Cong\u00e9lateurs', 'Salle \u00e0 manger', 'Toilettes clients',
  'Toilettes employ\u00e9s', 'Quai de r\u00e9ception', 'Chambre froide', 'Hotte / Ventilation'
];
const TYPES = [
  'Nettoyage de routine', 'D\u00e9sinfection compl\u00e8te', 'Nettoyage profond',
  'Sanitisation HACCP', 'Nettoyage apr\u00e8s incident'
];

export default function NettoyageForm({ user, onSave, onBack, showToast }) {
  const [zone, setZone] = useState('');
  const [typeNet, setTypeNet] = useState('');
  const [conforme, setConforme] = useState('');
  const [comment, setComment] = useState('');
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!zone) { showToast('Choisissez une zone', 'error'); return; }
    onSave({
      type: 'nettoyage',
      desc: zone,
      status: conforme === 'oui' ? 'ok' : 'nc',
      data: { zone, typeNet, conforme, commentaire: comment }
    });
  };

  return (
    <div className="screen" data-testid="nettoyage-screen">
      <div className="form-header">
        <button className="btn-back" data-testid="nettoyage-back-btn" onClick={onBack}>{'\u2190'}</button>
        <div className="form-header-title">{'\ud83e\uddf9'} Nettoyage</div>
      </div>
      <div className="form-body">
        <div className="form-group">
          <div className="form-label">Employ&eacute;</div>
          <input className="form-input" data-testid="nettoyage-employe" type="text" readOnly value={user.name} />
        </div>
        <div className="form-group">
          <div className="form-label">Zone / &Eacute;quipement</div>
          <select className="form-select" data-testid="nettoyage-zone" value={zone} onChange={e => setZone(e.target.value)}>
            <option value="">-- Choisir --</option>
            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
        <div className="form-group">
          <div className="form-label">Type de nettoyage</div>
          <select className="form-select" data-testid="nettoyage-type" value={typeNet} onChange={e => setTypeNet(e.target.value)}>
            <option value="">-- Choisir --</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <div className="form-label">Conforme ?</div>
          <div className="radio-group">
            <div className={`radio-btn ${conforme === 'oui' ? 'sel-oui' : ''}`} data-testid="nettoyage-oui" onClick={() => setConforme('oui')}>{'\u2705'} Oui</div>
            <div className={`radio-btn ${conforme === 'non' ? 'sel-non' : ''}`} data-testid="nettoyage-non" onClick={() => setConforme('non')}>{'\u274c'} Non</div>
          </div>
        </div>
        <div className="form-group">
          <div className="form-label">Photo (optionnel)</div>
          <div className="photo-row">
            <button className="btn-photo btn-photo-cam" data-testid="nettoyage-camera" onClick={() => { fileRef.current.setAttribute('capture','environment'); fileRef.current.click(); }}>{'\ud83d\udcf7'} Camera</button>
            <button className="btn-photo btn-photo-file" data-testid="nettoyage-file" onClick={() => { fileRef.current.removeAttribute('capture'); fileRef.current.click(); }}>{'\ud83d\udcc1'} Fichier</button>
          </div>
          <input type="file" ref={fileRef} accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
          {preview && <div className="photo-preview"><img src={preview} alt="preview" /></div>}
        </div>
        <div className="form-group">
          <div className="form-label">Commentaire</div>
          <textarea className="form-textarea" data-testid="nettoyage-comment" placeholder="Observations..." value={comment} onChange={e => setComment(e.target.value)} />
        </div>
      </div>
      <div className="btn-save-wrap">
        <button className="btn-save" data-testid="nettoyage-save-btn" onClick={handleSave}>ENREGISTRER</button>
      </div>
    </div>
  );
}
