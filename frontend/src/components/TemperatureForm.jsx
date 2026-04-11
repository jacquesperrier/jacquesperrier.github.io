import { useState } from 'react';

const ZONES = [
  'R\u00e9frig\u00e9rateur 1 -- Cuisine', 'R\u00e9frig\u00e9rateur 2 -- Pr\u00e9paration',
  'Cong\u00e9lateur principal', 'Chambre froide positive', 'Chambre froide n\u00e9gative',
  'Bain-marie / Maintien chaud', 'Cuisson -- Viande', 'Cuisson -- Volaille',
  'Cuisson -- Poisson', 'Livraison re\u00e7ue'
];
const TYPES = ['Contr\u00f4le routine', 'R\u00e9ception marchandise', 'V\u00e9rification cuisson', 'Refroidissement', 'Maintien chaud'];

function checkTemp(val, zone) {
  if (isNaN(val)) return null;
  let st = 'ok', msg = 'OK - Temp\u00e9rature acceptable';
  if (zone.includes('frig') || zone.includes('positive')) {
    if (val > 4) { st = 'danger'; msg = 'DANGER -- Doit \u00eatre <= 4\u00b0C'; }
  } else if (zone.includes('gel') || zone.includes('gative')) {
    if (val > -18) { st = 'danger'; msg = 'DANGER -- Doit \u00eatre <= -18\u00b0C'; }
  } else if (zone.includes('Volaille')) {
    if (val < 85) { st = 'danger'; msg = 'DANGER -- Doit \u00eatre >= 85\u00b0C'; }
    else { msg = 'OK - Cuisson conforme'; }
  } else if (zone.includes('Viande')) {
    if (val < 74) { st = 'danger'; msg = 'DANGER -- Doit \u00eatre >= 74\u00b0C'; }
    else { msg = 'OK - Cuisson conforme'; }
  } else if (zone.includes('chaud') || zone.includes('Maintien')) {
    if (val < 60) { st = 'warn'; msg = 'ATTENTION -- Doit \u00eatre >= 60\u00b0C'; }
  }
  return { st, msg };
}

export default function TemperatureForm({ user, onSave, onBack, showToast }) {
  const [zone, setZone] = useState('');
  const [tempVal, setTempVal] = useState('');
  const [tempType, setTempType] = useState('Contr\u00f4le routine');
  const [comment, setComment] = useState('');

  const alert = tempVal !== '' && zone ? checkTemp(parseFloat(tempVal), zone) : null;

  const handleSave = () => {
    if (!zone || !tempVal) { showToast('Remplissez tous les champs', 'error'); return; }
    const v = parseFloat(tempVal);
    let status = 'ok';
    if (zone.includes('frig') && v > 4) status = 'nc';
    if (zone.includes('gel') && v > -18) status = 'nc';
    if (zone.includes('Volaille') && v < 85) status = 'nc';
    if (zone.includes('Viande') && v < 74) status = 'nc';
    onSave({
      type: 'temperature',
      desc: `${zone} : ${tempVal}\u00b0C`,
      status,
      data: { zone, temperature: tempVal, type: tempType, commentaire: comment }
    });
  };

  return (
    <div className="screen" data-testid="temperature-screen">
      <div className="form-header">
        <button className="btn-back" data-testid="temperature-back-btn" onClick={onBack}>{'\u2190'}</button>
        <div className="form-header-title">{'\ud83c\udf21\ufe0f'} Temp&eacute;rature</div>
      </div>
      <div className="form-body">
        <div className="form-group">
          <div className="form-label">Employ&eacute;</div>
          <input className="form-input" data-testid="temperature-employe" type="text" readOnly value={user.name} />
        </div>
        <div className="form-group">
          <div className="form-label">&Eacute;quipement / Zone</div>
          <select className="form-select" data-testid="temperature-zone" value={zone} onChange={e => setZone(e.target.value)}>
            <option value="">-- Choisir --</option>
            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
        <div className="form-group">
          <div className="form-label">Temp&eacute;rature relev&eacute;e</div>
          <div className="temp-input-row">
            <input className="form-input" data-testid="temperature-value" type="number" step="0.1" placeholder="0.0" value={tempVal} onChange={e => setTempVal(e.target.value)} />
            <span className="temp-unit">&deg;C</span>
          </div>
          {alert && <div className={`temp-alert show ${alert.st}`} data-testid="temperature-alert">{alert.msg}</div>}
        </div>
        <div className="form-group">
          <div className="form-label">Type de mesure</div>
          <select className="form-select" data-testid="temperature-type" value={tempType} onChange={e => setTempType(e.target.value)}>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <div className="form-label">Commentaire</div>
          <textarea className="form-textarea" data-testid="temperature-comment" placeholder="Observations..." value={comment} onChange={e => setComment(e.target.value)} />
        </div>
      </div>
      <div className="btn-save-wrap">
        <button className="btn-save" data-testid="temperature-save-btn" onClick={handleSave}>ENREGISTRER</button>
      </div>
    </div>
  );
}
