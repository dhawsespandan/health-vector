import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getZoneColor } from '../utils/scoreCalculator';
import { Users, Activity, TrendingUp, Mail, Send, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const OrgDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmails, setInviteEmails] = useState('');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    api.get('/org/dashboard').then((res) => {
      setData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleInvite = async () => {
    const emails = inviteEmails.split(',').map((e) => e.trim()).filter(Boolean);
    if (emails.length === 0) return toast.error('Enter at least one email');
    setInviting(true);
    try {
      const res = await api.post('/org/invite', { emails });
      const succeeded = res.data.results.filter((r) => r.success).length;
      toast.success(`${succeeded} of ${emails.length} invitations sent!`);
      setInviteEmails('');
    } catch {
      toast.error('Failed to send invites');
    } finally {
      setInviting(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}><div className="spinner" style={{ width: 50, height: 50 }} /></div>;

  if (!data) return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
      <div>
        <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 22, color: '#18181b', marginBottom: 12 }}>No Organization Found</h2>
        <p style={{ color: '#71717a', marginBottom: 24 }}>You need to register an organization to access this dashboard.</p>
        <button className="mac-btn-primary justify-center" onClick={() => alert('Organization registration form — to be implemented')}>Register Organization</button>
      </div>
    </div>
  );

  const { organization, stats, zoneDistribution, members } = data;
  const zoneData = [
    { name: 'Optimal', value: zoneDistribution.optimal, color: '#10b981' },
    { name: 'Moderate', value: zoneDistribution.moderate, color: '#f59e0b' },
    { name: 'Critical', value: zoneDistribution.critical, color: '#ef4444' },
  ];

  const dimBarData = [
    { name: 'Physical', score: stats.avgPhysical },
    { name: 'Mental', score: stats.avgMental },
    { name: 'Emotional', score: stats.avgEmotional },
  ];

  return (
    <div style={{ padding: '0 0 60px' }}>
      <div style={{ background: 'linear-gradient(180deg, rgba(167,139,250,0.06) 0%, transparent 100%)', padding: '48px 0 40px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="section-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Organization Dashboard</p>
              <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 28, color: '#18181b', marginBottom: 4 }}>{organization.name}</h1>
              <p style={{ color: '#71717a' }}>{organization.sector} · Admin: {user?.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container" style={{ paddingTop: 40 }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Employees Invited', value: stats.totalMembers, icon: <Users size={20} />, color: '#a78bfa' },
            { label: 'Assessments Done', value: stats.completedCount, icon: <Activity size={20} />, color: '#06b6d4' },
            { label: 'Avg Wellness Index', value: stats.avgOverall, icon: <TrendingUp size={20} />, color: '#10b981' },
            { label: 'Response Rate', value: `${stats.responseRate}%`, icon: <Users size={20} />, color: '#f59e0b' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="mac-panel" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <p style={{ fontSize: 12, color: '#71717a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                <div style={{ color }}>{icon}</div>
              </div>
              <p style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 32, color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 32 }}>
          {/* Zone donut */}
          <div className="mac-panel" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 15, color: '#18181b', marginBottom: 20 }}>Zone Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart><Pie data={zoneData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {zoneData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie></PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {zoneData.map(({ name, value, color }) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#71717a' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                  {name}: <strong style={{ color }}>{value}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Dimension averages */}
          <div className="mac-panel" style={{ padding: 24, gridColumn: 'span 2' }}>
            <h3 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 15, color: '#18181b', marginBottom: 20 }}>Dimension Averages</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={dimBarData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, color: '#18181b' }} />
                <Bar dataKey="score" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member table */}
        <div className="mac-panel" style={{ padding: 28, marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 17, color: '#18181b', marginBottom: 20 }}>Team Members</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th><th>Department</th><th>Overall</th><th>Physical</th><th>Mental</th><th>Emotional</th><th>Zone</th><th>Last Assessment</th>
                </tr>
              </thead>
              <tbody>
                {members.slice(0, 20).map((m) => (
                  <tr key={m._id}>
                    <td style={{ color: '#18181b', fontWeight: 500 }}>{m.name}</td>
                    <td>{m.department || '—'}</td>
                    <td style={{ color: m.scores ? getZoneColor(m.scores.overall) : '#475569', fontWeight: 700 }}>{m.scores?.overall ?? '—'}</td>
                    <td style={{ color: m.scores ? getZoneColor(m.scores.physical) : '#475569' }}>{m.scores?.physical ?? '—'}</td>
                    <td style={{ color: m.scores ? getZoneColor(m.scores.mental) : '#475569' }}>{m.scores?.mental ?? '—'}</td>
                    <td style={{ color: m.scores ? getZoneColor(m.scores.emotional) : '#475569' }}>{m.scores?.emotional ?? '—'}</td>
                    <td>{m.scores ? <span style={{ color: getZoneColor(m.scores.overall), fontSize: 11, fontWeight: 700 }}>
                      {m.scores.overall <= 40 ? 'Critical' : m.scores.overall <= 70 ? 'Moderate' : 'Optimal'}
                    </span> : <span style={{ color: '#475569', fontSize: 11 }}>Pending</span>}</td>
                    <td>{m.lastAssessment ? new Date(m.lastAssessment).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invite */}
        <div className="mac-panel" style={{ padding: 28 }}>
          <h3 style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 17, color: '#18181b', marginBottom: 8 }}>Invite Team Members</h3>
          <p style={{ color: '#71717a', fontSize: 14, marginBottom: 20 }}>Enter email addresses separated by commas to send assessment invitations.</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <input className="mac-input w-full" placeholder="alice@company.com, bob@company.com, ..." value={inviteEmails} onChange={(e) => setInviteEmails(e.target.value)} style={{ flex: 1 }} />
            <button className="mac-btn-primary justify-center" onClick={handleInvite} disabled={inviting} style={{ whiteSpace: 'nowrap' }}>
              <Send size={14} /> {inviting ? 'Sending...' : 'Send Invites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgDashboard;
