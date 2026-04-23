import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { User, Save, Shield, Bell, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', age: '', gender: '', occupation: '', department: '' });
  const [notifPrefs, setNotifPrefs] = useState({ email: true, monthlyReminder: true });
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', age: user.age || '', gender: user.gender || '', occupation: user.occupation || '', department: user.department || '' });
      setNotifPrefs(user.notificationPrefs || { email: true, monthlyReminder: true });
    }
    // Fetch assessment stats
    api.get('/assessment/history').then((res) => {
      const hist = res.data;
      if (hist.length > 0) {
        const scores = hist.map((a) => a.scores.overall);
        setStats({
          total: hist.length,
          avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
          best: Math.max(...scores),
          delta: hist.length >= 2 ? hist[0].scores.overall - hist[1].scores.overall : 0,
        });
      }
    }).catch(() => {});
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/auth/me', { ...form, notificationPrefs: notifPrefs });
      updateUser(res.data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (password.newPass !== password.confirm) return toast.error('Passwords do not match');
    if (password.newPass.length < 6) return toast.error('Password must be at least 6 characters');
    try {
      await api.put('/auth/change-password', { currentPassword: password.current, newPassword: password.newPass });
      toast.success('Password updated!');
      setPassword({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    }
  };

  const TABS = ['profile', 'notifications', 'security'];

  return (
    <div className="pb-16">
      <div className="page-header bg-white">
        <div className="section-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="w-14 h-14 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xl font-bold text-zinc-700 flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="page-title">{user?.name}</h1>
              <p style={{ color: '#71717a', fontSize: 14 }}>{user?.email} · <span style={{ textTransform: 'capitalize' }}>{user?.subscriptionPlan} plan</span></p>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
              {[
                { label: 'Assessments Taken', value: stats.total },
                { label: 'Average Score', value: stats.avg },
                { label: 'Best Score', value: stats.best },
                { label: 'Recent Change', value: `${stats.delta >= 0 ? '+' : ''}${stats.delta}`, color: stats.delta >= 0 ? '#10b981' : '#ef4444' },
              ].map(({ label, value, color }) => (
                <div key={label} className="mac-panel px-4 py-3">
                  <p style={{ fontSize: 11, color: '#71717a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</p>
                  <p style={{ fontWeight: 700, fontSize: 20, color: color || '#18181b' }}>{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="section-container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="grid grid-cols-[180px_1fr] gap-8">
          {/* Sidebar tabs */}
          <div>
            {TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-left capitalize mb-1 transition-colors border-0 cursor-pointer ${
                  activeTab === tab
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-transparent text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                }`}>
                {tab === 'profile' && <User size={15} />}
                {tab === 'notifications' && <Bell size={15} />}
                {tab === 'security' && <Shield size={15} />}
                {tab}
              </button>
            ))}
            <button onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-left text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors border-0 mt-2 cursor-pointer bg-transparent">
              <Trash2 size={15} /> Delete account
            </button>
          </div>

          {/* Content */}
          <div>
            {activeTab === 'profile' && (
              <div className="mac-panel" style={{ padding: 32 }}>
                <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: '#18181b', marginBottom: 24 }}>Profile Information</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <div>
                    <label className="form-label">Full Name</label>
                    <input className="mac-input w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Age</label>
                    <input type="number" className="mac-input w-full" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Gender</label>
                    <select className="mac-input w-full" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                      <option value="">Prefer not to say</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Occupation</label>
                    <input className="mac-input w-full" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} placeholder="Software Engineer" />
                  </div>
                  <div>
                    <label className="form-label">Department</label>
                    <input className="mac-input w-full" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Engineering" />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button className="mac-btn-primary justify-center" onClick={handleSave} disabled={saving}>
                    <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <span style={{ fontSize: 13, color: '#475569' }}>Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}</span>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="mac-panel" style={{ padding: 32 }}>
                <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: '#18181b', marginBottom: 24 }}>Notification Preferences</h2>
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive email updates about your wellness progress and bookings' },
                  { key: 'monthlyReminder', label: 'Monthly Reassessment Reminder', desc: 'Get reminded to retake your assessment after 30 days' },
                ].map(({ key, label, desc }) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 15, color: '#18181b', marginBottom: 4 }}>{label}</p>
                      <p style={{ fontSize: 13, color: '#71717a' }}>{desc}</p>
                    </div>
                    <div onClick={() => setNotifPrefs({ ...notifPrefs, [key]: !notifPrefs[key] })}
                      style={{ width: 44, height: 24, borderRadius: 9999, background: notifPrefs[key] ? '#06b6d4' : 'rgba(0,0,0,0.1)', cursor: 'pointer', padding: 2, transition: 'background 0.3s', flexShrink: 0 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'transform 0.3s', transform: `translateX(${notifPrefs[key] ? '18px' : '0px'})` }} />
                    </div>
                  </div>
                ))}
                <button className="mac-btn-primary justify-center" onClick={handleSave} style={{ marginTop: 24 }} disabled={saving}>
                  <Save size={15} /> {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="mac-panel" style={{ padding: 32 }}>
                <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: '#18181b', marginBottom: 24 }}>Change Password</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
                  <div>
                    <label className="form-label">Current Password</label>
                    <input type={showPass ? 'text' : 'password'} className="mac-input w-full" value={password.current} onChange={(e) => setPassword({ ...password, current: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">New Password</label>
                    <input type={showPass ? 'text' : 'password'} className="mac-input w-full" value={password.newPass} onChange={(e) => setPassword({ ...password, newPass: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Confirm New Password</label>
                    <input type={showPass ? 'text' : 'password'} className="mac-input w-full" value={password.confirm} onChange={(e) => setPassword({ ...password, confirm: e.target.value })} />
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button className="mac-btn-primary justify-center" onClick={handlePasswordChange}>Update Password</button>
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />} {showPass ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="mac-panel" style={{ padding: 40, maxWidth: 400, width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}></div>
            <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: '#18181b', marginBottom: 12 }}>Delete Account?</h3>
            <p style={{ color: '#71717a', marginBottom: 28 }}>This action cannot be undone. All your data including assessments and bookings will be permanently deleted.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="mac-btn-secondary justify-center" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button onClick={async () => { await api.delete('/auth/me'); window.location.href = '/'; }} style={{ padding: '11px 24px', borderRadius: 10, background: '#ef4444', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
