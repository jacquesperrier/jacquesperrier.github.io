import { useState, useRef } from 'react';

const CATEGORIES = [
  'Viandes fra\u00eeches', 'Volailles', 'Poissons / Fruits de mer', 'Produits laitiers',
  'Fruits et l\u00e9gumes', 'Produits secs / \u00e9picerie', 'Surgel\u00e9s', 'Boissons',
  'Produits de nettoyage'
];

export default function ReceptionForm({ user, onSave, onBack, showToast }) {
  const [fournisseur, setFournisseur] = useState('');
  const [categorie, setCategorie] = useState('');
  const [tempVal, setTempVal] = useState('');
  const [emballage, setEmballage] = useState('');
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

  const getAlert = () => {
    const val = parseFloat(tempVal);
    if (isNaN(val)) return null;
    let st = 'ok', msg = 'OK - Temp\u00e9rature de r\u00e9ception conforme';
    if (categorie.includes('Viande') || categorie.includes('Volaille') || categorie.includes('Poisson')) {
      if (val > 4) { st = 'danger'; msg = 'REFUS REQUIS -- Produit r\u00e9frig\u00e9r\u00e9 > 4\u00b0C'; }
    } else if (categorie.includes('urgel')) {
      if (val > -12) { st = 'danger'; msg = 'REFUS REQUIS -- Surgel\u00e9 partiellement d\u00e9congel\u00e9'; }
    }
    return { st, msg };
  };

  const alert = tempVal && categorie ? getAlert() : null;

  const handleSave = () => {
    if (!categorie) { showToast('Choisissez une cat\u00e9gorie', 'error'); return; }
    onSave({
      type: 'reception',
      desc: `${fournisseur || 'Livraison'} -- ${categorie}`,
      status: emballage === 'oui' ? 'ok' : 'nc',
      data: { fournisseur, categorie, temperature: tempVal, emballage, commentaire: comment }
    });
  };

  return (
    <div className="screen" data-testid="reception-screen">
      <div className="form-header">
        <button className="btn-back" data-testid="reception-back-btn" onClick={onBack}>{'\u2190'}</button>
        <div className="form-header-title">{'\ud83d\udce6'} R&eacute;ception marchandise</div>
      </div>
      <div className="form-body">
        <div className="form-group">
          <div className="form-label">Employ&eacute;</div>
          <input className="form-input" data-testid="reception-employe" type="text" readOnly value={user.name} />
        </div>
        <div className="form-group">
          <div className="form-label">Fournisseur</div>
          <input className="form-input" data-testid="reception-fournisseur" type="text" placeholder="Nom du fournisseur" value={fournisseur} onChange={e => setFournisseur(e.target.value)} />
        </div>
        <div className="form-group">
          <div className="form-label">Cat&eacute;gorie de produit</div>
          <select className="form-select" data-testid="reception-categorie" value={categorie} onChange={e => setCategorie(e.target.value)}>
            <option value="">-- Choisir --</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <div className="form-label">Temp&eacute;rature &agrave; la r&eacute;ception (&deg;C)</div>
          <div className="temp-input-row">
            <input className="form-input" data-testid="reception-temp" type="number" step="0.1" placeholder="0.0" value={tempVal} onChange={e => setTempVal(e.target.value)} />
            <span className="temp-unit">&deg;C</span>
          </div>
          {alert && <div className={`temp-alert show ${alert.st}`} data-testid="reception-alert">{alert.msg}</div>}
        </div>
        <div className="form-group">
          <div className="form-label">Emballage int&egrave;gre ?</div>
          <div className="radio-group">
            <div className={`radio-btn ${emballage === 'oui' ? 'sel-oui' : ''}`} data-testid="reception-oui" onClick={() => setEmballage('oui')}>{'\u2705'} Oui</div>
            <div className={`radio-btn ${emballage === 'non' ? 'sel-non' : ''}`} data-testid="reception-non" onClick={() => setEmballage('non')}>{'\u274c'} Non</div>
          </div>
        </div>
        <div className="form-group">
          <div className="form-label">Photo (optionnel)</div>
          <div className="photo-row">
            <button className="btn-photo btn-photo-cam" onClick={() => { fileRef.current.setAttribute('capture','environment'); fileRef.current.click(); }}>{'\ud83d\udcf7'} Camera</button>
            <button className="btn-photo btn-photo-file" onClick={() => { fileRef.current.removeAttribute('capture'); fileRef.current.click(); }}>{'\ud83d\udcc1'} Fichier</button>
          </div>
          <input type="file" ref={fileRef} accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
          {preview && <div className="photo-preview"><img src={preview} alt="preview" /></div>}
        </div>
        <div className="form-group">
          <div className="form-label">Commentaire</div>
          <textarea className="form-textarea" data-testid="reception-comment" placeholder="Observations..." value={comment} onChange={e => setComment(e.target.value)} />
        </div>
      </div>
      <div className="btn-save-wrap">
        <button className="btn-save" data-testid="reception-save-btn" onClick={handleSave}>ENREGISTRER</button>
      </div>
    </div>
  );
}
