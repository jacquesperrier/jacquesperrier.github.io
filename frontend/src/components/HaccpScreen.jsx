import { useState, useEffect, useCallback } from 'react';
import { HACCP_CHECKLIST } from '@/data/haccp';

export default function HaccpScreen({ haccpState, onSave, onBack, onUpdateState }) {
  const [state, setState] = useState(haccpState || {});

  useEffect(() => {
    const initial = {};
    HACCP_CHECKLIST.forEach(s => s.items.forEach(item => {
      if (!state[item.id]) initial[item.id] = 'na';
    }));
    if (Object.keys(initial).length > 0) {
      setState(prev => ({ ...initial, ...prev }));
    }
  }, []);

  const cycleCheck = useCallback((id) => {
    setState(prev => {
      const states = ['na', 'ok', 'nc'];
      const idx = states.indexOf(prev[id] || 'na');
      const next = { ...prev, [id]: states[(idx + 1) % 3] };
      if (onUpdateState) onUpdateState(next);
      return next;
    });
  }, [onUpdateState]);

  const getScore = () => {
    let total = 0, ok = 0, nc = 0;
    HACCP_CHECKLIST.forEach(s => s.items.forEach(item => {
      if (state[item.id] !== 'na' && state[item.id]) { total++; if (state[item.id] === 'ok') ok++; else nc++; }
    }));
    const score = total > 0 ? Math.round(ok / total * 100) : null;
    return { score, nc };
  };

  const { score, nc } = getScore();
  const scoreClass = score === null ? '' : score < 50 ? 'score-rouge' : score < 70 ? 'score-jaune' : 'score-vert';

  const handleSave = () => {
    onSave({
      type: 'haccp',
      desc: `Score: ${score || 0}/100 -- ${nc} NC`,
      status: score >= 70 ? 'ok' : score >= 50 ? 'warn' : 'nc',
      data: { score: score || 0, state }
    });
  };

  return (
    <div className="screen" data-testid="haccp-screen">
      <div className="form-header">
        <button className="btn-back" data-testid="haccp-back-btn" onClick={onBack}>{'\u2190'}</button>
        <div className="form-header-title">{'\ud83d\udd0d'} Inspection HACCP</div>
        <div style={{ marginLeft: 'auto' }}>
          <div className={`score-circle ${scoreClass}`} data-testid="haccp-score-circle">
            <div className="score-num" data-testid="haccp-score">{score !== null ? score : '--'}</div>
            <div className="score-lbl">/100</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '10px 18px', fontSize: 11, color: 'var(--gris)' }}>Tapez sur chaque point pour changer le statut</div>
      <div style={{ paddingBottom: 80 }} data-testid="haccp-checklist">
        {HACCP_CHECKLIST.map(section => (
          <div className="checklist-section" key={section.section}>
            <div className="checklist-section-title">{section.section}</div>
            {section.items.map(item => (
              <div
                className={`check-item ${state[item.id] || 'na'}`}
                key={item.id}
                data-testid={`haccp-item-${item.id}`}
                onClick={() => cycleCheck(item.id)}
              >
                <div className="check-box">
                  {state[item.id] === 'ok' ? '\u2713' : state[item.id] === 'nc' ? '\u2717' : ''}
                </div>
                <div className="check-text">{item.text}</div>
                <span className={`check-risk ${item.risk}`}>{item.risk === 'crit' ? 'CRIT' : 'MAJ'}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="btn-save-wrap">
        <button className="btn-save" data-testid="haccp-save-btn" onClick={handleSave}>G&Eacute;N&Eacute;RER RAPPORT</button>
      </div>
    </div>
  );
}
