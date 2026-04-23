import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Users, Activity, Calendar, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users?limit=20'),
      api.get('/admin/appointments?limit=20'),
    ]).then(([statsRes, usersRes, apptRes]) => {
      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
      setAppointments(apptRes.data.appointments || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role } : u));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const updateApptStatus = async (id, status) => {
    try {
      await api.put(`/admin/appointments/${id}/status`, { status });
      setAppointments((prev) => prev.map((a) => a._id === id ? { ...a, status } : a));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}><div className="spinner" style={{ width: 50, height: 50 }} /></div>;

  const TABS = ['stats', 'users', 'appointments'];
  const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#10b981', cancelled: '#ef4444', completed: '#06b6d4' };

  return (
    <div style={{ padding: '0 0 60px' }}>
      <div style={{ background: 'linear-gradient(180deg, rgba(239,68,68,0.06) 0%, transparent 100%)', padding: '48px 0 40px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="section-container">
          <h1 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 28, color: '#18181b', marginBottom: 4 }}>Admin Panel</h1>
          <p style={{ color: '#71717a' }}>Platform management and analytics</p>
        </div>
      </div>

      <div className="section-container" style={{ paddingTop: 40 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: 'Inter', border: 'none', cursor: 'pointer', textTransform: 'capitalize',
                background: activeTab === tab ? '#06b6d4' : 'rgba(0,0,0,0.06)',
                color: activeTab === tab ? 'white' : '#71717a',
              }}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: <Users size={22} />, color: '#06b6d4' },
              { label: 'Assessments Today', value: stats.assessmentsToday, icon: <Activity size={22} />, color: '#10b981' },
              { label: 'Total Assessments', value: stats.totalAssessments, icon: <Activity size={22} />, color: '#a78bfa' },
              { label: 'Total Appointments', value: stats.totalAppointments, icon: <Calendar size={22} />, color: '#f59e0b' },
              { label: 'Organizations', value: stats.totalOrgs, icon: <Building2 size={22} />, color: '#06b6d4' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="mac-panel" style={{ padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <p style={{ fontSize: 12, color: '#71717a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                  <div style={{ color }}>{icon}</div>
                </div>
                <p style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 36, color }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="mac-panel" style={{ padding: 28 }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: '#18181b', marginBottom: 20 }}>User Management</h2>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Plan</th><th>Joined</th><th>Change Role</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td style={{ color: '#18181b', fontWeight: 500 }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span style={{ color: u.role === 'admin' ? '#f87171' : u.role === 'org_admin' ? '#a78bfa' : '#71717a', fontWeight: 600, textTransform: 'capitalize', fontSize: 12 }}>{u.role}</span></td>
                    <td><span className={`badge badge-${u.subscriptionPlan === 'pro' ? 'teal' : u.subscriptionPlan === 'org' ? 'purple' : ''}`}>{u.subscriptionPlan}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select value={u.role} onChange={(e) => updateRole(u._id, e.target.value)}
                        style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, color: '#94a3b8', padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>
                        <option value="user">user</option>
                        <option value="org_admin">org_admin</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="mac-panel" style={{ padding: 28 }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, color: '#18181b', marginBottom: 20 }}>Appointment Management</h2>
            <table className="data-table">
              <thead><tr><th>User</th><th>Type</th><th>Date</th><th>Time</th><th>Status</th><th>Update Status</th></tr></thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id}>
                    <td style={{ color: '#18181b', fontWeight: 500 }}>{a.name}</td>
                    <td>{a.assessmentType}</td>
                    <td>{new Date(a.date).toLocaleDateString()}</td>
                    <td>{a.timeSlot}</td>
                    <td><span style={{ color: STATUS_COLORS[a.status], fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>{a.status}</span></td>
                    <td>
                      <select value={a.status} onChange={(e) => updateApptStatus(a._id, e.target.value)}
                        style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, color: '#94a3b8', padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>
                        <option value="pending">pending</option>
                        <option value="confirmed">confirmed</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
