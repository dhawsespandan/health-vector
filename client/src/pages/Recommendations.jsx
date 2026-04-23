import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import RecommendationCard from '../components/RecommendationCard';
import { getPrakritiDescription } from '../utils/scoreCalculator';
import { CheckCircle, Circle, Share2, Mail, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const dimLabels = { physical: 'Physical', mental: 'Mental', emotional: 'Emotional', holistic: 'Holistic & Ayurvedic' };
const dimColors = { physical: '#06b6d4', mental: '#a78bfa', emotional: '#f59e0b', holistic: '#10b981' };

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Recommendations = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('Health Vector_plan_checks') || '{}'); } catch { return {}; }
  });
  const [emailReminder, setEmailReminder] = useState(user?.notificationPrefs?.monthlyReminder || false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    api.get('/assessment/latest').then((res) => {
      setData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggleCheck = (key) => {
    setCheckedItems((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('Health Vector_plan_checks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleEmailReminderToggle = async () => {
    try {
      await api.put('/auth/me', { notificationPrefs: { email: true, monthlyReminder: !emailReminder } });
      setEmailReminder(!emailReminder);
      toast.success(emailReminder ? 'Reminders disabled' : 'Monthly reminders enabled!');
    } catch {
      toast.error('Failed to update preferences');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <div className="spinner" style={{ width: 50, height: 50 }} />
    </div>
  );

  if (!data?.assessment) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 22, color: '#18181b', marginBottom: 12 }}>No Assessment Found</h2>
          <p style={{ color: '#71717a', marginBottom: 24 }}>Take an assessment to receive personalised recommendations.</p>
          <Link to="/assessment" className="mac-btn-primary justify-center">Take Assessment</Link>
        </div>
      </div>
    );
  }

  const { assessment, recommendations } = data;
  const { scores, prakritiType } = assessment;

  // Group recs
  const grouped = {};
  recommendations?.forEach((rec) => {
    if (!grouped[rec.dimension]) grouped[rec.dimension] = [];
    grouped[rec.dimension].push(rec);
  });

  // Weakest dim
  const weakest = ['physical', 'mental', 'emotional'].reduce((a, b) => scores[a] < scores[b] ? a : b);

  // Build weekly plan (top 7 recs from all dims)
  const weeklyRecs = recommendations?.slice(0, 7) || [];

  const dims = Object.keys(grouped).filter(d => activeTab === 'all' || d === activeTab);

  return (
    <div style={{ padding: '0 0 60px' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg, rgba(167,139,250,0.06) 0%, transparent 100%)', padding: '48px 0 40px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="section-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: 12, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 600 }}>Your Personalised Plan</p>
              <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 28, color: '#18181b', marginBottom: 8 }}>
                Wellness Recommendations
                {prakritiType && <span style={{ color: '#10b981' }}> · {prakritiType} Type</span>}
              </h1>
              <p style={{ color: '#71717a', fontSize: 15 }}>Based on your scores — Physical: {scores.physical}, Mental: {scores.mental}, Emotional: {scores.emotional}</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleEmailReminderToggle} className={emailReminder ? 'mac-btn-primary justify-center' : 'mac-btn-secondary justify-center'} style={{ fontSize: 13 }}>
                <Mail size={14} /> {emailReminder ? ' Reminders On' : 'Monthly Reminders'}
              </button>
              <Link to="/assessment" className="mac-btn-secondary justify-center" style={{ fontSize: 13 }}>
                <RefreshCcw size={14} /> Retake
              </Link>
            </div>
          </div>

          {/* Focus badge */}
          <div style={{ marginTop: 24, padding: 16, background: `rgba(${weakest === 'physical' ? '6,182,212' : weakest === 'mental' ? '167,139,250' : '245,158,11'},0.08)`, border: `1px solid rgba(${weakest === 'physical' ? '6,182,212' : weakest === 'mental' ? '167,139,250' : '245,158,11'},0.2)`, borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}></span>
            <div>
              <span style={{ fontSize: 12, color: '#71717a', fontWeight: 600, textTransform: 'uppercase' }}>Focus Area </span>
              <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: dimColors[weakest] }}>{dimLabels[weakest]} Wellness</span>
              <span style={{ fontSize: 13, color: '#71717a' }}> — Your lowest scoring dimension</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container" style={{ paddingTop: 40 }}>
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          {['all', ...Object.keys(grouped)].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '8px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 600, fontFamily: 'Inter', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: activeTab === tab ? (dimColors[tab] || '#06b6d4') : 'rgba(0,0,0,0.06)',
                color: activeTab === tab ? 'white' : '#71717a',
              }}>
              {tab === 'all' ? `All (${recommendations?.length || 0})` : dimLabels[tab]}
            </button>
          ))}
        </div>

        {/* Recommendations */}
        <div style={{ marginBottom: 48 }}>
          {Object.entries(grouped)
            .filter(([dim]) => activeTab === 'all' || dim === activeTab)
            .map(([dim, recs]) => (
              <div key={dim} style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 3, height: 24, borderRadius: 2, background: dimColors[dim] }} />
                  <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: '#18181b' }}>{dimLabels[dim]}</h2>
                  {dim === weakest && <span className="badge badge-amber" style={{ fontSize: 10 }}>FOCUS AREA</span>}
                </div>
                <div className="card-grid-3">
                  {recs.map((rec, i) => <RecommendationCard key={i} rec={rec} />)}
                </div>
              </div>
            ))}
        </div>

        {/* Weekly Action Plan */}
        <div className="mac-panel" style={{ padding: 32, marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: '#18181b', marginBottom: 8 }}> Your 7-Day Action Plan</h2>
          <p style={{ color: '#71717a', fontSize: 14, marginBottom: 28 }}>One action per day from your top recommendations. Check off as you complete them!</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
            {DAYS.map((day, i) => {
              const rec = weeklyRecs[i];
              if (!rec) return null;
              const key = `day-${i}`;
              const done = checkedItems[key];
              return (
                <div key={day} onClick={() => toggleCheck(key)}
                  style={{ padding: '14px 16px', borderRadius: 10, border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : 'rgba(0,0,0,0.06)'}`, background: done ? 'rgba(16,185,129,0.05)' : 'rgba(0,0,0,0.02)', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12, transition: 'all 0.2s' }}>
                  <div style={{ marginTop: 2, color: done ? '#10b981' : '#475569', flexShrink: 0 }}>
                    {done ? <CheckCircle size={18} /> : <Circle size={18} />}
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: done ? '#34d399' : '#71717a', fontWeight: 600, marginBottom: 3 }}>{day}</p>
                    <p style={{ fontSize: 13, color: done ? '#94a3b8' : '#18181b', textDecoration: done ? 'line-through' : 'none', lineHeight: 1.4 }}>{rec.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prakriti section */}
        {prakritiType && (
          <div className="mac-panel" style={{ padding: 32, borderLeft: '3px solid #10b981' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 40 }}></div>
              <div>
                <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: '#18181b', marginBottom: 8 }}>{prakritiType} Prakriti Guidance</h3>
                <p style={{ color: '#71717a', fontSize: 14, lineHeight: 1.7, maxWidth: 700 }}>{getPrakritiDescription(prakritiType)}</p>
                <Link to="/blog/prakriti-guide" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#10b981', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginTop: 12 }}>
                  Learn more about {prakritiType} →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
