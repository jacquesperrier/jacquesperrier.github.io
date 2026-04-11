import { useState, useCallback } from 'react';
import { MODULES } from '@/data/modules';

export default function ModuleViewer({ moduleIndex, onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const mod = MODULES[moduleIndex];
  const currentStep = mod.steps[step];
  const total = mod.steps.length;
  const progress = ((step + 1) / total) * 100;

  const answerQuiz = useCallback((idx) => {
    if (quizAnswered) return;
    setQuizAnswered(true);
    setSelectedAnswer(idx);
  }, [quizAnswered]);

  const handleNext = () => {
    if (step < total - 1) {
      setStep(step + 1);
      setQuizAnswered(false);
      setSelectedAnswer(null);
      window.scrollTo(0, 0);
    } else {
      onComplete(moduleIndex);
    }
  };

  const showNextBtn = currentStep.type === 'lecon' || quizAnswered;

  return (
    <div className="screen" data-testid="module-viewer-screen">
      <div className="form-header">
        <button className="btn-back" data-testid="module-back-btn" onClick={onBack}>{'\u2190'}</button>
        <div className="form-header-title" data-testid="module-title">{mod.titre}</div>
        <div style={{ fontSize: 11, color: 'var(--or)', marginLeft: 'auto' }} data-testid="module-progress-label">{step + 1}/{total}</div>
      </div>
      <div style={{ height: 4, background: 'var(--noir3)' }}>
        <div className="module-progress-bar" style={{ width: `${progress}%` }} data-testid="module-progress-bar"></div>
      </div>

      {currentStep.type === 'lecon' ? (
        <div style={{ padding: '20px 18px 100px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="lesson-icon">{currentStep.icon}</div>
          <div className="lesson-title">{currentStep.titre}</div>
          <div className="lesson-body" dangerouslySetInnerHTML={{ __html: currentStep.corps }} data-testid="lesson-body" />
          {currentStep.cle && <div className="lesson-key" data-testid="lesson-key">{currentStep.cle}</div>}
        </div>
      ) : (
        <div style={{ padding: '20px 18px 100px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: 'var(--or)', textAlign: 'center' }}>QUIZ</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--blanc)', textAlign: 'center', lineHeight: 1.4 }} data-testid="quiz-question">
            {currentStep.question}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            {currentStep.options.map((opt, idx) => {
              let cls = 'quiz-option';
              if (quizAnswered) {
                if (idx === currentStep.bonne) cls += ' correct';
                else if (idx === selectedAnswer && idx !== currentStep.bonne) cls += ' wrong';
              }
              return (
                <div key={idx} className={cls} data-testid={`quiz-option-${idx}`} onClick={() => answerQuiz(idx)}>
                  <span className="opt-num">{idx + 1}</span>{opt}
                </div>
              );
            })}
          </div>
          {quizAnswered && (
            <div className={`quiz-feedback ${selectedAnswer === currentStep.bonne ? 'correct' : 'wrong'}`} data-testid="quiz-feedback">
              {selectedAnswer === currentStep.bonne ? 'Bonne r\u00e9ponse! ' : 'Incorrect. '}{currentStep.explication}
            </div>
          )}
        </div>
      )}

      {showNextBtn && (
        <div className="btn-save-wrap">
          <button className="btn-save" data-testid="module-next-btn" onClick={handleNext}>
            {step < total - 1 ? 'SUIVANT' : 'TERMINER'}
          </button>
        </div>
      )}
    </div>
  );
}
