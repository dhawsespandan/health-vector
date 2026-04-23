import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Eye, EyeOff, Activity, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get('orgId');

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    age: '', gender: '', occupation: '', organizationId: orgId || '',
  });
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (!agreed) return toast.error('Please accept the terms of service');
    if (strength < 2) return toast.error('Please choose a stronger password');

    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.organizationId) delete payload.organizationId;
      const res = await api.post('/auth/register', payload);
      login(res.data.token, res.data.user);
      toast.success("Account created! Let's take your first assessment.");
      navigate('/assessment');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[480px]">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
            <Activity size={18} className="text-white" />
          </div>
          <span className="font-semibold text-xl text-zinc-900 tracking-tight">Health Vector</span>
        </Link>

        <div className="mac-panel p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-1">Create your account</h1>
            <p className="text-sm text-zinc-500">Start your wellness journey — it's free</p>
          </div>

          {orgId && (
            <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm text-center">
               You're joining via an organization invite
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">Full Name</label>
                <input id="reg-name" type="text" className="mac-input" placeholder="Priya Sharma"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input id="reg-email" type="email" className="mac-input" placeholder="priya@example.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input id="reg-password" type={showPass ? 'text' : 'password'} className="mac-input pr-10"
                  placeholder="Min 8 characters" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all"
                        style={{ background: i <= strength ? strengthColor[strength] : '#e4e4e7' }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthColor[strength] }}>{strengthLabel[strength]}</p>
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Confirm Password</label>
              <input id="reg-confirm-password" type="password" className="mac-input" placeholder="Re-enter password"
                value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="form-label">Age</label>
                <input type="number" className="mac-input" placeholder="28" min="13" max="100"
                  value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Gender</label>
                <select className="mac-input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="form-label">Occupation</label>
                <input type="text" className="mac-input" placeholder="Engineer"
                  value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <div onClick={() => setAgreed(!agreed)}
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer"
                style={{ border: `2px solid ${agreed ? '#18181b' : '#d4d4d8'}`, background: agreed ? '#18181b' : 'transparent' }}>
                {agreed && <Check size={11} color="white" />}
              </div>
              <span className="text-sm text-zinc-500 leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button id="reg-submit" type="submit" className="mac-btn-primary w-full justify-center" disabled={loading}>
              {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Creating account...</> : 'Create My Account'}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
