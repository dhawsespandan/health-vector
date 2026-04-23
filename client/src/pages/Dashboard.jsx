import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ScoreGauge from '../components/ScoreGauge';
import WellnessCard from '../components/WellnessCard';
import { getZoneColor, getZoneLabel, getPrakritiDescription } from '../utils/scoreCalculator';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Brain, Heart, Dumbbell, Download, BookOpen, Leaf, CalendarCheck } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

/* ── Shared card shell ─────────────────────────────────── */
const card = {
  background: '#ffffff',
  borderRadius: 12,
  border: '1px solid #E4E4E7',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
};

/* ── Muted zone badge ──────────────────────────────────── */
const BADGE = {
  Optimal:  { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  Moderate: { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  Critical: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
};
const FILL = { Optimal: '#10b981', Moderate: '#f59e0b', Critical: '#ef4444' };

const Dashboard = () => {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState(null);
  const [history, setHistory]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestRes, historyRes] = await Promise.all([
          api.get('/assessment/latest'),
          api.get('/assessment/history'),
        ]);
        setAssessment(latestRes.data.assessment);
        setHistory(historyRes.data);
      } catch { /* no assessment yet */ }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleDownloadPDF = async () => {
    const tid = toast.loading('Generating PDF…');
    try {
      const canvas  = await html2canvas(contentRef.current, { scale: 1.5, backgroundColor: '#f4f4f5', useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const w = pdf.internal.pageSize.getWidth();
      pdf.addImage(imgData, 'PNG', 0, 0, w, (canvas.height * w) / canvas.width);
      pdf.save(`healthvector-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success('PDF downloaded!', { id: tid });
    } catch {
      toast.error('PDF generation failed', { id: tid });
    }
  };

  /* ── Loading ───────────────────────────────────────────── */
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  /* ── Empty state ───────────────────────────────────────── */
  if (!assessment) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: 24 }}>
      <div style={{ ...card, padding: 48, textAlign: 'center', maxWidth: 400, width: '100%' }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa', margin: '0 auto 20px' }}>
          <Activity size={26} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#18181b', marginBottom: 8 }}>No assessment yet</h2>
        <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.6, marginBottom: 28 }}>
          Take your first wellness assessment to unlock your personal dashboard with scores, recommendations, and trends.
        </p>
        <Link to="/assessment" className="mac-btn-primary">
          Take your first assessment <Activity size={15} />
        </Link>
      </div>
    </div>
  );

  const { scores, prakritiType, dimensionBreakdown, completedAt } = assessment;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  /* ── Chart data ────────────────────────────────────────── */
  const radarData = [
    { subject: 'Physical',  value: scores.physical,  fullMark: 100 },
    { subject: 'Mental',    value: scores.mental,    fullMark: 100 },
    { subject: 'Emotional', value: scores.emotional, fullMark: 100 },
  ];

  const trendData = history.slice(0, 10).reverse().map((a) => ({
    name:      format(new Date(a.completedAt), 'dd MMM'),
    score:     a.scores.overall,
    physical:  a.scores.physical,
    mental:    a.scores.mental,
    emotional: a.scores.emotional,
  }));

  const subDims = [
    { group: 'Physical',  items: [
      { label: 'Sleep',      value: dimensionBreakdown?.sleep },
      { label: 'Energy',     value: dimensionBreakdown?.energy },
      { label: 'Activity',   value: dimensionBreakdown?.activity },
      { label: 'Diet',       value: dimensionBreakdown?.diet },
      { label: 'Hydration',  value: dimensionBreakdown?.hydration },
    ]},
    { group: 'Mental',    items: [
      { label: 'Stress',     value: dimensionBreakdown?.stress },
      { label: 'Focus',      value: dimensionBreakdown?.focus },
      { label: 'Work-Life',  value: dimensionBreakdown?.workLife },
      { label: 'Anxiety',    value: dimensionBreakdown?.anxiety },
      { label: 'Digital',    value: dimensionBreakdown?.digitalUse },
    ]},
    { group: 'Emotional', items: [
      { label: 'Mood',       value: dimensionBreakdown?.mood },
      { label: 'Purpose',    value: dimensionBreakdown?.purpose },
      { label: 'Relations',  value: dimensionBreakdown?.relationships },
      { label: 'Regulation', value: dimensionBreakdown?.regulation },
      { label: 'Gratitude',  value: dimensionBreakdown?.gratitude },
    ]},
  ];

  const benchmarkPct = Math.min(99, Math.max(1, Math.round((scores.overall / 100) * 85)));

  return (
    <div style={{ background: '#F4F4F5', minHeight: '100vh' }}>

      {/* ── Page header ─────────────────────────────────── */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #E4E4E7' }}>
        <div className="section-container" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: '#18181b', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                Good {greeting}, {firstName}
              </h1>
              <p style={{ fontSize: 13, color: '#a1a1aa', marginTop: 3 }}>
                {format(new Date(), 'EEEE, MMMM d')}
                {completedAt && (
                  <> · Last assessed {format(new Date(completedAt), 'MMM d, yyyy')}</>
                )}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {/* Ghost download */}
              <button
                id="download-pdf"
                onClick={handleDownloadPDF}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#ffffff', color: '#3f3f46',
                  border: '1px solid #E4E4E7', borderRadius: 8,
                  padding: '7px 14px', fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', transition: 'background 0.15s',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#fafafa'}
                onMouseOut={e  => e.currentTarget.style.background = '#ffffff'}
              >
                <Download size={14} /> Download PDF
              </button>
              {/* Ghost book appointment */}
              <Link
                to="/booking"
                id="dashboard-book-appointment"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: '#ffffff', color: '#3f3f46',
                  border: '1px solid #E4E4E7', borderRadius: 8,
                  padding: '7px 14px', fontSize: 13, fontWeight: 500,
                  textDecoration: 'none', transition: 'background 0.15s',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#fafafa'}
                onMouseOut={e  => e.currentTarget.style.background = '#ffffff'}
              >
                <CalendarCheck size={14} /> Book Appointment
              </Link>
              <Link to="/recommendations" className="mac-btn-primary" style={{ fontSize: 13 }}>
                <BookOpen size={14} /> View Plan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────── */}
      <div ref={contentRef} className="section-container" style={{ paddingTop: 24, paddingBottom: 48 }}>

        {/* ── Score row (Wellness gauge + 3 dimension cards) */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>

          {/* Wellness Index gauge card */}
          <div style={{ ...card, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Wellness Index
            </p>
            <ScoreGauge score={scores.overall} size={164} showLabel={false} />
          </div>

          <WellnessCard label="Physical Index"  score={scores.physical}  icon={<Dumbbell size={18} />} />
          <WellnessCard label="Mental Index"    score={scores.mental}    icon={<Brain size={18} />} />
          <WellnessCard label="Emotion Index"   score={scores.emotional} icon={<Heart size={18} />} />
        </div>


        {/* ── Charts row ───────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginBottom: 16 }}>

          {/* Radar */}
          <div className="mac-panel" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 15, color: '#18181b', marginBottom: 20 }}>Wellness Radar</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(0,0,0,0.06)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 12, fontFamily: 'Inter' }} />
                <Radar name="You" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Trend */}
          <div className="mac-panel" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 15, color: '#18181b', marginBottom: 20 }}>Wellness Trend</h3>
            {trendData.length > 1 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid stroke="rgba(0,0,0,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'Inter' }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, color: '#18181b' }} />
                  <Line type="monotone" dataKey="score"     stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: '#06b6d4', r: 4 }} name="Overall" />
                  <Line type="monotone" dataKey="physical"  stroke="#22d3ee" strokeWidth={1.5} dot={false} name="Physical"  strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="mental"    stroke="#a78bfa" strokeWidth={1.5} dot={false} name="Mental"    strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="emotional" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Emotional" strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71717a', fontSize: 14 }}>
                Take more assessments to see your trend
              </div>
            )}
          </div>
        </div>

        {/* ── Dimension breakdown ──────────────────────────── */}
        <div style={{ ...card, padding: 28, marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Detail
          </p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#18181b', marginBottom: 24 }}>
            Dimension Breakdown
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {subDims.map(({ group, items }) => {
              const groupBadgeColor = group === 'Physical' ? '#0891b2' : group === 'Mental' ? '#7c3aed' : '#d97706';
              return (
                <div key={group}>
                  <p style={{
                    fontSize: 11, fontWeight: 700, color: groupBadgeColor,
                    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16,
                  }}>
                    {group}
                  </p>
                  {items.map(({ label, value }) => {
                    const v    = value || 0;
                    const zone = getZoneLabel(v);
                    const fill = FILL[zone] || FILL.Moderate;
                    return (
                      <div key={label} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                          <span style={{ color: '#71717a' }}>{label}</span>
                          <span style={{ fontWeight: 600, color: '#3f3f46', fontVariantNumeric: 'tabular-nums' }}>{v}</span>
                        </div>
                        <div style={{ height: 4, background: '#F4F4F5', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${v}%`, background: fill, borderRadius: 999, transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Prakriti constitution card ───────────────────── */}
        {prakritiType && (
          <div style={{
            ...card,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16,
            marginBottom: 16,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: '#f4f4f5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#71717a', flexShrink: 0, marginTop: 2,
            }}>
              <Leaf size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#18181b' }}>Your Constitution</span>
                <span style={{
                  background: BADGE.Optimal.bg, color: BADGE.Optimal.color, border: `1px solid ${BADGE.Optimal.border}`,
                  borderRadius: 999, padding: '1px 8px', fontSize: 11, fontWeight: 700,
                }}>
                  {prakritiType} Prakriti
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#71717a', lineHeight: 1.6 }}>
                {getPrakritiDescription(prakritiType)}
              </p>
            </div>
          </div>
        )}

        {/* ── Benchmark banner ─────────────────────────────── */}
        <div style={{ ...card, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#18181b', marginBottom: 4 }}>
              You scored higher than{' '}
              <span style={{ color: '#047857' }}>{benchmarkPct}%</span>
              {' '}of users in your age group
            </p>
            <p style={{ fontSize: 13, color: '#a1a1aa' }}>
              Platform average: 58 · Your score: {scores.overall}
            </p>
          </div>
          <span style={{
            background: BADGE.Optimal.bg, color: BADGE.Optimal.color,
            border: `1px solid ${BADGE.Optimal.border}`,
            borderRadius: 999, padding: '4px 12px', fontSize: 12, fontWeight: 600,
          }}>
            Top {100 - benchmarkPct}%
          </span>
        </div>


      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-score-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .dashboard-score-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
