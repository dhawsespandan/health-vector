import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../hooks/useAssessment';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { ChevronRight, ChevronLeft, SkipForward, CheckCircle, Brain, Heart, Dumbbell, Leaf } from 'lucide-react';
import toast from 'react-hot-toast';

const LIKERT = [
  { value: 1, label: 'Never' },
  { value: 2, label: 'Rarely' },
  { value: 3, label: 'Sometimes' },
  { value: 4, label: 'Often' },
  { value: 5, label: 'Always' },
];

const SECTION_META = {
  Physical: { color: '#06b6d4', icon: <Dumbbell size={20} />, label: 'Physical Wellness', desc: 'Questions about your sleep, energy, exercise, and physical health.' },
  Mental: { color: '#a78bfa', icon: <Brain size={20} />, label: 'Mental Wellbeing', desc: 'Questions about stress, focus, anxiety, and mental clarity.' },
  Emotional: { color: '#f59e0b', icon: <Heart size={20} />, label: 'Emotional Health', desc: 'Questions about mood, relationships, purpose, and emotional regulation.' },
  Prakriti: { color: '#10b981', icon: <Leaf size={20} />, label: 'Prakriti – Ayurvedic Type', desc: 'Discover your Ayurvedic constitution. Choose the option that best describes your natural tendencies.' },
};

const Assessment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentIndex, section,
    wellnessResponses, prakritiResponses,
    submitting, error,
    answerWellness, answerPrakriti,
    getWellnessAnswer, getPrakritiAnswer,
    goNext, goBack, startPrakriti, submit, reset,
  } = useAssessment();

  const [questions, setQuestions] = useState({ wellness: [], prakriti: [] });
  const [loadingQ, setLoadingQ] = useState(true);
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('Health Vector_assessment_draft'));
  const [submitted, setSubmitted] = useState(false);
  const [resultId, setResultId] = useState(null);

  useEffect(() => {
    api.get('/assessment/questions').then((res) => {
      setQuestions(res.data);
      setLoadingQ(false);
    }).catch(() => toast.error('Failed to load questions'));
  }, []);

  if (loadingQ) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="spinner" style={{ width: 50, height: 50 }} />
    </div>
  );

  const wellnessQs = questions.wellness || [];
  const prakritiQs = questions.prakriti || [];

  // ── Success screen (reached from either section) ──
  if (submitted) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div className="mac-panel" style={{ padding: 48 }}>
            <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={40} color="white" />
            </div>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 26, color: '#18181b', marginBottom: 12 }}>Assessment Complete!</h2>
            <p style={{ color: '#71717a', marginBottom: 32, lineHeight: 1.7 }}>Your wellness scores have been calculated. Check your dashboard to see your results.</p>
            <button className="mac-btn-primary justify-center" style={{ justifyContent: 'center', fontSize: 16 }} onClick={() => navigate('/dashboard')}>
              View My Dashboard <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Wellness flow
  if (section === 'wellness') {
    if (showWelcome) {
      return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ maxWidth: 640, width: '100%' }}>
            <div className="mac-panel" style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #06b6d4, #0891b2)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <CheckCircle size={40} color="white" />
              </div>
              <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 28, color: '#18181b', marginBottom: 16 }}>
                Your Wellness Assessment
              </h1>
              <p style={{ color: '#71717a', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
                This 35-question assessment evaluates your <strong style={{ color: '#18181b' }}>Physical, Mental,</strong> and <strong style={{ color: '#18181b' }}>Emotional</strong> dimensions to generate your personalised Wellness Index.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32, textAlign: 'left' }}>
                {[
                  { icon: '⏱', label: '8–10 minutes' },
                  { icon: '', label: 'Completely private' },
                  { icon: '', label: 'Auto-saved progress' },
                ].map((item) => (
                  <div key={item.label} style={{ padding: 16, background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.1)', borderRadius: 10, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                    <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{item.label}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button id="start-assessment" className="mac-btn-primary justify-center" style={{ justifyContent: 'center', fontSize: 16, padding: '14px 32px' }}
                  onClick={() => setShowWelcome(false)}>
                  Start Assessment <ChevronRight size={18} />
                </button>
                {localStorage.getItem('Health Vector_assessment_draft') && (
                  <button className="mac-btn-secondary justify-center" style={{ justifyContent: 'center' }} onClick={() => { reset(); setShowWelcome(true); }}>
                    Start Fresh
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    const currentQ = wellnessQs[currentIndex];
    const currentSection = currentQ?.section;
    const meta = SECTION_META[currentSection] || {};
    const selectedAnswer = getWellnessAnswer(currentQ?.id);
    const totalWellness = wellnessQs.length;
    const progressPct = (currentIndex / totalWellness) * 100;

    // Check section boundary
    const prevSection = currentIndex > 0 ? wellnessQs[currentIndex - 1]?.section : null;
    const isNewSection = currentSection !== prevSection;

    const handleNext = async () => {
      if (!selectedAnswer) return toast.error('Please select an answer before continuing');
      if (currentIndex === totalWellness - 1) {
        // All wellness done → go to prakriti
        startPrakriti();
      } else {
        goNext();
      }
    };

    if (!currentQ) return null;

    return (
      <div style={{ minHeight: '80vh', padding: '40px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Progress */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: '#71717a' }}>Question {currentIndex + 1} of {totalWellness}</span>
              <span className={`badge badge-${currentSection === 'Physical' ? 'teal' : currentSection === 'Mental' ? 'purple' : 'amber'}`}>
                {meta.icon} {currentSection}
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* Section banner (only on first Q of that section) */}
          {isNewSection && currentIndex > 0 && (
            <div className="mac-panel" style={{ padding: 20, marginBottom: 24, borderLeft: `3px solid ${meta.color}`, display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ color: meta.color }}>{meta.icon}</div>
              <div>
                <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 15, color: '#18181b', marginBottom: 4 }}>{meta.label}</h3>
                <p style={{ fontSize: 13, color: '#71717a' }}>{meta.desc}</p>
              </div>
            </div>
          )}

          {/* Question */}
          <div className="mac-panel" style={{ padding: 40, marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 22, color: '#18181b', marginBottom: 32, lineHeight: 1.4 }}>
              {currentQ.text}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {LIKERT.map((opt) => (
                <button key={opt.value}
                  onClick={() => answerWellness(currentQ.id, opt.value)}
                  style={{
                    padding: '16px 20px', borderRadius: 12, border: `2px solid ${selectedAnswer === opt.value ? meta.color : 'rgba(0,0,0,0.08)'}`,
                    background: selectedAnswer === opt.value ? `${meta.color}15` : 'rgba(0,0,0,0.03)',
                    color: selectedAnswer === opt.value ? '#18181b' : '#94a3b8',
                    cursor: 'pointer', textAlign: 'left', fontSize: 15, fontWeight: selectedAnswer === opt.value ? 600 : 400,
                    transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${selectedAnswer === opt.value ? meta.color : 'rgba(0,0,0,0.15)'}`, background: selectedAnswer === opt.value ? meta.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700, color: selectedAnswer === opt.value ? 'white' : '#71717a', transition: 'all 0.2s' }}>
                    {opt.value}
                  </div>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <button className="mac-btn-secondary justify-center" onClick={goBack} disabled={currentIndex === 0} style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}>
              <ChevronLeft size={16} /> Back
            </button>
            <button id="assessment-next" className="mac-btn-primary justify-center" onClick={handleNext}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prakriti section
  if (section === 'prakriti') {
    const currentQ = prakritiQs[currentIndex];
    const selectedAnswer = getPrakritiAnswer(currentQ?.id);
    const progressPct = ((currentIndex + 1) / prakritiQs.length) * 100;

    const handleSubmit = async (skipPrakriti = false) => {
      try {
        const result = await submit(skipPrakriti);
        setSubmitted(true);
        setResultId(result.assessment._id);
      } catch (err) {
        // error is shown via state
      }
    };

    if (!currentQ) return null;

    return (
      <div style={{ minHeight: '80vh', padding: '40px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ glass: true, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: '#10b981' }}> Prakriti Assessment</h2>
                <p style={{ fontSize: 13, color: '#71717a', marginTop: 4 }}>Question {currentIndex + 1} of {prakritiQs.length} — Optional</p>
              </div>
              <button onClick={() => handleSubmit(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8, color: '#71717a', padding: '8px 14px', cursor: 'pointer', fontSize: 13 }}>
                <SkipForward size={14} /> Skip Prakriti
              </button>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
            </div>
          </div>

          <div className="mac-panel" style={{ padding: 40, marginBottom: 24, borderLeft: '3px solid #10b981' }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 22, color: '#18181b', marginBottom: 32, lineHeight: 1.4 }}>
              {currentQ.text}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {currentQ.options?.map((opt, i) => (
                <button key={i}
                  onClick={() => answerPrakriti(currentQ.id, i + 1)}
                  style={{
                    padding: '18px 20px', borderRadius: 12,
                    border: `2px solid ${selectedAnswer === i + 1 ? '#10b981' : 'rgba(0,0,0,0.08)'}`,
                    background: selectedAnswer === i + 1 ? 'rgba(16,185,129,0.12)' : 'rgba(0,0,0,0.03)',
                    color: selectedAnswer === i + 1 ? '#18181b' : '#94a3b8',
                    cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: selectedAnswer === i + 1 ? 600 : 400,
                    transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${selectedAnswer === i + 1 ? '#10b981' : 'rgba(0,0,0,0.15)'}`, background: selectedAnswer === i + 1 ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 700, color: selectedAnswer === i + 1 ? 'white' : '#71717a' }}>
                    {['A', 'B', 'C'][i]}
                  </div>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: 12, marginBottom: 16, color: '#f87171', fontSize: 13 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <button className="mac-btn-secondary justify-center" onClick={goBack}>
              <ChevronLeft size={16} /> Back
            </button>
            {currentIndex < prakritiQs.length - 1 ? (
              <button id="prakriti-next" className="mac-btn-primary justify-center" onClick={() => { if (!selectedAnswer) return toast.error('Please select an option'); goNext(); }}>
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button id="submit-assessment" className="mac-btn-primary justify-center" disabled={submitting}
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                onClick={() => handleSubmit(false)}>
                {submitting ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Calculating...</> : <>Submit Assessment <CheckCircle size={16} /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Assessment;
