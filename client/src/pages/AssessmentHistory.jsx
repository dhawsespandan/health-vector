import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { getZoneColor, getZoneLabel } from '../utils/scoreCalculator';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, GitCompare, TrendingUp } from 'lucide-react';

const AssessmentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    api.get('/assessment/history').then((res) => {
      setHistory(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const handleCompare = async () => {
    if (selected.length < 2) return;
    setComparing(true);
    try {
      const res = await api.get(`/assessment/compare/${selected[0]}/${selected[1]}`);
      setComparison(res.data);
    } catch {
    } finally {
      setComparing(false);
    }
  };

  const trendData = [...history].reverse().map((a) => ({
    date: format(new Date(a.completedAt), 'dd MMM'),
    overall: a.scores.overall,
    physical: a.scores.physical,
    mental: a.scores.mental,
    emotional: a.scores.emotional,
  }));

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <div className="spinner" style={{ width: 50, height: 50 }} />
    </div>
  );

  return (
    <div style={{ padding: '0 0 60px' }}>
      <div style={{ background: 'linear-gradient(180deg, rgba(6,182,212,0.06) 0%, transparent 100%)', padding: '48px 0 40px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="section-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 32, color: '#18181b', marginBottom: 8 }}>Assessment History</h1>
              <p style={{ color: '#71717a' }}>{history.length} assessment{history.length !== 1 ? 's' : ''} completed · Select two to compare</p>
            </div>
            {selected.length === 2 && (
              <button className="mac-btn-primary justify-center" onClick={handleCompare} disabled={comparing}>
                <GitCompare size={15} /> {comparing ? 'Comparing...' : 'Compare Selected'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="section-container" style={{ paddingTop: 40 }}>
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}></div>
            <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: '#18181b', marginBottom: 12 }}>No Assessments Yet</h3>
            <p style={{ color: '#71717a', marginBottom: 24 }}>Take your first assessment to start tracking your wellness journey.</p>
            <Link to="/assessment" className="mac-btn-primary justify-center">Take Assessment</Link>
          </div>
        ) : (
          <>
            {/* Trend chart */}
            {history.length > 1 && (
              <div className="mac-panel" style={{ padding: 24, marginBottom: 32 }}>
                <h3 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 15, color: '#18181b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TrendingUp size={16} color="#06b6d4" /> Score Trend Over Time
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid stroke="rgba(0,0,0,0.04)" />
                    <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, color: '#18181b' }} />
                    <Line type="monotone" dataKey="overall" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: '#06b6d4', r: 4 }} name="Overall" />
                    <Line type="monotone" dataKey="physical" stroke="#22d3ee" strokeWidth={1.5} dot={false} name="Physical" strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="mental" stroke="#a78bfa" strokeWidth={1.5} dot={false} name="Mental" strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="emotional" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Emotional" strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Assessment list */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: '#18181b', marginBottom: 16 }}>All Assessments</h2>
              {history.map((a) => {
                const zone = getZoneLabel(a.scores.overall);
                const color = getZoneColor(a.scores.overall);
                const isSelected = selected.includes(a._id);
                return (
                  <div key={a._id} className="mac-panel" style={{ padding: 20, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 16, border: `1px solid ${isSelected ? '#06b6d4' : 'rgba(0,0,0,0.06)'}`, background: isSelected ? 'rgba(6,182,212,0.04)' : '' }}>
                    {/* Checkbox */}
                    <div onClick={() => toggleSelect(a._id)}
                      style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${isSelected ? '#06b6d4' : 'rgba(0,0,0,0.2)'}`, background: isSelected ? '#06b6d4' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isSelected && <span style={{ color: 'white', fontSize: 12 }}></span>}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16, color: '#18181b', marginBottom: 4 }}>
                            Overall: <span style={{ color }}>{a.scores.overall}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}18`, padding: '2px 8px', borderRadius: 9999, marginLeft: 10 }}>{zone}</span>
                          </p>
                          <p style={{ fontSize: 13, color: '#71717a' }}>
                            {format(new Date(a.completedAt), 'MMMM d, yyyy · h:mm a')}
                            {a.prakritiType && <span style={{ marginLeft: 10, color: '#10b981' }}> {a.prakritiType}</span>}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                          <span style={{ color: '#06b6d4' }}>P: {a.scores.physical}</span>
                          <span style={{ color: '#a78bfa' }}>M: {a.scores.mental}</span>
                          <span style={{ color: '#f59e0b' }}>E: {a.scores.emotional}</span>
                        </div>
                      </div>
                    </div>

                    <Link to={`/assessment/${a._id}`} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#06b6d4', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                      <Eye size={14} /> View
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Comparison view */}
            {comparison && (
              <div className="mac-panel" style={{ padding: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: '#18181b' }}>Side-by-Side Comparison</h2>
                  <button onClick={() => setComparison(null)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: 13 }}> Close</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  {[comparison.assessment1, comparison.assessment2].map((a, i) => (
                    <div key={a._id} style={{ padding: 24, background: 'rgba(0,0,0,0.02)', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)' }}>
                      <p style={{ fontSize: 12, color: '#71717a', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase' }}>Assessment {i + 1}</p>
                      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>{format(new Date(a.completedAt), 'MMMM d, yyyy')}</p>
                      {['physical', 'mental', 'emotional', 'overall'].map((dim) => {
                        const val = a.scores[dim];
                        const other = (i === 0 ? comparison.assessment2 : comparison.assessment1).scores[dim];
                        const diff = val - other;
                        return (
                          <div key={dim} style={{ marginBottom: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                              <span style={{ color: '#94a3b8', textTransform: 'capitalize' }}>{dim}</span>
                              <span style={{ color: getZoneColor(val), fontWeight: 700 }}>
                                {val}
                                {i === 1 && diff !== 0 && (
                                  <span style={{ fontSize: 11, marginLeft: 6, color: diff > 0 ? '#10b981' : '#ef4444' }}>
                                    {diff > 0 ? '▲' : '▼'}{Math.abs(diff)}
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${val}%`, background: getZoneColor(val) }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AssessmentHistory;
